import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";

export default function PricingSection() {
  const scrollToCTA = () => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="pricing" className="py-20 md:py-32 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight">
            Start with <span className="text-primary italic">clarity.</span> Scale with{" "}
            <span className="text-primary italic">confidence.</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-base max-w-2xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Begin with a 2-week audit — then only implement what proves its value.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* AI Audit - Featured */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-2xl p-8 border-2 border-primary relative overflow-hidden"
            style={{ backgroundColor: "hsl(225 24% 9%)" }}
          >
            <div
              className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
              style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: "hsl(164 65% 50% / 0.15)", color: "hsl(164 65% 50%)" }}
            >
              Most Popular
            </div>
            <p className="text-primary text-sm font-semibold mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>AI Audit</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl md:text-5xl text-foreground" style={{ fontFamily: "'Instrument Serif', serif" }}>$1,500</span>
            </div>
            <p className="text-muted-foreground text-sm mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>2 weeks</p>

            <ul className="space-y-3 mb-8">
              {[
                "Workflow analysis & bottleneck mapping",
                "Prioritized opportunity scorecard",
                "Tool & vendor recommendations",
                "3-month roadmap with ROI projections",
                "30-min strategy debrief call",
              ].map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground/90" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <span className="text-primary mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={scrollToCTA}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-full font-semibold text-sm hover:brightness-110 transition-all inline-flex items-center justify-center gap-2 glare-effect"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <strong>Book your audit</strong>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Build & Scale */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="rounded-2xl p-8 border border-border"
            style={{ backgroundColor: "hsl(225 24% 9%)" }}
          >
            <p className="text-foreground/60 text-sm font-semibold mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>Build & Scale</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl md:text-5xl text-foreground" style={{ fontFamily: "'Instrument Serif', serif" }}>$12,500-30K</span>
            </div>
            <p className="text-muted-foreground text-sm mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>3-6 months</p>

            <ul className="space-y-3 mb-8">
              {[
                "Custom AI agent development",
                "Workflow automation & integrations",
                "Team training & adoption playbooks",
                "Ongoing optimization & ROI tracking",
                "No vendor lock-in — you own everything",
              ].map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground/90" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <span className="text-muted-foreground mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <a
              href="tel:+17813288464"
              className="w-full border border-border text-foreground py-3.5 rounded-full font-semibold text-sm hover:bg-muted transition-all inline-flex items-center justify-center gap-2"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Phone className="w-4 h-4" />
              Call me now
            </a>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center text-muted-foreground text-sm mt-8"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Implementation only starts after you've seen the audit results and approved the plan. No surprises.
        </motion.p>
      </div>
    </section>
  );
}
