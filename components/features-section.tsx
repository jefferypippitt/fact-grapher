type StepType = {
  number: string;
  title: string;
  description: string;
};

const steps: StepType[] = [
  {
    number: "01",
    title: "Idea & Direction",
    description:
      "Reflect on your subject and select a preferred aesthetic. Our AI interprets your input and builds an optimal image.",
  },
  {
    number: "02",
    title: "Smart Creation",
    description:
      "The AI gathers recent data for that specific topic and generates the best layouts for your infographic.",
  },
  {
    number: "03",
    title: "Finalize & Export",
    description:
      "Review the finished visual and detailed summary. Instantly download your creation for use in presentations, reports, social media, or anywhere else.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="px-4 py-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6 text-center md:mb-8">
          <h2 className="text-balance font-semibold text-xl sm:text-2xl md:text-3xl">
            Create Perfect Infographics
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground text-sm md:mt-3 md:text-base">
            From concept to download in minutes, not hours.
          </p>
        </div>

        <div className="space-y-0">
          {steps.map((step, index) => (
            <div key={step.number}>
              <div className="flex flex-col gap-3 py-6 md:flex-row md:items-start md:gap-12 md:py-10">
                <div className="flex items-baseline gap-3 md:w-64 md:shrink-0 md:gap-4">
                  <span className="font-mono text-primary text-xs md:text-sm">
                    {step.number}
                  </span>
                  <h3 className="font-semibold text-lg md:text-xl lg:text-2xl">
                    {step.title}
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed md:ml-auto md:max-w-2xl md:text-base">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="border-border border-t" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
