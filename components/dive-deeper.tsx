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
        "Just sign up and purchase any of the token packs. You can then use the tokens to create infographics.",
    },
    {
      question: "What if the image has mistakes?",
      answer:
        "This is very common with image generation applications. Especially with text to image models. Always review the image before sharing.",
    },
    {
      question: "How fast is generation?",
      answer:
        "Most visuals render in seconds. Heavier topics with more context can take slightly longer while layouts are chosen.",
    },

    {
      question: "Is there a cost to try it?",
      answer:
        "Yes, there is a cost to try it. We do not use subscription models.",
    },
  ];

  return (
    <section className="py-8">
      <div className="max-w-4xl">
        <h2 className="mb-6 text-left font-semibold text-3xl md:text-4xl">
          Frequently Asked <span className="text-primary">Questions</span>
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
