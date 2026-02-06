import { Button } from "@/components/ui/button";

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
    title: "Review & Understand",
    description:
      "Get a detailed summary alongside your infographic. View sourced data, key insights, and context that brought your visual to life.",
  },
  {
    number: "04",
    title: "Finalize & Export",
    description:
      "Review the finished visual and detailed summary. Instantly download your creation for use in presentations, reports, social media, or anywhere else.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="mx-auto w-full max-w-4xl">
        {/* Header */}
        <div className="mb-14 text-center md:mb-20">
          <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl md:text-4xl">
            Create Perfect Infographics
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground md:mt-5 md:text-lg">
            From concept to download in minutes, not hours.
          </p>
        </div>

        {/* Steps - 3 column grid: left content | timeline | right content */}
        <div className="relative">
          {/* Timeline elements */}
          <div className="space-y-10 md:space-y-0">
            {steps.map((step, index) => {
              const isEven = index % 2 === 1;
              const isLast = index === steps.length - 1;

              return (
                <div className="relative" key={step.number}>
                  {/* Mobile layout */}
                  <div className="flex gap-5 md:hidden">
                    {/* Number badge + line */}
                    <div className="relative flex flex-col items-center">
                      <Button
                        className="z-10 shrink-0 font-mono text-primary text-xs"
                        size="icon-lg"
                        variant="outline"
                      >
                        {step.number}
                      </Button>
                      {!isLast && <div className="w-px flex-1 bg-border" />}
                    </div>
                    {/* Content */}
                    <div className="flex-1 pb-10">
                      <h3 className="mb-2 font-semibold text-lg tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Desktop layout - 3 column grid */}
                  <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:gap-8">
                    {/* Left column */}
                    <div className={`py-6 ${isEven ? "" : "text-right"}`}>
                      {isEven ? null : (
                        <>
                          <h3 className="mb-2 font-semibold text-xl tracking-tight">
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                        </>
                      )}
                    </div>

                    {/* Center column - timeline */}
                    <div className="relative flex flex-col items-center">
                      <Button
                        className="z-10 size-12 shrink-0 font-mono text-primary text-sm"
                        size="icon-lg"
                        variant="outline"
                      >
                        {step.number}
                      </Button>
                      {!isLast && <div className="w-px flex-1 bg-border" />}
                    </div>

                    {/* Right column */}
                    <div className={`py-6 ${isEven ? "text-left" : ""}`}>
                      {isEven ? (
                        <>
                          <h3 className="mb-2 font-semibold text-xl tracking-tight">
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
