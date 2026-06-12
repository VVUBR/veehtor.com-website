import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

const PAIN_CARDS = [
  "Missed lead", "Manual entry", "Late reply", "Spreadsheet", "Lost deal",
  "No follow-up", "Copy/paste", "5-min wait", "Inbox chaos", "Forgot task",
  "Wrong data", "Manual report", "Burnout", "No tracking", "Revenue leak",
  "Guesswork", "Overtime", "Customer churn", "Slow quotes", "Missed calls",
];

const CARD_COLORS = [
  "bg-destructive/20 text-destructive",
  "bg-amber-900/30 text-amber-400",
  "bg-muted text-muted-foreground",
];

export default function ScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Phase opacities
  const phase1Opacity = useTransform(scrollYProgress, [0, 0.25, 0.32], [1, 1, 0]);
  const phase2Opacity = useTransform(scrollYProgress, [0.28, 0.38, 0.5, 0.57], [0, 1, 1, 0]);
  const phase3Opacity = useTransform(scrollYProgress, [0.52, 0.62, 1], [0, 1, 1]);
  const phase3Y = useTransform(scrollYProgress, [0.52, 0.65], [60, 0]);

  const scrollToCTA = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={containerRef} className="relative" style={{ height: "300vh" }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden pointer-events-none">
        <div className="max-w-6xl mx-auto px-4 w-full">
          {/* Phase 1: Pain cards */}
          <motion.div style={{ opacity: phase1Opacity }} className="absolute inset-0 flex flex-col items-center justify-center px-4">
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3 max-w-3xl mx-auto mb-10">
              {PAIN_CARDS.map((card, i) => (
                <motion.div
                  key={card}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03, duration: 0.4 }}
                  viewport={{ once: true }}
                  className={`px-2 py-2 sm:px-3 sm:py-2.5 rounded-lg text-[10px] sm:text-xs font-medium text-center ${CARD_COLORS[i % 3]}`}
                >
                  {card}
                </motion.div>
              ))}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl text-center max-w-3xl mx-auto text-foreground leading-tight">
              Still running your business like it's 2022?
            </h2>
            <p
              className="text-muted-foreground text-center max-w-2xl mx-auto mt-5 text-sm sm:text-base leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Missed leads. Manual busywork. Slow responses. The time spent on tasks AI could handle means you're not growing. And you know you could do better than that.
            </p>
          </motion.div>

          {/* Phase 2: Transition text */}
          <motion.div style={{ opacity: phase2Opacity }} className="absolute inset-0 flex items-center justify-center px-4">
            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-center max-w-4xl leading-tight text-foreground">
              What if <span className="text-primary italic">AI</span> handled the busywork — and you focused on{" "}
              <span className="text-primary italic">growth</span>?
            </h2>
          </motion.div>

          {/* Phase 3: Amplified */}
          <motion.div
            style={{ opacity: phase3Opacity, y: phase3Y }}
            className="absolute inset-0 flex flex-col items-center justify-center px-4 pointer-events-auto"
          >
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-center text-foreground leading-tight">
              Your team. <span className="text-primary italic">Amplified.</span>
            </h2>
            <p
              className="text-muted-foreground text-center max-w-2xl mx-auto mt-6 text-sm sm:text-lg leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              We build what matters to your business results while your team does what only humans can.
            </p>
            <button
              onClick={scrollToCTA}
              className="mt-8 bg-primary text-primary-foreground px-8 py-4 rounded-full text-base font-semibold hover:brightness-110 transition-all inline-flex items-center gap-2 glare-effect"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <strong>Book Your AI Audit</strong>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
