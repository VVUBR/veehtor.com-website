import { ArrowRight } from "lucide-react";
import GlareButton from "./GlareButton";
import Reveal from "./Reveal";

interface FinalCTAProps {
  content: any;
}

export const FinalCTA = ({ content }: FinalCTAProps) => {
  if (!content?.finalCTA) return null;

  const handleCTA = () => {
    window.open("https://cal.com/veehtorai/ai.audit.meeting", "_blank");
  };

  return (
    <section className="py-16 md:py-24 px-4 border-t border-border bg-gradient-to-br from-secondary/5 via-background to-accent/5">
      <div className="container mx-auto max-w-4xl text-center">
        <Reveal>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-primary">
              {content.finalCTA.headline}
            </h2>
            <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
              {content.finalCTA.subheadline}
            </p>
            <div className="pt-4">
              <GlareButton size="lg" onClick={handleCTA} className="text-lg px-8">
                {content.finalCTA.cta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </GlareButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
