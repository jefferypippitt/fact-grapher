import { AdditionalFeatures } from "@/components/additional-features";
import { CtaSection } from "@/components/cta-section";
import { DiveDeeper } from "@/components/dive-deeper";
import { HeroSection } from "@/components/hero-section";
import { HowItWorks } from "@/components/how-it-works";

export default function Home() {
  return (
    <div className="space-y-10">
      <HeroSection />
      <section>
        <HowItWorks />
      </section>
      <section>
        <AdditionalFeatures />
      </section>
      <section>
        <DiveDeeper />
      </section>
      <section>
        <CtaSection />
      </section>
    </div>
  );
}
