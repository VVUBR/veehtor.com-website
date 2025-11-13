import { Check } from "lucide-react";
import ElectricBorder from "@/components/ui/ElectricBorder";
import SpotlightCard from "./SpotlightCard";
import GlareButton from "./GlareButton";
import Reveal from "./Reveal";

interface ServicesProps {
  content: any;
}

export const Services = ({ content }: ServicesProps) => {
  if (!content?.services) return null;

  const handleCTA = () => {
    const ctaSection = document.getElementById("contact");
    ctaSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="services" className="py-16 md:py-24 px-4 border-t border-border bg-background">
      <div className="container mx-auto max-w-6xl">
        <Reveal>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#020617]">
              Two ways to work together
            </h2>
            <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
              Start with an audit to get clarity, then implement what matters
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8">
          {content.services.map((service: any, idx: number) => {
            const isAudit = idx === 0;
            
            const CardContent = (
              <div className="p-8 bg-white">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-2 text-primary">{service.title}</h3>
                    <div className="mb-2">
                      <p className="text-muted-foreground mb-1">{service.duration}</p>
                      <strong className="text-3xl md:text-4xl font-bold text-primary">
                        {service.price}
                      </strong>
                    </div>
                    <p className="text-foreground/80 mt-4">{service.description}</p>
                  </div>

                  <div className="space-y-3">
                    <p className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                      What you get
                    </p>
                    {service.deliverables?.map((item: string, itemIdx: number) => (
                      <div key={itemIdx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>

                  <GlareButton onClick={handleCTA} className="w-full">
                    {service.cta}
                  </GlareButton>
                </div>
              </div>
            );

            return (
              <Reveal key={idx} delay={idx * 0.15}>
                {isAudit ? (
                  <ElectricBorder
                    color="#7df9ff"
                    speed={1}
                    chaos={0.5}
                    thickness={2}
                    style={{ borderRadius: 16 }}
                  >
                    {CardContent}
                  </ElectricBorder>
                ) : (
                  <SpotlightCard>{CardContent}</SpotlightCard>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
