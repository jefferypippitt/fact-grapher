export function HowItWorks() {
  return (
    <section>
      <div className="max-w-4xl py-2">
        <h2 className="mb-4 text-center font-semibold text-3xl">
          How Fact Grapher Works
        </h2>
        <p className="mb-8 text-center text-base text-muted-foreground">
          Go from prompt to infographic—no design skills needed.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4 text-left shadow-sm">
            <h3 className="font-semibold text-lg">1. Ask</h3>
            <p className="text-muted-foreground text-sm">
              Describe the topic or question. Select the style of infographic
              you want to create.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4 text-left shadow-sm">
            <h3 className="font-semibold text-lg">2. Generate</h3>
            <p className="text-muted-foreground text-sm">
              Our chatbot structures the story and chooses the right layout
              automatically.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4 text-left shadow-sm">
            <h3 className="font-semibold text-lg">3. Share</h3>
            <p className="text-muted-foreground text-sm">
              Download the image and use it anywhere you want.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
