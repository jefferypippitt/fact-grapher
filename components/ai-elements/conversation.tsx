"use client";

import { ArrowDownIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ConversationProps = ComponentProps<typeof StickToBottom>;

export const Conversation = ({ className, ...props }: ConversationProps) => (
  <StickToBottom
    className={cn(
      "relative flex-1 overflow-y-hidden",
      "scroll-smooth",
      "conversation-scrollbar",
      className
    )}
    initial="smooth"
    resize="smooth"
    role="log"
    {...props}
  />
);

export type ConversationContentProps = ComponentProps<
  typeof StickToBottom.Content
>;

export const ConversationContent = ({
  className,
  ...props
}: ConversationContentProps) => (
  <StickToBottom.Content
    className={cn(
      "flex flex-col gap-8 p-4",
      "conversation-scrollbar",
      className
    )}
    {...props}
  />
);

export type ConversationEmptyStateProps = ComponentProps<"div"> & {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
};

export const ConversationEmptyState = ({
  className,
  title = "No messages yet",
  description = "Start a conversation to see messages here",
  icon,
  children,
  ...props
}: ConversationEmptyStateProps) => (
  <div
    className={cn(
      "flex size-full flex-col items-center justify-center gap-3 p-8 text-center",
      className
    )}
    {...props}
  >
    {children ?? (
      <>
        {icon ? <div className="text-muted-foreground">{icon}</div> : null}
        <div className="space-y-1">
          <h3 className="font-medium text-sm">{title}</h3>
          {description ? (
            <p className="text-muted-foreground text-sm">{description}</p>
          ) : null}
        </div>
      </>
    )}
  </div>
);

export type ConversationScrollIndicatorProps = ComponentProps<"div">;

export const ConversationScrollIndicator = ({
  className,
  ...props
}: ConversationScrollIndicatorProps) => {
  const { isAtBottom } = useStickToBottomContext();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isAtBottom) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 150);
      return () => {
        clearTimeout(timer);
      };
    }
    setIsVisible(false);
  }, [isAtBottom]);

  if (isAtBottom) {
    return null;
  }

  return (
    <div
      className={cn(
        "pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-24",
        "bg-linear-to-t from-background via-background/80 to-transparent",
        "transition-opacity duration-300 ease-in-out",
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
      {...props}
    />
  );
};

export type ConversationScrollButtonProps = ComponentProps<typeof Button>;

export const ConversationScrollButton = ({
  className,
  ...props
}: ConversationScrollButtonProps) => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();
  const [isVisible, setIsVisible] = useState(false);

  const handleScrollToBottom = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  useEffect(() => {
    if (!isAtBottom) {
      // Small delay for smooth fade-in
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      return () => {
        clearTimeout(timer);
      };
    }
    setIsVisible(false);
  }, [isAtBottom]);

  if (isAtBottom) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute bottom-4 left-[50%] z-10 translate-x-[-50%]",
        "transition-opacity duration-300 ease-in-out",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      <Button
        className={cn(
          "rounded-full shadow-lg",
          "bg-background/80 backdrop-blur-sm",
          "border-border/50",
          "hover:bg-background hover:shadow-xl",
          "transition-all duration-200",
          "hover:scale-105 active:scale-95",
          className
        )}
        onClick={handleScrollToBottom}
        size="icon"
        type="button"
        variant="outline"
        {...props}
      >
        <ArrowDownIcon className="size-4" />
      </Button>
    </div>
  );
};

export type ConversationAutoScrollProps = {
  messages: unknown[];
  status?: string;
};

export const ConversationAutoScroll = ({
  messages,
  status,
}: ConversationAutoScrollProps) => {
  const { scrollToBottom, isAtBottom } = useStickToBottomContext();
  const lastMessageCountRef = useRef(messages.length);
  const wasAtBottomRef = useRef(true);
  const streamingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const messageCountChanged = messages.length !== lastMessageCountRef.current;
    const isStreaming = status === "streaming" || status === "submitted";

    // Track if we were at bottom before
    if (isAtBottom) {
      wasAtBottomRef.current = true;
    }

    // Scroll when new message is added
    if (messageCountChanged) {
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        scrollToBottom();
      });
      lastMessageCountRef.current = messages.length;
    }

    // During streaming, periodically scroll if we were at bottom
    if (isStreaming && wasAtBottomRef.current) {
      // Clear any existing interval
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
      }

      // Scroll periodically during streaming with optimized interval
      streamingIntervalRef.current = setInterval(() => {
        if (wasAtBottomRef.current) {
          requestAnimationFrame(() => {
            scrollToBottom();
          });
        }
      }, 100);
    } else if (streamingIntervalRef.current) {
      // Clear interval when not streaming
      clearInterval(streamingIntervalRef.current);
      streamingIntervalRef.current = null;
    }

    return () => {
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
        streamingIntervalRef.current = null;
      }
    };
  }, [messages.length, status, scrollToBottom, isAtBottom]);

  return null;
};
