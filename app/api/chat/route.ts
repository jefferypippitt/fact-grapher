import { createGateway } from "@ai-sdk/gateway";
import {
  convertToModelMessages,
  generateText,
  type InferUITools,
  stepCountIs,
  streamText,
  tool,
  type UIDataTypes,
  type UIMessage,
} from "ai";
import { headers } from "next/headers";
import { z } from "zod";
import { saveImage } from "@/actions/images";
import { deductTokens, getUserTokens } from "@/actions/tokens";
import { auth } from "@/lib/auth";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Type definitions for chat messages
// The actual tools are created in the POST handler
export type ChatTools = InferUITools<{
  generateImage: ReturnType<typeof tool>;
}>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  const {
    messages,
    model,
    webSearch,
    style,
    previousModel,
  }: {
    messages: ChatMessage[];
    model: string;
    webSearch: boolean;
    style?: string;
    previousModel?: string;
  } = await req.json();

  // Check authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Check token balance (1 token per chat request)
  const TOKENS_REQUIRED = 1;
  const userTokens = await getUserTokens();

  if (userTokens < TOKENS_REQUIRED) {
    return new Response(
      JSON.stringify({
        error: "Insufficient tokens",
        message:
          "You don't have enough tokens to use the chatbot. Please purchase a token pack.",
        tokensRequired: TOKENS_REQUIRED,
        tokensAvailable: userTokens,
      }),
      { status: 402, headers: { "Content-Type": "application/json" } }
    );
  }

  // Deduct tokens before processing
  await deductTokens(session.user.id, TOKENS_REQUIRED);

  // Determine the base model to use
  // If the user selected the image model, use a text model that can call tools
  // Otherwise use the selected model or web search model
  let baseModel = model;
  if (webSearch) {
    baseModel = "perplexity/sonar";
  } else if (model === "google/gemini-3-pro-image") {
    baseModel = "google/gemini-3-pro";
  }

  // Detect model switch and truncate messages if needed to prevent token limit errors
  const modelChanged = previousModel && previousModel !== model;
  const MAX_MESSAGES_ON_MODEL_SWITCH = 20; // Keep last 20 messages when switching models
  const MAX_TOTAL_CHARS = 800_000; // Conservative estimate: ~200k tokens (4 chars per token)

  let messagesToProcess = messages;

  // Calculate total character count as a proxy for token count
  const totalChars = messages.reduce((sum, msg) => {
    const textContent =
      msg.parts
        ?.filter((p) => p.type === "text")
        .map((p) => p.text)
        .join("") || "";
    return sum + textContent.length;
  }, 0);

  // If model changed or messages are too long, truncate to prevent token limit errors
  // Keep only recent messages to maintain context while staying within token limits
  if (modelChanged || totalChars > MAX_TOTAL_CHARS) {
    messagesToProcess = messages.slice(-MAX_MESSAGES_ON_MODEL_SWITCH);
  }

  // If style is provided and user wants image generation, add it to the last user message
  // so the model knows to use the style parameter when calling the tool
  const messagesToSend =
    style?.trim() && model === "google/gemini-3-pro-image"
      ? messagesToProcess.map((msg, index) => {
          if (
            index === messagesToProcess.length - 1 &&
            msg.role === "user" &&
            msg.parts
          ) {
            const lastUserMessage = messagesToProcess.at(-1);
            const basePrompt =
              lastUserMessage?.parts
                ?.filter((p) => p.type === "text")
                .map((p) => p.text)
                .join("") || "";

            return {
              ...msg,
              parts: msg.parts.map((part) =>
                part.type === "text"
                  ? {
                      ...part,
                      text: `Create a ${style} infographic: ${basePrompt}`,
                    }
                  : part
              ),
            };
          }
          return msg;
        })
      : messagesToProcess;

  // Create tools
  const chatTools = {
    generateImage: tool({
      description:
        "Generate an infographic image based on a prompt. Use this when the user wants to create a visual infographic.",
      inputSchema: z.object({
        prompt: z
          .string()
          .describe("The prompt describing what infographic to generate"),
        style: z
          .string()
          .optional()
          .describe(
            "Optional style for the infographic (e.g., Timeline, Comparison, Process Infographics, etc.)"
          ),
      }),
      execute: async ({ prompt, style: infographicStyle }) => {
        // Session is already validated at the top of POST handler
        if (!session?.user) {
          throw new Error("Unauthorized");
        }

        const apiKey = process.env.AI_GATEWAY_API_KEY;

        if (!apiKey) {
          throw new Error(
            "No AI Gateway API key configured. Please add AI_GATEWAY_API_KEY to environment variables."
          );
        }

        if (!prompt?.trim()) {
          throw new Error("Prompt is required");
        }

        // Build the image generation prompt
        const imageGenerationPrompt = infographicStyle
          ? `Create a ${infographicStyle} infographic: ${prompt}. Include clear labels, diagrams, and visual elements.`
          : `Create an accurate, informative infographic explaining: ${prompt}. Include clear labels, diagrams, and visual elements.`;

        const gateway = createGateway({
          apiKey,
        });

        // Use the selected model for image generation
        const imageModel = gateway("google/gemini-3-pro-image");

        const imageResult = await generateText({
          model: imageModel,
          prompt: imageGenerationPrompt,
          providerOptions: {
            google: {
              responseModalities: ["IMAGE"],
              imageConfig: {
                aspectRatio: "1:1",
              },
            },
          },
        });

        const imageFiles =
          imageResult.files?.filter((f) => f.mediaType?.startsWith("image/")) ||
          [];

        if (imageFiles.length === 0) {
          throw new Error(
            "No image generated - The model did not return any images"
          );
        }

        const firstImage = imageFiles[0];
        const mediaType = firstImage.mediaType || "image/png";

        // Save the image to database
        // Pass tokensCost=1 to track usage, but tokens are already deducted above
        await saveImage(prompt, firstImage.base64, mediaType, 1);

        // Return the image data as a data URL string
        // The chatbot component will extract and display this from the tool result
        return `data:${mediaType};base64,${firstImage.base64}`;
      },
      toModelOutput: () => {
        // Returning base64 image will exceed the context window of the model.
        // Return a placeholder text that instructs the model to generate a description.
        return {
          type: "content",
          value: [
            {
              type: "text",
              text: "I've successfully generated an infographic image. The image has been created and is displayed above. Now I will provide you with a detailed, educational explanation of what this infographic illustrates, including the key concepts, facts, and information it conveys.",
            },
          ],
        };
      },
    }),
  };

  const streamResult = streamText({
    model: baseModel,
    messages: convertToModelMessages(messagesToSend),
    tools: chatTools,
    stopWhen: stepCountIs(2), // Allow 2 steps: 1 for tool call, 1 for description text
    system:
      "You are Fact-Grapher, an AI assistant that creates accurate, informative infographics. When users request infographics, use the generateImage tool to create them. After the tool generates an image, you MUST immediately provide a clear, detailed, and educational explanation of what the infographic illustrates. Explain the key concepts, facts, timelines, processes, or information that the infographic conveys. Be comprehensive, helpful, and educational in your description. Always write a description after generating an image - this is required.",
  });

  // send sources and reasoning back to the client
  return streamResult.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}
