import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

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
    <section id="services" className="py-16 md:py-24 px-4 bg-secondary/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Two ways to work together
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Start with an audit to get clarity, then implement what matters
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {content.services.map((service: any, idx: number) => (
            <div
              key={idx}
              className="reveal glare-effect bg-card rounded-xl p-8 border border-border shadow-lg hover:shadow-xl transition-shadow"
              style={{ animationDelay: `${idx * 0.15}s` }}
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">{service.title}</h3>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-3xl md:text-4xl font-bold text-primary">
                      {service.price}
                    </span>
                    <span className="text-muted-foreground">• {service.duration}</span>
                  </div>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>

                <div className="space-y-3">
                  <p className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                    What you get
                  </p>
                  {service.deliverables?.map((item: string, itemIdx: number) => (
                    <div key={itemIdx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>

                <Button onClick={handleCTA} className="w-full glare-effect">
                  {service.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
