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

/**
 * Determines the thinking level based on query complexity.
 * Complex topics get 'high' thinking for deeper reasoning,
 * simple queries get 'low' for faster responses.
 */
function determineThinkingLevel(prompt: string): "low" | "high" {
  const complexIndicators = [
    "history",
    "timeline",
    "compare",
    "comparison",
    "analyze",
    "explain",
    "process",
    "lifecycle",
    "evolution",
    "statistical",
    "scientific",
    "research",
    "data",
    "empire",
    "war",
    "economic",
    "how does",
    "why did",
    "what caused",
  ];

  const isComplex =
    complexIndicators.some((indicator) =>
      prompt.toLowerCase().includes(indicator)
    ) || prompt.length > 100;

  return isComplex ? "high" : "low";
}

export async function POST(req: Request) {
  const {
    messages,
    model,
    style,
  }: {
    messages: ChatMessage[];
    model: string;
    style?: string;
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
  // Always use Gemini 3 Pro for text generation (with optional Google Search grounding)
  const baseModel =
    model === "google/gemini-3-pro-image" ? "google/gemini-3-pro" : model;

  // Only use the last user message - no conversation history needed
  // Each request is independent, allowing continuous generation as long as users have tokens
  const lastUserMessage = messages.filter((msg) => msg.role === "user").at(-1);

  if (!lastUserMessage) {
    return new Response(JSON.stringify({ error: "No user message found" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Build the prompt from the user's message
  const userPrompt =
    lastUserMessage.parts
      ?.filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("") || "";

  // Create a clean message array with just the current user request
  // Add style to prompt if provided
  const finalPrompt =
    style?.trim() && model === "google/gemini-3-pro-image"
      ? `Create a ${style} infographic: ${userPrompt}`
      : userPrompt;

  const messagesToProcess: ChatMessage[] = [
    {
      ...lastUserMessage,
      parts: [{ type: "text", text: finalPrompt }],
    },
  ];

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

        const gateway = createGateway({
          apiKey,
        });

        // Build a direct prompt that explicitly requires real-world data
        // No placeholder text - use actual facts, numbers, dates, names, statistics
        const imageModel = gateway("google/gemini-3-pro-image");

        const imagePrompt = infographicStyle
          ? `Create a ${infographicStyle} infographic about: ${prompt}

CRITICAL REQUIREMENTS - Use REAL data only (NO placeholder text like "Lorem ipsum"):
- Include actual dates, years, and time periods
- Use real names of people, places, organizations, and events
- Include specific numbers, statistics, percentages, and quantities
- Display factual information, verified data, and accurate details
- All text labels must be meaningful and factual
- NO placeholder text, NO "Lorem ipsum", NO generic filler content
- Every number, date, name, and fact must be real and accurate

Make the infographic visually clear and informative with real-world information.`
          : `Create an informative infographic about: ${prompt}

CRITICAL REQUIREMENTS - Use REAL data only (NO placeholder text like "Lorem ipsum"):
- Include actual dates, years, and time periods
- Use real names of people, places, organizations, and events
- Include specific numbers, statistics, percentages, and quantities
- Display factual information, verified data, and accurate details
- All text labels must be meaningful and factual
- NO placeholder text, NO "Lorem ipsum", NO generic filler content
- Every number, date, name, and fact must be real and accurate

Make the infographic visually clear and informative with real-world information.`;

        const imageResult = await generateText({
          model: imageModel,
          prompt: imagePrompt,
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

  // Determine thinking level based on query complexity
  const thinkingLevel = determineThinkingLevel(userPrompt);

  // Generate response - each request is independent, no history needed
  const streamResult = streamText({
    model: baseModel,
    messages: convertToModelMessages(messagesToProcess),
    tools: chatTools,
    stopWhen: stepCountIs(2), // Allow 2 steps: 1 for tool call, 1 for description text
    system:
      "You are Fact-Grapher, an AI assistant that creates accurate, informative infographics. When users request infographics, use the generateImage tool to create them. After the tool generates an image, you MUST immediately provide a clear, detailed, and educational explanation of what the infographic illustrates. Explain the key concepts, facts, timelines, processes, or information that the infographic conveys. Be comprehensive, helpful, and educational in your description. Always write a description after generating an image - this is required.",
    providerOptions: {
      google: {
        // Always enable Google Search grounding for real-time, accurate infographics
        useSearchGrounding: true,
        thinkingConfig: {
          thinkingLevel,
          includeThoughts: false,
        },
      },
    },
  });

  // Send sources back to the client (reasoning is used internally for better quality, not displayed)
  return streamResult.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: false,
  });
}
