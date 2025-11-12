import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import Orb from "./Orb";
import GlareButton from "./GlareButton";

interface HeroProps {
  content: any;
}

export const Hero = ({ content }: HeroProps) => {
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!headlineRef.current) return;

    const headline = headlineRef.current;
    const text = headline.textContent || "";
    headline.innerHTML = "";

    // Split text into words and characters
    const words = text.split(" ");
    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement("span");
      wordSpan.style.display = "inline-block";
      wordSpan.style.whiteSpace = "pre";
      wordSpan.style.marginRight = "0.25em";

      word.split("").forEach((char, charIndex) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.className = "split-char";
        span.style.display = "inline-block";
        const delay = (wordIndex * 5 + charIndex) * 0.03;
        span.style.animationDelay = `${delay}s`;
        wordSpan.appendChild(span);
      });

      headline.appendChild(wordSpan);
      
      // Add space after word (except last word)
      if (wordIndex < words.length - 1) {
        const space = document.createElement("span");
        space.textContent = " ";
        space.style.display = "inline";
        headline.appendChild(space);
      }
    });

    // Add cursor
    const cursor = document.createElement("span");
    cursor.className = "cursor-blink inline-block w-0.5 h-12 bg-primary ml-1";
    cursor.style.animationDelay = `${words.length * 0.15}s`;
    headline.appendChild(cursor);
  }, [content]);

  const handlePrimaryCTA = () => {
    const ctaSection = document.getElementById("contact");
    ctaSection?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSecondaryCTA = () => {
    const howSection = document.getElementById("how-it-works");
    howSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[620px] md:min-h-[700px] flex items-center justify-center pt-40 md:pt-48 pb-14 md:pb-20 px-4 overflow-hidden">
      {/* Orb background */}
      <div className="absolute inset-0 -z-10 min-h-[560px] md:min-h-[640px]">
        <Orb hue={-20} hoverIntensity={0.5} rotateOnHover={true} forceHoverState={false} capture="window" />
      </div>
      
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center space-y-8">
          <h1
            ref={headlineRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
          >
            {content?.hero?.headline || "Ship AI that pays for itself in 90 days"}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {content?.hero?.subheadline || "Stop overpaying for AI experiments."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <GlareButton size="lg" onClick={handlePrimaryCTA} className="text-base px-8">
              {content?.hero?.primaryCTA || "Get your AI Audit"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </GlareButton>
            <GlareButton size="lg" variant="outline" onClick={handleSecondaryCTA} className="text-base px-8">
              {content?.hero?.secondaryCTA || "See how it works"}
            </GlareButton>
          </div>

          {content?.hero?.proofPoints && (
            <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {content.hero.proofPoints.map((point: string, idx: number) => (
                <div
                  key={idx}
                  className="reveal flex items-center justify-center text-sm md:text-base text-foreground bg-card/50 backdrop-blur-sm rounded-lg px-4 py-3 border border-border"
                  style={{ animationDelay: `${0.8 + idx * 0.1}s` }}
                >
                  <span className="mr-2 text-primary">✓</span>
                  {point}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
