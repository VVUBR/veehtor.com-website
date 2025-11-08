import { Button } from "@/components/ui/button";
import { X, Check } from "lucide-react";

interface ProblemSolutionProps {
  content: any;
}

export const ProblemSolution = ({ content }: ProblemSolutionProps) => {
  if (!content?.problemSolution) return null;

  const handleCTA = () => {
    const ctaSection = document.getElementById("services");
    ctaSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* Problem */}
          <div className="reveal space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-destructive">
              {content.problemSolution.problem?.title || "The Problem"}
            </h2>
            <div className="space-y-4">
              {content.problemSolution.problem?.points?.map((point: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3">
                  <X className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
                  <p className="text-base md:text-lg text-foreground">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Solution */}
          <div className="reveal space-y-6" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              {content.problemSolution.solution?.title || "The Solution"}
            </h2>
            <div className="space-y-6">
              {content.problemSolution.solution?.moves?.map((move: any, idx: number) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {move.number}
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold mb-1">{move.title}</h3>
                    <p className="text-muted-foreground">{move.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4">
              <Button onClick={handleCTA} className="glare-effect">
                Start with an AI Audit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
