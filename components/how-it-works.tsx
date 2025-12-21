export function HowItWorks() {
  return (
    <section>
      <div className="max-w-4xl py-2">
        <h2 className="mb-4 text-center font-semibold text-3xl md:text-4xl">
          How <span className="text-primary">Fact Grapher</span> Works
        </h2>
        <p className="mb-8 text-center text-base text-muted-foreground md:text-lg">
          Quickly turn your ideas into{" "}
          <span className="font-medium text-primary">captivating images</span>{" "}
          with ease
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-5 text-left shadow-sm transition-shadow hover:shadow-md">
            <h3 className="mb-2 font-semibold text-lg">
              <span className="text-primary">1.</span> Ask
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Describe the topic or question. Select the style of infographic
              you want to create.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-5 text-left shadow-sm transition-shadow hover:shadow-md">
            <h3 className="mb-2 font-semibold text-lg">
              <span className="text-primary">2.</span> Generate
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Our chatbot structures the story and chooses the right layout
              automatically.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-5 text-left shadow-sm transition-shadow hover:shadow-md">
            <h3 className="mb-2 font-semibold text-lg">
              <span className="text-primary">3.</span> Share
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Download the image and use it anywhere you want.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
