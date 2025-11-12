import CountStat from "./CountStat";
import Reveal from "./Reveal";

interface SocialProofProps {
  content: any;
}

export const SocialProof = ({ content }: SocialProofProps) => {
  if (!content?.socialProof?.stats) return null;

  return (
    <section className="relative py-16 md:py-20 px-4 bg-brandBlue text-white">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {content.socialProof.stats.map((stat: any, idx: number) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <div className="bg-white/10 rounded-2xl p-6 ring-1 ring-white/15">
                <CountStat
                  value={stat.value}
                  suffix={stat.suffix || ''}
                  label={stat.label}
                  duration={1.5}
                  className="text-white"
                  labelClassName="text-white/80"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
