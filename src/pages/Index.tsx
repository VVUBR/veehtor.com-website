import LandingHeader from "@/components/landing/LandingHeader";
import ScrollHero from "@/components/landing/ScrollHero";
import MarqueeSection from "@/components/landing/MarqueeSection";
import ProblemSection from "@/components/landing/ProblemSection";
import OutcomesSection from "@/components/landing/OutcomesSection";
import ProcessSection from "@/components/landing/ProcessSection";
import CaseStudiesSection from "@/components/landing/CaseStudiesSection";
import PricingSection from "@/components/landing/PricingSection";
import FinalCTASection from "@/components/landing/FinalCTASection";
import LandingFooter from "@/components/landing/LandingFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <ScrollHero />
        <MarqueeSection />
        <ProblemSection />
        <OutcomesSection />
        <ProcessSection />
        <CaseStudiesSection />
        <PricingSection />
        <FinalCTASection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default Index;
