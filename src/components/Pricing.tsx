import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

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
    <section className="py-16 md:py-24 px-4 electric-border">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {content.pricing.title || "Transparent pricing"}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {content.pricing.note}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {content.pricing.tiers?.map((tier: any, idx: number) => (
            <div
              key={idx}
              className={`reveal glare-effect bg-card rounded-xl p-8 border shadow-lg ${
                idx === 0 ? "border-primary border-2" : "border-border"
              }`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
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
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleCTA}
                  variant={idx === 0 ? "default" : "outline"}
                  className={`w-full ${idx === 0 ? "glare-effect" : ""}`}
                >
                  {idx === 0 ? "Book your audit" : "Schedule a call"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
