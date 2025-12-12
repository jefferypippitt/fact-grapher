import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function DiveDeeper() {
  const faqs = [
    {
      question: "What do I need to start?",
      answer:
        "Just sign up and type a topic or question. Add a few key facts or sources if you want the visual to anchor to specific details.",
    },
    {
      question: "How accurate are the visuals?",
      answer:
        "We use AI to draft the structure and visuals. Always review critical data—especially numbers or quotes—before publishing.",
    },
    {
      question: "What if the image has mistakes?",
      answer:
        "Regenerate with clearer prompts or adjust your inputs. Text rendering in images is improving, but review final outputs before sharing.",
    },
    {
      question: "How fast is generation?",
      answer:
        "Most visuals render in seconds. Heavier topics with more context can take slightly longer while layouts are chosen.",
    },
    {
      question: "Can I edit or reuse the outputs?",
      answer:
        "You can regenerate with new context and reuse exported visuals in your decks, docs, or posts. Direct in-app editing is on the roadmap.",
    },
    {
      question: "Is there a cost to try it?",
      answer:
        "You can start right away—create your first visuals and see if it fits your workflow before upgrading.",
    },
  ];

  return (
    <section className="py-8">
      <div className="max-w-4xl">
        <h2 className="mb-6 text-left font-semibold text-3xl">
          Frequently Asked Questions
        </h2>
        <Accordion className="w-full" collapsible type="single">
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
