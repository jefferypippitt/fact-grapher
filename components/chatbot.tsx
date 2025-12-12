"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { CopyIcon, GlobeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  Conversation,
  ConversationAutoScroll,
  ConversationContent,
  ConversationScrollButton,
  ConversationScrollIndicator,
} from "@/components/ai-elements/conversation";
import { Image } from "@/components/ai-elements/image";
import { Loader } from "@/components/ai-elements/loader";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import { StyleDetails } from "@/components/style-details";
import { useUserTokens } from "@/lib/hooks/use-user-tokens";

const suggestions = [
  "How to make an omlete",
  "The end of World War 2",
  "Timeline of the Roman Empire",
  "Explain the lifecyle of a coffee bean",
];

const DATA_URL_REGEX = /^data:[^;]+;base64,(.+)$/;
const MEDIA_TYPE_REGEX = /^data:([^;]+);base64,/;

type ToolPart = {
  state?: string;
  input?: { prompt?: string };
  output?: string;
  errorText?: string;
};

function renderInputStreamingState(messageId: string, index: number) {
  return (
    <div
      className="flex items-center gap-2 py-4"
      key={`${messageId}-tool-generateImage-${index}`}
    >
      <Loader size={16} />
      <span className="text-sm text-zinc-400">Generating image</span>
    </div>
  );
}

function renderInputAvailableState(messageId: string, index: number) {
  return (
    <div
      className="flex items-center gap-2 py-4"
      key={`${messageId}-tool-generateImage-${index}`}
    >
      <Loader size={16} />
      <span className="text-sm text-zinc-400">Generating image</span>
    </div>
  );
}

function renderOutputAvailableState(
  messageId: string,
  index: number,
  output: string
) {
  // Extract base64 from data URL
  const dataUrl = output;
  const base64Match = dataUrl.match(DATA_URL_REGEX);
  const extractedBase64 = base64Match?.[1];
  const base64 = extractedBase64 ?? dataUrl;
  const mediaTypeMatch = dataUrl.match(MEDIA_TYPE_REGEX);
  const mediaType = mediaTypeMatch?.[1] || "image/png";

  if (!base64 || base64.length === 0) {
    return null;
  }

  return (
    <div className="my-4" key={`${messageId}-tool-generateImage-${index}`}>
      <Image
        alt="Generated image"
        base64={base64}
        className="mx-auto max-w-md rounded-lg"
        mediaType={mediaType}
      />
    </div>
  );
}

function renderOutputErrorState(
  messageId: string,
  index: number,
  errorText?: string
) {
  return (
    <div
      className="mt-1 mb-2 rounded border border-zinc-700 bg-zinc-800/50 p-2"
      key={`${messageId}-tool-generateImage-${index}`}
    >
      <div className="text-red-400 text-sm">
        Error: {errorText ?? "Failed to generate image"}
      </div>
    </div>
  );
}

function renderToolResultImage(
  part: unknown,
  messageId: string,
  index: number
) {
  // Handle tool results - check if it's a generateImage tool result
  if (
    typeof part === "object" &&
    part !== null &&
    "type" in part &&
    part.type === "tool-generateImage"
  ) {
    const toolPart = part as ToolPart;

    switch (toolPart.state) {
      case "input-streaming":
        return renderInputStreamingState(messageId, index);

      case "input-available":
        return renderInputAvailableState(messageId, index);

      case "output-available":
        if (
          toolPart.output &&
          typeof toolPart.output === "string" &&
          toolPart.output.startsWith("data:image/")
        ) {
          return renderOutputAvailableState(messageId, index, toolPart.output);
        }
        return null;

      case "output-error":
        return renderOutputErrorState(messageId, index, toolPart.errorText);

      default:
        return null;
    }
  }
  return null;
}

const models = [
  {
    name: "Google Gemini 3 Pro Image",
    value: "google/gemini-3-pro-image",
  },
];

const infographicStyles = [
  "Timeline",
  "Comparison",
  "Process Infographics",
  "Statistical infographics",
  "Flowchart",
  "Hierarchical infographics",
];

