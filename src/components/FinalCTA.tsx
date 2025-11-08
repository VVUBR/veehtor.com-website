import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface FinalCTAProps {
  content: any;
}

export const FinalCTA = ({ content }: FinalCTAProps) => {
  if (!content?.finalCTA) return null;

  const handleCTA = () => {
    const ctaSection = document.getElementById("contact");
    ctaSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="reveal space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold">
            {content.finalCTA.headline}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {content.finalCTA.subheadline}
          </p>
          <div className="pt-4">
            <Button size="lg" onClick={handleCTA} className="glare-effect text-lg px-8">
              {content.finalCTA.cta}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
