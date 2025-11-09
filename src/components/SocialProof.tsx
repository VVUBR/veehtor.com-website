import { useEffect, useRef, useState } from "react";

interface SocialProofProps {
  content: any;
}

const CountUp = ({ end, duration = 1500 }: { end: string; duration?: number }) => {
  const [count, setCount] = useState<string>("0");
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          // If end is a number, animate it
          const numMatch = end.match(/\d+/);
          if (numMatch) {
            const targetNum = parseInt(numMatch[0]);
            const startTime = Date.now();
            const animate = () => {
              const now = Date.now();
              const progress = Math.min((now - startTime) / duration, 1);
              const current = Math.floor(progress * targetNum);
              setCount(end.replace(/\d+/, current.toString()));

              if (progress < 1) {
                requestAnimationFrame(animate);
              }
            };
            animate();
          } else {
            setCount(end);
          }
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold text-primary">
      {count}
    </div>
  );
};

export const SocialProof = ({ content }: SocialProofProps) => {
  if (!content?.socialProof?.stats) return null;

  return (
    <section className="py-12 md:py-16 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {content.socialProof.stats.map((stat: any, idx: number) => (
            <div
              key={idx}
              className="reveal text-center p-6 bg-card rounded-lg border border-border shadow-sm"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <CountUp end={stat.value} duration={1600} />
              <p className="text-sm md:text-base text-muted-foreground mt-2 leading-snug">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
