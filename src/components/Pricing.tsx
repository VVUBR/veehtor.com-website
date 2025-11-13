import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import SpotlightCard from "./SpotlightCard";

interface PricingProps {
  content: any;
}

export const Pricing = ({ content }: PricingProps) => {
  if (!content?.pricing) return null;

  const handleCTA = () => {
    const ctaSection = document.getElementById("contact");
    ctaSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-16 md:py-24 px-4 electric-border border-t border-border bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-primary">
            {content.pricing.title || "Transparent pricing"}
          </h2>
          <p className="text-foreground/80 max-w-2xl mx-auto">
            {content.pricing.note}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {content.pricing.tiers?.map((tier: any, idx: number) => (
            <SpotlightCard
              key={idx}
              className={`reveal bg-white p-8 shadow-lg ${
                idx === 0 ? "border-secondary border-2" : ""
              }`}
            >
              <div className="space-y-6" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-primary">{tier.name}</h3>
                  <div className="mb-2">
                    <span className="text-3xl md:text-4xl font-bold text-primary">
                      {tier.price}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{tier.duration}</p>
                </div>

                <div className="space-y-3">
                  {tier.features?.map((feature: string, featureIdx: number) => (
                    <div key={featureIdx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleCTA}
                  variant={idx === 0 ? "default" : "outline"}
                  className="w-full rounded-full"
                >
                  {idx === 0 ? "Book your audit" : "Schedule a call"}
                </Button>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
};
