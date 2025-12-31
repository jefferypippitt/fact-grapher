import BenefitsSection from "@/components/benefits-section";
import CtaSection from "@/components/cta-section";
import FAQSection from "@/components/faq-section";
import FeaturesSection from "@/components/features-section";
import HeroSection from "@/components/hero-section";

export default function Home() {
  return (
    <div className="space-y-10 md:space-y-16">
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <FAQSection />
      <CtaSection />
    </div>
  );
}
