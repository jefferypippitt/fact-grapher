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

export const maxDuration = 30;

export type ChatTools = InferUITools<{
  generateImage: ReturnType<typeof tool>;
}>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

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

function buildImagePrompt(prompt: string, style?: string): string {
  const requirements = `CRITICAL REQUIREMENTS - Use REAL data only (NO placeholder text like "Lorem ipsum"):
- Include actual dates, years, and time periods
- Use real names of people, places, organizations, and events
- Include specific numbers, statistics, percentages, and quantities
- Display factual information, verified data, and accurate details
- All text labels must be meaningful and factual
- NO placeholder text, NO "Lorem ipsum", NO generic filler content
- Every number, date, name, and fact must be real and accurate

Make the infographic visually clear and informative with real-world information.`;

  if (style) {
    return `Create a ${style} infographic about: ${prompt}

${requirements}`;
  }

  return `Create an informative infographic about: ${prompt}

${requirements}`;
}

async function generateAndSaveImage(
  prompt: string,
  style: string | undefined
): Promise<string> {
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

  const imageModel = gateway("google/gemini-3-pro-image");
  const imagePrompt = buildImagePrompt(prompt, style);

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
    imageResult.files?.filter((f) => f.mediaType?.startsWith("image/")) || [];

  if (imageFiles.length === 0) {
    throw new Error("No image generated - The model did not return any images");
  }

  const firstImage = imageFiles[0];
  const mediaType = firstImage.mediaType || "image/png";

  if (!firstImage.base64) {
    throw new Error(
      "No base64 data in generated image - The model did not return image data"
    );
  }

  // Save image to database (non-blocking - don't fail if save fails)
  try {
    await saveImage(prompt, firstImage.base64, mediaType, 1);
  } catch (error) {
    console.error("Failed to save image to database:", error);
    // Continue - still return the image data URL so it displays in the chatbot
  }

  return `data:${mediaType};base64,${firstImage.base64}`;
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

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

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

  await deductTokens(session.user.id, TOKENS_REQUIRED);

  const baseModel =
    model === "google/gemini-3-pro-image" ? "google/gemini-3-pro" : model;

  const lastUserMessage = messages.filter((msg) => msg.role === "user").at(-1);

  if (!lastUserMessage) {
    return new Response(JSON.stringify({ error: "No user message found" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const userPrompt =
    lastUserMessage.parts
      ?.filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("") || "";

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
        if (!session?.user) {
          throw new Error("Unauthorized");
        }

        return await generateAndSaveImage(prompt, infographicStyle);
      },
      toModelOutput: () => ({
        type: "content",
        value: [
          {
            type: "text",
            text: "I've successfully generated an infographic image. The image has been created and is displayed above. Now I will provide you with a detailed, educational explanation of what this infographic illustrates, including the key concepts, facts, and information it conveys.",
          },
        ],
      }),
    }),
  };

  const thinkingLevel = determineThinkingLevel(userPrompt);

  const streamResult = streamText({
    model: baseModel,
    messages: convertToModelMessages(messagesToProcess),
    tools: chatTools,
    stopWhen: stepCountIs(2),
    system:
      "You are Fact-Grapher, an AI assistant that creates accurate, informative infographics. When users request infographics, use the generateImage tool to create them. After the tool generates an image, you MUST immediately provide a clear, detailed, and educational explanation of what the infographic illustrates. Explain the key concepts, facts, timelines, processes, or information that the infographic conveys. Be comprehensive, helpful, and educational in your description. Always write a description after generating an image - this is required.",
    providerOptions: {
      google: {
        useSearchGrounding: true,
        thinkingConfig: {
          thinkingLevel,
          includeThoughts: false,
        },
      },
    },
  });

  return streamResult.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: false,
  });
}
