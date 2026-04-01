import { motion } from "framer-motion";

const CASES = [
  {
    industry: "Legal Tech · B2B SaaS",
    metric: "< 60s lead response",
    before: "5-min avg. response, leads lost overnight",
    after: "<60s response, 24/7 qualification",
  },
  {
    industry: "B2B SaaS · Customer Support",
    metric: "$180K annual savings",
    before: "Overloaded support team, slow ticket resolution",
    after: "30% tickets automated, 2 FTEs saved",
  },
  {
    industry: "Professional Services · Sales",
    metric: "3x qualified meetings",
    before: "Manual research, generic outreach, low conversion",
    after: "3x qualified meetings, fully automated SDR workflow",
  },
];

export default function CaseStudiesSection() {
  return (
    <section id="case-studies" className="py-20 md:py-32 px-4" style={{ backgroundColor: "hsl(43 41% 95%)" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-14"
        >
          <p
            className="text-sm font-semibold tracking-widest uppercase mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "hsl(30 4% 52%)" }}
          >
            Results
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight" style={{ color: "hsl(222 33% 10%)" }}>
            Companies that <span className="italic">shipped AI</span> that works.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {CASES.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              className="rounded-2xl p-7 border hover:-translate-y-1 transition-transform duration-300"
              style={{ backgroundColor: "white", borderColor: "hsl(43 20% 88%)" }}
            >
              <p className="text-xs font-semibold tracking-wider uppercase mb-4" style={{ fontFamily: "'DM Sans', sans-serif", color: "hsl(30 4% 52%)" }}>
                {c.industry}
              </p>
              <div className="text-2xl sm:text-3xl text-primary mb-6" style={{ fontFamily: "'Instrument Serif', serif" }}>
                {c.metric}
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ fontFamily: "'DM Sans', sans-serif", color: "hsl(6 100% 68%)" }}>
                    Before
                  </p>
                  <p className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif", color: "hsl(30 4% 42%)" }}>
                    {c.before}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ fontFamily: "'DM Sans', sans-serif", color: "hsl(164 65% 50%)" }}>
                    After
                  </p>
                  <p className="text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif", color: "hsl(222 33% 10%)" }}>
                    {c.after}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