export default function AIChat() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>(models[0].value);
  const [webSearch, setWebSearch] = useState(false);
  const [style, setStyle] = useState<string>("");
  const previousModelRef = useRef<string>(models[0].value);
  const { refetch: refetchTokens } = useUserTokens();

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    onError: (err) => {
      const errorMessage = err instanceof Error ? err.message : String(err);

      // Check if error is related to insufficient tokens
      if (
        errorMessage.toLowerCase().includes("insufficient tokens") ||
        errorMessage.toLowerCase().includes("don't have enough tokens")
      ) {
        toast.error("You need tokens to use the chatbot.", {
          action: {
            label: "Buy Tokens",
            onClick: () => router.push("/dashboard/buytoken"),
          },
        });
        // Refetch tokens to update UI even on error
        refetchTokens();
      } else {
        toast.error(errorMessage);
      }
    },
    onFinish: () => {
      // Refetch tokens after a successful chat message to update the UI
      refetchTokens();
    },
  });

  const handleSubmit = (
    message: { text: string; files?: unknown[] },
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!message.text.trim()) {
      return;
    }

    sendMessage(
      { text: message.text },
      {
        body: {
          model,
          webSearch,
          style,
          previousModel: previousModelRef.current,
        },
      }
    );
    previousModelRef.current = model;
    setInput("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(
      { text: suggestion },
      {
        body: {
          model,
          webSearch,
          style,
          previousModel: previousModelRef.current,
        },
      }
    );
    previousModelRef.current = model;
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className="relative mx-auto size-full h-screen max-h-[800px] max-w-5xl p-6">
      <div className="flex h-full flex-col">
        <Conversation className="min-h-0 flex-1">
          <ConversationAutoScroll messages={messages} status={status} />
          <ConversationContent>
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === "assistant" && (
                  <Sources key={`sources-${message.id}`}>
                    {message.parts.map((part, i) => {
                      if (part.type === "source-url") {
                        return (
                          <div key={`${message.id}-source-${i}`}>
                            <SourcesTrigger
                              count={
                                message.parts.filter(
                                  (partItem) => partItem.type === "source-url"
                                ).length
                              }
                            />
                            <SourcesContent>
                              <Source href={part.url} title={part.url} />
                            </SourcesContent>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </Sources>
                )}

                <Message from={message.role}>
                  <MessageContent>
                    {message.role === "assistant" ? (
                      <>
                        {message.parts.map((part, i) => {
                          switch (part.type) {
                            case "text":
                              return (
                                <MessageResponse
                                  key={`${message.id}-text-${i}`}
                                >
                                  {part.text}
                                </MessageResponse>
                              );
                            case "reasoning":
                              return (
                                <Reasoning
                                  className="w-full"
                                  isStreaming={status === "streaming"}
                                  key={`${message.id}-reasoning-${i}`}
                                >
                                  <ReasoningTrigger />
                                  <ReasoningContent>
                                    {part.text}
                                  </ReasoningContent>
                                </Reasoning>
                              );
                            case "file": {
                              // Extract base64 from data URL if present
                              const dataUrl = part.url ?? "";
                              const base64Match = dataUrl.match(DATA_URL_REGEX);
                              const extractedBase64 = base64Match?.[1];
                              const base64 = extractedBase64 ?? dataUrl;

                              if (
                                !base64 ||
                                base64.length === 0 ||
                                !part.mediaType
                              ) {
                                return null;
                              }

                              return (
                                <div
                                  className="my-4"
                                  key={`${message.id}-file-${i}`}
                                >
                                  <Image
                                    alt="Generated image"
                                    base64={base64}
                                    className="mx-auto max-w-md rounded-lg"
                                    mediaType={part.mediaType}
                                  />
                                </div>
                              );
                            }
                            case "tool-generateImage":
                              return renderToolResultImage(part, message.id, i);
                            default:
                              return null;
                          }
                        })}
                        {message.role === "assistant" &&
                          (status === "submitted" || status === "streaming") &&
                          message.parts.filter((part) => part.type === "text")
                            .length === 0 &&
                          message.parts.some(
                            (part) =>
                              part.type === "tool-generateImage" &&
                              part.state === "output-available"
                          ) &&
                          !message.parts.some(
                            (part) =>
                              part.type === "tool-generateImage" &&
                              (part.state === "input-streaming" ||
                                part.state === "input-available")
                          ) && (
                            <div className="flex items-center gap-2 py-4">
                              <Loader size={16} />
                              <span className="text-sm text-zinc-400">
                                Generating overview
                              </span>
                            </div>
                          )}
                      </>
                    ) : (
                      message.parts
                        .filter((part) => part.type === "text")
                        .map((part, i) => (
                          <span key={`${message.id}-text-${i}`}>
                            {part.text}
                          </span>
                        ))
                    )}
                  </MessageContent>
                  {message.role === "assistant" &&
                    message.parts.some((part) => part.type === "text") &&
                    status !== "streaming" &&
                    status !== "submitted" && (
                      <MessageActions>
                        <MessageAction
                          label="Copy"
                          onClick={() =>
                            handleCopy(
                              message.parts
                                .filter((part) => part.type === "text")
                                .map((part) => part.text)
                                .join("\n")
                            )
                          }
                          tooltip="Copy to clipboard"
                        >
                          <CopyIcon className="size-4" />
                        </MessageAction>
                      </MessageActions>
                    )}
                </Message>
              </div>
            ))}
            {status === "submitted" &&
              messages.length > 0 &&
              messages.at(-1)?.role !== "assistant" &&
              !messages.some(
                (msg) =>
                  msg.role === "assistant" &&
                  msg.parts.some(
                    (part) =>
                      part.type === "tool-generateImage" &&
                      (part.state === "input-streaming" ||
                        part.state === "input-available" ||
                        part.state === "output-available")
                  )
              ) && (
                <Message from="assistant">
                  <MessageContent>
                    <div className="flex items-center gap-2 py-4">
                      <Loader size={16} />
                    </div>
                  </MessageContent>
                </Message>
              )}
          </ConversationContent>
          <ConversationScrollIndicator />
          <ConversationScrollButton />
        </Conversation>

        <div className="mt-4 flex flex-col gap-4">
          <Suggestions className="mt-4">
            {suggestions.map((suggestion) => (
              <Suggestion
                key={suggestion}
                onClick={handleSuggestionClick}
                suggestion={suggestion}
              />
            ))}
          </Suggestions>
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
            <PromptInputFooter>
              <PromptInputTools>
                <PromptInputButton
                  onClick={() => setWebSearch(!webSearch)}
                  variant={webSearch ? "default" : "ghost"}
                >
                  <GlobeIcon size={16} />
                  <span>Search</span>
                </PromptInputButton>
                <PromptInputSelect
                  onValueChange={(value) => {
                    previousModelRef.current = model;
                    setModel(value);
                  }}
                  value={model}
                >
                  <PromptInputSelectTrigger>
                    <PromptInputSelectValue />
                  </PromptInputSelectTrigger>
                  <PromptInputSelectContent>
                    {models.map((modelOption) => (
                      <PromptInputSelectItem
                        key={modelOption.value}
                        value={modelOption.value}
                      >
                        {modelOption.name}
                      </PromptInputSelectItem>
                    ))}
                  </PromptInputSelectContent>
                </PromptInputSelect>
                {model === "google/gemini-3-pro-image" && (
                  <PromptInputSelect
                    onValueChange={(value) => {
                      setStyle(value);
                    }}
                    value={style || undefined}
                  >
                    <PromptInputSelectTrigger>
                      <PromptInputSelectValue placeholder="Select style" />
                    </PromptInputSelectTrigger>
                    <PromptInputSelectContent>
                      {infographicStyles.map((styleOption) => (
                        <PromptInputSelectItem
                          key={styleOption}
                          value={styleOption}
                        >
                          {styleOption}
                        </PromptInputSelectItem>
                      ))}
                    </PromptInputSelectContent>
                  </PromptInputSelect>
                )}
              </PromptInputTools>
              <PromptInputSubmit disabled={!input} status={status} />
            </PromptInputFooter>
          </PromptInput>

          <div className="flex justify-center">
            <StyleDetails />
          </div>
        </div>
      </div>
    </div>
  );
}
