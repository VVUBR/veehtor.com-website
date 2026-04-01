import { useState, useEffect, useRef, useCallback } from "react";
import vaiLogo from "@/assets/vai-logo.svg";

const PAIN_CARDS = [
  { text: "Missed lead", type: "warn" },
  { text: "Manual entry", type: "dim" },
  { text: "Late reply", type: "alert" },
  { text: "Spreadsheet", type: "dim" },
  { text: "Lost deal", type: "warn" },
  { text: "No follow-up", type: "warn" },
  { text: "Copy/paste", type: "dim" },
  { text: "5-min wait", type: "alert" },
  { text: "Inbox chaos", type: "warn" },
  { text: "Forgot task", type: "dim" },
  { text: "Wrong data", type: "warn" },
  { text: "Manual report", type: "dim" },
  { text: "Burnout", type: "alert" },
  { text: "No tracking", type: "dim" },
  { text: "Revenue leak", type: "warn" },
  { text: "Guesswork", type: "alert" },
  { text: "Overtime", type: "dim" },
  { text: "Customer churn", type: "warn" },
  { text: "Slow quotes", type: "dim" },
  { text: "Missed calls", type: "warn" },
];

const ROTATING_WORDS = ["expensive.", "dreams.", "promises.", "hype."];

const STATS = [
  { value: 60, suffix: "s", label: "Lead response time", desc: "AI agents auto-qualify, route, and draft proposals - first touch under a minute, 24/7." },
  { value: 40, suffix: "%", label: "Less manual work", desc: "Your team stops copying, pasting, and chasing. AI handles the repetition so humans handle the relationships." },
  { value: 3, suffix: "x", label: "Pipeline efficiency", desc: "Automated prospect research, enrichment, and personalized outreach triples qualified meetings - no new headcount." },
  { value: 90, suffix: " days", label: "To positive ROI", desc: "Not 6 months. Not 'eventually.' Measurable return within one quarter, tracked from day one." },
];

const STEPS = [
  { num: 1, title: "AI Audit", timeline: "2 WEEKS · $1,500", desc: "We map your real workflows - not theoretical ones. You get a scorecard of your highest-ROI automation opportunities, with cost estimates and timelines you can actually trust." },
  { num: 2, title: "Custom Roadmap", timeline: "1 WEEK", desc: "We prioritize together based on ROI, effort, and what your team can realistically adopt. You approve the plan before a single line of code is written." },
  { num: 3, title: "Build & Scale", timeline: "8-12 WEEKS", desc: "AI agents and workflows go live in sprints. We measure ROI at every milestone. If something isn't working, we pivot. No vendor lock-in." },
];

const CASES = [
  { industry: "Legal Tech · B2B SaaS", metric: "< 60s", metricLabel: "lead response", before: "5-min avg. response, leads lost overnight", after: "<60s response, 24/7 qualification" },
  { industry: "B2B SaaS · Customer Support", metric: "$180K", metricLabel: "annual savings", before: "Overloaded support team, slow ticket resolution", after: "30% tickets automated, 2 FTEs saved" },
  { industry: "Professional Services · Sales", metric: "3x", metricLabel: "qualified meetings", before: "Manual research, generic outreach, low conversion", after: "3x qualified meetings, fully automated SDR workflow" },
];

// --- Counter hook ---
function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStarted(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, end, duration]);

  return { count, ref };
}

