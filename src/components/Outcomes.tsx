import Reveal from "./Reveal";
import SpotlightCard from "./SpotlightCard";

interface OutcomesProps {
  content: any;
}

export const Outcomes = ({ content }: OutcomesProps) => {
  if (!content?.outcomes) return null;

  return (
    <section className="py-16 md:py-24 px-4 border-t border-slate-200">
      <div className="container mx-auto max-w-6xl">
        <Reveal>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#020617]">
              Real results from real companies
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Measurable outcomes in 90 days or less
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8">
          {content.outcomes.map((outcome: any, idx: number) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <SpotlightCard className="text-center p-8">
                <div className="text-4xl md:text-5xl font-bold text-[#14b8a6] mb-3">
                  {outcome.metric}
                </div>
                <h3 className="text-xl font-semibold mb-2">{outcome.title}</h3>
                <p className="text-muted-foreground">{outcome.description}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
