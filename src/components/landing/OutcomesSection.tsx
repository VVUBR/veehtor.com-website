import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useRef, useState, useEffect } from "react";

const STATS = [
  {
    value: 60,
    suffix: "s",
    label: "Lead response time",
    desc: "AI agents auto-qualify, route, and draft proposals — first touch under a minute, 24/7.",
  },
  {
    value: 40,
    suffix: "%",
    label: "Less manual work",
    desc: "Your team stops copying, pasting, and chasing. AI handles the repetition so humans handle the relationships.",
  },
  {
    value: 3,
    suffix: "x",
    label: "Pipeline efficiency",
    desc: "Automated prospect research, enrichment, and personalized outreach triples qualified meetings — no new headcount.",
  },
  {
    value: 90,
    suffix: " days",
    label: "To positive ROI",
    desc: "Not 6 months. Not 'eventually.' Measurable return within one quarter, tracked from day one.",
  },
];

function StatBlock({ stat, delay }: { stat: typeof STATS[0]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.7 }}
    >
      <div className="text-4xl sm:text-5xl md:text-6xl font-normal text-primary mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>
        {started ? <CountUp end={stat.value} duration={2} /> : "0"}
        {stat.suffix}
      </div>
      <p className="text-foreground font-semibold text-sm mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {stat.label}
      </p>
      <p className="text-muted-foreground text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {stat.desc}
      </p>
    </motion.div>
  );
}

export default function OutcomesSection() {
  return (
    <section id="outcomes" className="py-20 md:py-32 px-4 bg-card">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-14"
        >
          <p className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            What Changes
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight max-w-3xl">
            The results <span className="text-primary italic">speak in dollars,</span> not decks.
          </h2>
          <p className="text-muted-foreground mt-4 text-base max-w-2xl" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Real numbers from real companies in the first 90 days.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {STATS.map((stat, i) => (
            <StatBlock key={i} stat={stat} delay={i * 0.12} />
          ))}
        </div>
      </div>
    </section>
  );
}