// --- Reveal hook ---
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        obs.disconnect();
      }
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function RevealDiv({ children, className = "", delay = 0, style }: { children: React.ReactNode; className?: string; delay?: number; style?: React.CSSProperties }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ ...style, transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

function StaggerChild({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="stagger-child" style={{ transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s` }}>
      {children}
    </div>
  );
}

// --- Stat Block ---
function StatBlock({ stat }: { stat: typeof STATS[0] }) {
  const { count, ref } = useCountUp(stat.value);
  return (
    <div className="stat-block" ref={ref}>
      <div className="stat-number">
        {count}<span className="stat-suffix">{stat.suffix}</span>
      </div>
      <div className="stat-label">{stat.label}</div>
      <div className="stat-desc">{stat.desc}</div>
    </div>
  );
}

// ============================
// MAIN COMPONENT
// ============================
export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [prevWordIndex, setPrevWordIndex] = useState(-1);
  const transformRef = useRef<HTMLDivElement>(null);
  const [phase1Opacity, setPhase1Opacity] = useState(1);
  const [phase2Opacity, setPhase2Opacity] = useState(0);
  const [phase3Opacity, setPhase3Opacity] = useState(0);

  // Loader
  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30 + 10;
      if (progress >= 100) {
        progress = 100;
        setLoaderProgress(100);
        clearInterval(interval);
        setTimeout(() => setLoading(false), 400);
      } else {
        setLoaderProgress(progress);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Header scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Rotating words
  useEffect(() => {
    const interval = setInterval(() => {
      setPrevWordIndex(wordIndex);
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [wordIndex]);

  // Scroll-driven hero transformation
  const handleTransformScroll = useCallback(() => {
    if (!transformRef.current) return;
    const rect = transformRef.current.getBoundingClientRect();
    const totalHeight = transformRef.current.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / totalHeight));

    // Phase 1: 0-30%
    if (progress <= 0.25) {
      setPhase1Opacity(1);
      setPhase2Opacity(0);
      setPhase3Opacity(0);
    } else if (progress <= 0.32) {
      const t = (progress - 0.25) / 0.07;
      setPhase1Opacity(1 - t);
      setPhase2Opacity(t);
      setPhase3Opacity(0);
    } else if (progress <= 0.5) {
      setPhase1Opacity(0);
      setPhase2Opacity(1);
      setPhase3Opacity(0);
    } else if (progress <= 0.57) {
      const t = (progress - 0.5) / 0.07;
      setPhase1Opacity(0);
      setPhase2Opacity(1 - t);
      setPhase3Opacity(t);
    } else {
      setPhase1Opacity(0);
      setPhase2Opacity(0);
      setPhase3Opacity(1);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleTransformScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleTransformScroll);
  }, [handleTransformScroll]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* LOADER */}
      <div id="loader" className={loading ? "" : "hidden"}>
        <div className="loader-brand">veehtor AI</div>
        <div id="loader-bar-wrap">
          <div id="loader-bar" style={{ width: `${loaderProgress}%` }} />
        </div>
      </div>

      {/* HEADER */}
      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <a href="/" className="logo">
          <img src={vaiLogo} alt="Veehtor AI" className="logo-icon" style={{ height: 28 }} />
          veehtor <span>AI</span>
        </a>
        <nav style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <button className="nav-link-style hidden md:inline-block" onClick={() => scrollTo("process")}>How it works</button>
          <button className="nav-link-style hidden md:inline-block" onClick={() => scrollTo("pricing")}>Pricing</button>
          <button className="nav-cta" onClick={() => scrollTo("contact")}>Get in touch</button>
        </nav>
      </header>

      {/* HERO: SCROLL-DRIVEN TRANSFORMATION */}
      <div className="transformation-wrapper" ref={transformRef}>
        <div className="transformation-sticky">
          {/* Phase 1 */}
          <div className="transform-phase phase-lost" style={{ opacity: phase1Opacity }}>
            <div className="phase-lost-visual">
              {PAIN_CARDS.map((card, i) => (
                <div key={i} className={`chaos-cell ${card.type}`}>{card.text}</div>
              ))}
            </div>
            <div className="phase-text">
              <h2>Still running your business like it's 2022?</h2>
              <p>Missed leads. Manual busywork. Slow responses. The time spent on tasks AI could handle means you're not growing. And you know you could do better than that.</p>
            </div>
            <div className="scroll-indicator">
              <span>Scroll</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="transform-phase phase-transition" style={{ opacity: phase2Opacity }}>
            <h2>What if <em>AI</em> handled the busywork - and you focused on <em>growth</em>?</h2>
          </div>

          {/* Phase 3 */}
          <div className="transform-phase phase-transformed" style={{ opacity: phase3Opacity }}>
            <h2>Your team. <em style={{ color: '#2dd4a8' }}>Amplified.</em></h2>
            <p>We build what matters to your business results while your team does what only humans can.</p>
            <button className="btn-primary" onClick={() => scrollTo("contact")}>
              <strong>Book Your AI Audit</strong> →
            </button>
          </div>
        </div>
      </div>

      {/* MARQUEE */}
      <section className="marquee-section">
        <div className="marquee-track">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="marquee-text">
              <span className="highlight">AI that pays for itself</span> — Stop experimenting. Start profiting.{" "}
            </span>
          ))}
        </div>
      </section>

      {/* PROBLEM */}
      <section className="problem-section">
        <div className="problem-inner">
          <RevealDiv>
            <div className="section-label">The Problem</div>
            <h2 className="problem-heading">
              You've heard AI will change everything. But so far, it's just been{" "}
              <span className="rotating-wrapper">
                {ROTATING_WORDS.map((word, i) => (
                  <span
                    key={word}
                    className={`rotating-word ${i === wordIndex ? "active" : ""} ${i === prevWordIndex ? "exit" : ""}`}
                  >
                    {word}
                  </span>
                ))}
              </span>
            </h2>
          </RevealDiv>

          <div className="problem-grid">
            {[
              { icon: "💸", title: "$20-50K spent on tools that sit unused", desc: "Enterprise licenses, pilot programs, and shiny demos that never made it past the POC phase." },
              { icon: "🤯", title: "Your team is overwhelmed by the hype", desc: "Every vendor promises transformation. Your team just wants to know what actually works for them." },
              { icon: "📊", title: "Consultants pitch decks, not results", desc: "You've seen beautiful strategy presentations. What you haven't seen is measurable ROI." },
            ].map((card, i) => (
              <StaggerChild key={i} delay={i * 0.15}>
                <div className="problem-card">
                  <div className="icon">{card.icon}</div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </div>
              </StaggerChild>
            ))}
          </div>
        </div>
      </section>

      {/* OUTCOMES */}
      <section className="outcomes-section" id="outcomes">
        <div className="outcomes-inner">
          <RevealDiv>
            <div className="section-label">What Changes</div>
            <h2 className="outcomes-heading">The results <em>speak in dollars,</em> not decks.</h2>
            <p className="outcomes-sub">Real numbers from real companies in the first 90 days.</p>
          </RevealDiv>

          <div className="stats-row">
            {STATS.map((stat, i) => (
              <StaggerChild key={i} delay={i * 0.12}>
                <StatBlock stat={stat} />
              </StaggerChild>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="process-section" id="process">
        <div className="process-inner">
          <RevealDiv>
            <div className="section-label">How It Works</div>
            <h2 className="process-heading">Three steps. <em>No fluff.</em></h2>
          </RevealDiv>

          <div className="steps">
            {STEPS.map((step, i) => (
              <StaggerChild key={i} delay={i * 0.15}>
                <div className="step">
                  <div className="step-number">{step.num}</div>
                  <h3>{step.title}</h3>
                  <div className="duration">{step.timeline}</div>
                  <p>{step.desc}</p>
                </div>
              </StaggerChild>
            ))}
          </div>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section className="cases-section" id="case-studies">
        <div className="cases-inner">
          <RevealDiv>
            <div className="section-label">Results</div>
            <h2 className="cases-heading">Companies that <em>shipped AI</em> that works.</h2>
          </RevealDiv>

          <div className="case-cards">
            {CASES.map((c, i) => (
              <StaggerChild key={i} delay={i * 0.15}>
                <div className="case-card">
                  <div className="case-header">
                    <div className="case-industry">{c.industry}</div>
                    <div className="case-metric">{c.metric}</div>
                    <div style={{ fontSize: "0.85rem", color: "#8a8580", fontFamily: "var(--font-body)" }}>{c.metricLabel}</div>
                  </div>
                  <div className="case-body">
                    <div className="case-before-after">
                      <div className="case-ba case-before">
                        <strong>Before</strong>
                        {c.before}
                      </div>
                      <div className="case-ba case-after">
                        <strong>After</strong>
                        {c.after}
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerChild>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing-section" id="pricing">
        <div className="pricing-inner">
          <RevealDiv>
            <h2 className="pricing-heading">Start with <em>clarity.</em> Scale with <em>confidence.</em></h2>
            <p className="pricing-sub">Begin with a 2-week audit — then only implement what proves its value.</p>
          </RevealDiv>

          <div className="pricing-cards">
            <StaggerChild delay={0}>
              <div className="pricing-card featured">
                <div className="pricing-tier">Audit</div>
                <div className="pricing-name">AI Audit</div>
                <div className="pricing-timeline">2 weeks</div>
                <div className="pricing-amount">$1,500</div>
                <p className="pricing-desc">A deep-dive into your workflows to find the highest-ROI AI opportunities.</p>
                <ul className="pricing-features">
                  <li>Workflow analysis & bottleneck mapping</li>
                  <li>Prioritized opportunity scorecard</li>
                  <li>Tool & vendor recommendations</li>
                  <li>3-month roadmap with ROI projections</li>
                  <li>30-min strategy debrief call</li>
                </ul>
                <button className="pricing-btn primary" onClick={() => scrollTo("contact")}>
                  <strong>Book your audit →</strong>
                </button>
              </div>
            </StaggerChild>

            <StaggerChild delay={0.15}>
              <div className="pricing-card">
                <div className="pricing-tier">Implementation</div>
                <div className="pricing-name">Build & Scale</div>
                <div className="pricing-timeline">3-6 months</div>
                <div className="pricing-amount">$12,500–30K</div>
                <p className="pricing-desc">Custom AI agents and workflow automation that delivers measurable ROI.</p>
                <ul className="pricing-features">
                  <li>Custom AI agent development</li>
                  <li>Workflow automation & integrations</li>
                  <li>Team training & adoption playbooks</li>
                  <li>Ongoing optimization & ROI tracking</li>
                  <li>No vendor lock-in — you own everything</li>
                </ul>
                <a href="tel:+17813288464" className="pricing-btn outline">Call me now →</a>
              </div>
            </StaggerChild>
          </div>

          <p className="pricing-note">
            Implementation only starts after you've seen the audit results and approved the plan. No surprises.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta-section" id="contact">
        <div className="cta-inner">
          <RevealDiv>
            <div className="section-label">Let's Talk</div>
            <h2 className="cta-heading">Ready to see what AI can <em>actually do</em> for your business?</h2>
            <p className="cta-sub">Book a 2-week AI Audit. Get a roadmap with real ROI projections. Only pay to implement what proves its value.</p>
            <div className="cta-buttons">
              <a href="mailto:vitor@veehtor.com?subject=AI%20Audit%20Inquiry" className="btn-primary">
                <strong>Book your AI Audit</strong> →
              </a>
              <a href="tel:+17813288464" className="btn-secondary">Call me now</a>
            </div>
            <div className="cta-contact">
              <a href="mailto:vitor@veehtor.com">vitor@veehtor.com</a>
            </div>
          </RevealDiv>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <span className="footer-text">© 2026 Veehtor AI LLC. Tampa, FL.</span>
        <div className="footer-links">
          <a href="https://www.linkedin.com/in/vitorungari/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </footer>
    </>
  );
}
