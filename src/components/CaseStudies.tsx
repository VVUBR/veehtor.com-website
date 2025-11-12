import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import SpotlightCard from "./SpotlightCard";

interface CaseStudiesProps {
  content: any;
}

export const CaseStudies = ({ content }: CaseStudiesProps) => {
  if (!content?.caseStudies) return null;

  return (
    <section id="case-studies" className="py-16 md:py-24 px-4 border-t border-slate-200">
      <div className="container mx-auto max-w-6xl">
        <Reveal>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Case studies</h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              See how we've helped companies ship AI that delivers ROI
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8">
          {content.caseStudies.map((study: any, idx: number) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <SpotlightCard className="p-8 group">
                <div className="space-y-4">
                  <div className="text-3xl font-bold text-primary shiny-text">
                    {study.metric}
                  </div>
                  <h3 className="text-xl font-semibold">{study.title}</h3>
                  <p className="text-muted-foreground">{study.description}</p>
                  <button className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                    Read case study
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
