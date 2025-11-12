import CountStat from "./CountStat";
import Reveal from "./Reveal";

interface SocialProofProps {
  content: any;
}

export const SocialProof = ({ content }: SocialProofProps) => {
  if (!content?.socialProof?.stats) return null;

  const inverted = content?.ui?.sections?.socialProof?.theme === 'inverted';
  const brandBlue = content?.ui?.sections?.socialProof?.brandBlue || '#0B3BFF';

  const wrapperClass = inverted
    ? 'relative py-16 md:py-20 px-4 border-t border-slate-200 text-white'
    : 'relative py-16 md:py-20 px-4 border-t border-slate-200';

  return (
    <section className={wrapperClass}>
      {inverted && (
        <div
          className="absolute inset-0 -z-10"
          style={{ backgroundColor: brandBlue }}
          aria-hidden
        />
      )}
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {content.socialProof.stats.map((stat: any, idx: number) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <div className={inverted ? 'bg-white/10 rounded-2xl p-6 ring-1 ring-white/15' : ''}>
                <CountStat
                  value={stat.value}
                  suffix={stat.suffix || ''}
                  label={stat.label}
                  duration={1.5}
                  className={inverted ? 'text-white' : ''}
                  labelClassName={inverted ? 'text-white/80' : ''}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
