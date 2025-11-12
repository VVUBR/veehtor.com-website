import CountStat from "./CountStat";
import Reveal from "./Reveal";

interface SocialProofProps {
  content: any;
}

export const SocialProof = ({ content }: SocialProofProps) => {
  if (!content?.socialProof?.stats) return null;

  return (
    <section className="py-16 md:py-20 px-4 border-t border-slate-200">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {content.socialProof.stats.map((stat: any, idx: number) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <CountStat
                value={stat.value}
                suffix={stat.suffix || ''}
                label={stat.label}
                duration={1.5}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
