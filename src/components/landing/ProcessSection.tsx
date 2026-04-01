import { motion } from "framer-motion";

const STEPS = [
  {
    num: "01",
    title: "AI Audit",
    timeline: "2 WEEKS · $1,500",
    desc: "We map your real workflows — not theoretical ones. You get a scorecard of your highest-ROI automation opportunities, with cost estimates and timelines you can actually trust.",
  },
  {
    num: "02",
    title: "Custom Roadmap",
    timeline: "1 WEEK",
    desc: "We prioritize together based on ROI, effort, and what your team can realistically adopt. You approve the plan before a single line of code is written.",
  },
  {
    num: "03",
    title: "Build & Scale",
    timeline: "8-12 WEEKS",
    desc: "AI agents and workflows go live in sprints. We measure ROI at every milestone. If something isn't working, we pivot. No vendor lock-in.",
  },
];

export default function ProcessSection() {
  return (
    <section id="process" className="py-20 md:py-32 px-4" style={{ backgroundColor: "hsl(43 41% 95%)" }}>
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
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight" style={{ color: "hsl(222 33% 10%)" }}>
            Three steps. <span className="italic">No fluff.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              className="rounded-2xl p-8 border relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
              style={{
                backgroundColor: "white",
                borderColor: "hsl(43 20% 88%)",
              }}
            >
              <span
                className="text-7xl font-bold absolute -top-2 -right-1 select-none"
                style={{ fontFamily: "'Instrument Serif', serif", color: "hsl(43 30% 92%)" }}
              >
                {step.num}
              </span>
              <div className="relative z-10">
                <p
                  className="text-xs font-semibold tracking-widest uppercase mb-3"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "hsl(164 65% 50%)" }}
                >
                  {step.timeline}
                </p>
                <h3
                  className="text-2xl mb-4"
                  style={{ color: "hsl(222 33% 10%)" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif", color: "hsl(30 4% 42%)" }}>
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
