import { ArrowRight } from "lucide-react";

interface CaseStudiesProps {
  content: any;
}

export const CaseStudies = ({ content }: CaseStudiesProps) => {
  if (!content?.caseStudies) return null;

  return (
    <section id="case-studies" className="py-16 md:py-24 px-4 bg-secondary/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Case studies</h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            See how we've helped companies ship AI that delivers ROI
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {content.caseStudies.map((study: any, idx: number) => (
            <div
              key={idx}
              className="reveal bg-card rounded-xl p-8 border border-border shadow-sm hover:shadow-md transition-all group"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
