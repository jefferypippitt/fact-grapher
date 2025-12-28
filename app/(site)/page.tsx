import AdditionalFeatures from "@/components/additional-features";
import CtaSection from "@/components/cta-section";
import DiveDeeper from "@/components/dive-deeper";
import HeroSection from "@/components/hero-section";
import HowItWorks from "@/components/how-it-works";

export default function Home() {
  return (
    <div className="space-y-10 md:space-y-16">
      <HeroSection />
      <section className="scroll-mt-8">
        <HowItWorks />
      </section>
      <section className="scroll-mt-8">
        <AdditionalFeatures />
      </section>
      <section className="scroll-mt-8">
        <DiveDeeper />
      </section>
      <section className="scroll-mt-8">
        <CtaSection />
      </section>
    </div>
  );
}
