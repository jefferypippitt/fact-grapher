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

function validateImageDataUrl(
  imageDataUrl: unknown
): asserts imageDataUrl is string {
  if (!imageDataUrl || typeof imageDataUrl !== "string") {
    throw new Error("Invalid image data URL returned");
  }

  if (!imageDataUrl.startsWith("data:")) {
    throw new Error(
      `Image data URL format invalid: ${imageDataUrl.substring(0, 50)}...`
    );
  }
}

function logImageGeneration(imageDataUrl: string, userId: string) {
  if (
    process.env.NODE_ENV === "development" ||
    process.env.LOG_IMAGE_GENERATION
  ) {
    console.log("Tool generateImage returning:", {
      hasDataUrl: !!imageDataUrl,
      dataUrlStartsWith: imageDataUrl.substring(0, 30),
      dataUrlLength: imageDataUrl.length,
      userId,
    });
  }
}

function logImageGenerationError(
  error: unknown,
  userId: string,
  prompt: string
) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  // Always log errors in production
  console.error("[IMAGE GENERATION ERROR]", {
    error: errorMessage,
    stack: errorStack,
    userId,
    prompt: prompt.substring(0, 50),
    timestamp: new Date().toISOString(),
  });
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
  style: string | undefined,
  userId: string
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

  // Ensure mediaType is valid
  const validMediaType = mediaType.startsWith("image/")
    ? mediaType
    : "image/png";

  // Construct the data URL first to ensure we always return it
  const imageDataUrl = `data:${validMediaType};base64,${firstImage.base64}`;

  // Log for debugging (only in development or when explicitly enabled)
  if (
    process.env.NODE_ENV === "development" ||
    process.env.LOG_IMAGE_GENERATION
  ) {
    console.log("Generated image data URL:", {
      mediaType: validMediaType,
      base64Length: firstImage.base64.length,
      dataUrlPrefix: imageDataUrl.substring(0, 50),
      userId,
    });
  }

  // Save image to database asynchronously (non-blocking - don't fail if save fails)
  // Pass userId directly to avoid headers context issues in production
  Promise.resolve()
    .then(async () => {
      try {
        await saveImage(prompt, firstImage.base64, validMediaType, {
          tokensCost: 1,
          userId,
        });
        // Always log success in production for debugging
        console.log("[IMAGE SAVE SUCCESS]", {
          userId,
          prompt: prompt.substring(0, 50),
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        // Log error with full details for debugging
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;
        // Always log errors in production
        console.error("[IMAGE SAVE ERROR]", {
          error: errorMessage,
          stack: errorStack,
          userId,
          prompt: prompt.substring(0, 50),
          hasBase64: !!firstImage.base64,
          base64Length: firstImage.base64?.length,
          timestamp: new Date().toISOString(),
        });
      }
    })
    .catch((error) => {
      // Log any promise chain errors
      // Always log promise chain errors
      console.error("[IMAGE SAVE PROMISE ERROR]", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        userId,
        timestamp: new Date().toISOString(),
      });
    });

  return imageDataUrl;
}

function validateRequest(
  messages: ChatMessage[],
  userTokens: number
): Response | null {
  const TOKENS_REQUIRED = 1;

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

  const lastUserMessage = messages.filter((msg) => msg.role === "user").at(-1);

  if (!lastUserMessage) {
    return new Response(JSON.stringify({ error: "No user message found" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return null;
}

function prepareMessages(
  messages: ChatMessage[],
  model: string,
  style?: string
): { messagesToProcess: ChatMessage[]; userPrompt: string } {
  const lastUserMessage = messages.filter((msg) => msg.role === "user").at(-1);

  if (!lastUserMessage) {
    throw new Error("No user message found");
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

  return { messagesToProcess, userPrompt };
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

  const userTokens = await getUserTokens();
  const validationError = validateRequest(messages, userTokens);

  if (validationError) {
    return validationError;
  }

  const TOKENS_REQUIRED = 1;
  await deductTokens(session.user.id, TOKENS_REQUIRED);

  const baseModel =
    model === "google/gemini-3-pro-image" ? "google/gemini-3-pro" : model;

  const { messagesToProcess, userPrompt } = prepareMessages(
    messages,
    model,
    style
  );

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
        try {
          const imageDataUrl = await generateAndSaveImage(
            prompt,
            infographicStyle,
            session.user.id
          );

          validateImageDataUrl(imageDataUrl);
          logImageGeneration(imageDataUrl, session.user.id);

          return imageDataUrl;
        } catch (error) {
          logImageGenerationError(error, session.user.id, prompt);
          throw error;
        }
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
    onFinish: (result) => {
      // Log completion for debugging
      if (
        process.env.NODE_ENV === "development" ||
        process.env.LOG_IMAGE_GENERATION
      ) {
        console.log("Stream finished:", {
          userId: session.user.id,
          textLength: result.text?.length ?? 0,
          toolCalls: result.toolCalls?.length ?? 0,
          finishReason: result.finishReason,
        });
      }
    },
  });

  return streamResult.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: false,
  });
}
