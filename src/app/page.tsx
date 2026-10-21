import { Hero } from "@/components/home/Hero";
import { TrustSection } from "@/components/home/TrustSection";
import { ProductIntro } from "@/components/home/ProductIntro";
import { ProcessSection } from "@/components/home/ProcessSection";
import { Scenarios } from "@/components/home/Scenarios";
import { CtaSection } from "@/components/home/CtaSection";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustSection />
      <ProductIntro />
      <ProcessSection />
      <Scenarios />
      <CtaSection />
    </>
  );
}
