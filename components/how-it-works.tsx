import { Download, MessageSquare, Wand2 } from "lucide-react";
import type React from "react";

type FeatureType = {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
};

const features: FeatureType[] = [
  {
    title: "Ask",
    icon: MessageSquare,
    description:
      "Describe the topic or question. Select the style of infographic you want to create.",
  },
  {
    title: "Generate",
    icon: Wand2,
    description:
      "Our chatbot structures the story and chooses the right layout automatically.",
  },
  {
    title: "Share",
    icon: Download,
    description: "Download the image and use it anywhere you want.",
  },
];

export default function HowItWorks() {
  return (
    <section>
      <div className="mx-auto w-full max-w-5xl space-y-8 py-2">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance font-medium text-2xl md:text-3xl lg:text-4xl">
            How <span className="text-primary">Fact Grapher</span> Works
          </h2>
          <p className="mt-4 text-balance text-muted-foreground text-sm md:text-base">
            Quickly turn your ideas into captivating images with ease
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border">
          <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 md:grid-cols-3">
            {features.map((feature) => (
              <div
                className="space-y-2 rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                key={feature.title}
              >
                <h3 className="font-semibold text-sm md:text-base">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
