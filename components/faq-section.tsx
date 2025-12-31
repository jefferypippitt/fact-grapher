import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
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
    {
      question: "Do I own the images I generate?",
      answer:
        "Yes! Once you purchase tokens and generate an image, you own it and are free to share it anywhere. We'd appreciate if you give us credit when sharing your creations.",
    },
  ];

  return (
    <section className="py-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-3 text-left font-semibold text-xl md:text-2xl lg:text-3xl">
          Frequently Asked Questions
        </h2>
        <p className="mb-6 max-w-2xl text-muted-foreground text-sm md:text-base">
          Common questions answered.
        </p>
        <Accordion className="w-full" collapsible type="single">
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="text-left [&>svg]:text-primary">
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
