import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ROTATING_WORDS = ["promises.", "expensive.", "dreams.", "hype."];

const CARDS = [
  {
    icon: "💸",
    title: "$20-50K spent on tools that sit unused",
    desc: "Enterprise licenses, pilot programs, and shiny demos that never made it past the POC phase.",
  },
  {
    icon: "🤯",
    title: "Your team is overwhelmed by the hype",
    desc: "Every vendor promises transformation. Your team just wants to know what actually works for them.",
  },
  {
    icon: "📊",
    title: "Consultants pitch decks, not results",
    desc: "You've seen beautiful strategy presentations. What you haven't seen is measurable ROI.",
  },
];

export default function ProblemSection() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 md:py-32 px-4" style={{ backgroundColor: "hsl(43 41% 95%)" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p
            className="text-sm font-semibold tracking-widest uppercase mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "hsl(30 4% 52%)" }}
          >
            The Problem
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl leading-tight max-w-4xl"
            style={{ color: "hsl(222 33% 10%)" }}
          >
            You've heard AI will change everything.
            <br />
            But so far, it's just been{" "}
            <span className="inline-block relative align-bottom overflow-hidden" style={{ minWidth: "5.5em", height: "1.15em", verticalAlign: "bottom" }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute left-0 bottom-0 italic font-bold"
                  style={{ color: "hsl(6 100% 68%)" }}
                >
                  {ROTATING_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mt-14">
          {CARDS.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              className="rounded-2xl p-7 border"
              style={{
                backgroundColor: "white",
                borderColor: "hsl(43 20% 88%)",
              }}
            >
              <span className="text-3xl mb-4 block">{card.icon}</span>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "hsl(222 33% 10%)" }}
              >
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif", color: "hsl(30 4% 42%)" }}>
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
