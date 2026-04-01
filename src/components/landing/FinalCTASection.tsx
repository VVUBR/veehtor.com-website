import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";

export default function FinalCTASection() {
  const scrollToCTA = () => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="contact"
      className="py-20 md:py-32 px-4 relative overflow-hidden bg-background"
    >
      {/* Subtle teal radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 60%, hsl(164 65% 50% / 0.06) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Let's Talk
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight">
            Ready to see what AI can <span className="text-primary italic">actually do</span> for your business?
          </h2>
          <p className="text-muted-foreground mt-5 text-base max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Book a 2-week AI Audit. Get a roadmap with real ROI projections. Only pay to implement what proves its value.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              onClick={scrollToCTA}
              className="bg-primary text-primary-foreground px-8 py-4 rounded-full text-base font-semibold hover:brightness-110 transition-all inline-flex items-center justify-center gap-2 glare-effect"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <strong>Book your AI Audit</strong>
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="tel:+17813288464"
              className="border border-border text-foreground px-8 py-4 rounded-full text-base font-semibold hover:bg-muted transition-all inline-flex items-center justify-center gap-2"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <Phone className="w-4 h-4" />
              Call me now
            </a>
          </div>

          <a
            href="mailto:vitor@veehtor.com?subject=AI%20Audit%20Inquiry"
            className="inline-block mt-6 text-muted-foreground hover:text-primary transition-colors text-sm underline underline-offset-4"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            vitor@veehtor.com
          </a>
        </motion.div>
      </div>
    </section>
  );
}
