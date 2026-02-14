"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "./faq-section-v3.css";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/* ─── FAQ Data ───────────────────────────────── */

const faqItems = [
  {
    category: "Getting Started",
    question: "What do I need to start?",
    answer:
      "Create an account, choose a token pack, and start generating visuals right away.",
  },
  {
    category: "Quality",
    question: "What if the image has mistakes?",
    answer:
      "Generative outputs can include errors, especially in dense text designs. Review each result before publishing.",
  },
  {
    category: "Performance",
    question: "How fast is generation?",
    answer:
      "Most results are ready in seconds. Topics with more context may take a little longer while the layout is composed.",
  },
  {
    category: "Pricing",
    question: "Is there a cost to try it?",
    answer:
      "Yes. Fact Grapher uses single purchase token packs instead of subscriptions.",
  },
  {
    category: "Ownership",
    question: "Do I own the images I generate?",
    answer:
      "Yes. Images generated with your tokens are yours to use and share. Attribution is appreciated.",
  },
  {
    category: "Tokens",
    question: "Do tokens expire?",
    answer: "No. Purchased tokens stay in your account until you use them.",
  },
];

/* ─── FAQ Card ───────────────────────────────── */

function FaqCard({
  category,
  question,
  answer,
  isOpen,
  onToggle,
}: {
  category: string;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div className={cn("faq3-card", isOpen ? "faq3-card--open" : "")}>
      <button
        aria-expanded={isOpen}
        className="faq3-card-trigger"
        onClick={onToggle}
        type="button"
      >
        <span className="faq3-card-top">
          <Badge className="faq3-category font-mono" variant="outline">
            {category}
          </Badge>
          <span
            aria-hidden="true"
            className={cn("faq3-icon", isOpen ? "faq3-icon--open" : "")}
          >
            <svg
              fill="none"
              height="16"
              viewBox="0 0 16 16"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Toggle FAQ</title>
              <path
                d="M8 3.5v9M3.5 8h9"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
              />
            </svg>
          </span>
        </span>
        <span className="faq3-card-question">{question}</span>
      </button>

      <div className="faq3-card-body" style={{ height }}>
        <div className="faq3-card-answer-wrap" ref={contentRef}>
          <p className="faq3-card-answer">{answer}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────── */

export function FaqSectionV3({
  className,
  ...props
}: React.ComponentProps<"section">) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section className={cn("faq3-section", className)} {...props}>
      <div className="faq3-container">
        <header className="faq3-header">
          <h2 className="faq3-headline">Frequently asked questions</h2>
          <p className="faq3-subtext">Answers to the things people ask most.</p>
        </header>

        <div className="faq3-grid">
          {faqItems.map((item, index) => (
            <FaqCard
              answer={item.answer}
              category={item.category}
              isOpen={openIndex === index}
              key={item.question}
              onToggle={() => handleToggle(index)}
              question={item.question}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
