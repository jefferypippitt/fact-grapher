import { CtaSectionV2 } from "../glsilk/cta-section-v2";
import { FaqSectionV3 } from "../glsilk/faq-section-v3";
import { FeatureSectionV2 } from "../glsilk/feature-section-v2";
import { HeroSectionV1 } from "../glsilk/hero-section-v1";
import { Integrations } from "../glsilk/integrations";

export default function Home() {
  return (
    <main>
      <HeroSectionV1 />
      <FeatureSectionV2 />
      <Integrations />
      <FaqSectionV3 />
      <CtaSectionV2 />
    </main>
  );
}
