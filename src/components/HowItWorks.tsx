import { Search, Map, Rocket } from "lucide-react";
import GlareButton from "./GlareButton";
import Reveal from "./Reveal";

interface HowItWorksProps {
  content: any;
}

const iconMap: any = {
  search: Search,
  map: Map,
  rocket: Rocket,
};

export const HowItWorks = ({ content }: HowItWorksProps) => {
  if (!content?.howItWorks) return null;

  const handleCTA = () => {
    const ctaSection = document.getElementById("contact");
    ctaSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="how-it-works" className="py-16 md:py-24 px-4 border-t border-border bg-background">
      <div className="container mx-auto max-w-6xl">
        <Reveal>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#020617]">
              {content.howItWorks.title || "How it works"}
            </h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {content.howItWorks.steps?.map((step: any, idx: number) => {
            const Icon = iconMap[step.icon] || Search;
            return (
              <Reveal key={idx} delay={idx * 0.15}>
                <div className="relative">
                <div className="bg-card rounded-xl p-8 border border-border shadow-sm h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-xl">
                      {step.number}
                    </div>
                    <Icon className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-primary">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{step.duration}</p>
                  <p className="text-foreground">{step.description}</p>
                </div>
                  {idx < content.howItWorks.steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-secondary/30" />
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        <div className="text-center">
          <GlareButton size="lg" onClick={handleCTA}>
            Start with Step 1: AI Audit
          </GlareButton>
        </div>
      </div>
    </section>
  );
};
