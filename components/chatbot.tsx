"use client";

import { useChat } from "@ai-sdk/react";
import { CopyIcon, GlobeIcon } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Conversation,
  ConversationAutoScroll,
  ConversationContent,
  ConversationScrollButton,
  ConversationScrollIndicator,
} from "@/components/ai-elements/conversation";
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

const suggestions = [
  "How to make an omlete",
  "The end of World War 2",
  "Timeline of the Roman Empire",
  "Explain the lifecyle of a coffee bean",
];

const models = [
  {
    name: "GPT 4o",
    value: "openai/gpt-4o",
  },
  {
    name: "Deepseek R1",
    value: "deepseek/deepseek-r1",
  },
];

export default function AIChat() {
  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>(models[0].value);
  const [webSearch, setWebSearch] = useState(false);
  const { messages, sendMessage, status } = useChat();

  const handleSubmit = (
    message: { text: string; files?: unknown[] },
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (message.text.trim()) {
      sendMessage(
        { text: message.text },
        {
          body: {
            model,
            webSearch,
          },
        }
      );
      setInput("");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(
      { text: suggestion },
      {
        body: {
          model,
          webSearch,
        },
      }
    );
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
                            default:
                              return null;
                          }
                        })}
                        {message.role === "assistant" &&
                          (status === "submitted" || status === "streaming") &&
                          message.parts.filter((part) => part.type === "text")
                            .length === 0 && (
                            <div className="flex items-center justify-center py-4">
                              <Loader />
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
              messages.at(-1)?.role !== "assistant" && (
                <Message from="assistant">
                  <MessageContent>
                    <div className="flex items-center justify-center py-4">
                      <Loader />
                    </div>
                  </MessageContent>
                </Message>
              )}
          </ConversationContent>
          <ConversationScrollIndicator />
          <ConversationScrollButton />
        </Conversation>

        <div className="mt-4 flex flex-col gap-4">
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
              </PromptInputTools>
              <PromptInputSubmit disabled={!input} status={status} />
            </PromptInputFooter>
          </PromptInput>

          <Suggestions className="mt-4">
            {suggestions.map((suggestion) => (
              <Suggestion
                key={suggestion}
                onClick={handleSuggestionClick}
                suggestion={suggestion}
              />
            ))}
          </Suggestions>
        </div>
      </div>
    </div>
  );
}
