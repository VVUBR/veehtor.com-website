import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import vaiLogo from "@/assets/vai-logo-new.png";
import { useLanguage } from "@/i18n/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

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
function StatBlock({ stat }: { stat: { value: number; suffix: string; label: string; desc: string } }) {
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
  const { language, t } = useLanguage();

  const PAIN_CARDS = useMemo(() => t.painCards, [language]);
  const ROTATING_WORDS = useMemo(() => t.rotatingWords, [language]);
  const STATS = useMemo(() => t.outcomes.stats, [language]);
  const STEPS = useMemo(() => t.process.steps, [language]);
  const CASES = useMemo(() => t.cases.items, [language]);

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
  }, [wordIndex, ROTATING_WORDS]);

  // Scroll-driven hero transformation
  const handleTransformScroll = useCallback(() => {
    if (!transformRef.current) return;
    const rect = transformRef.current.getBoundingClientRect();
    const totalHeight = transformRef.current.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / totalHeight));

    if (progress <= 0.25) {
      setPhase1Opacity(1); setPhase2Opacity(0); setPhase3Opacity(0);
    } else if (progress <= 0.32) {
      const tt = (progress - 0.25) / 0.07;
      setPhase1Opacity(1 - tt); setPhase2Opacity(tt); setPhase3Opacity(0);
    } else if (progress <= 0.5) {
      setPhase1Opacity(0); setPhase2Opacity(1); setPhase3Opacity(0);
    } else if (progress <= 0.57) {
      const tt = (progress - 0.5) / 0.07;
      setPhase1Opacity(0); setPhase2Opacity(1 - tt); setPhase3Opacity(tt);
    } else {
      setPhase1Opacity(0); setPhase2Opacity(0); setPhase3Opacity(1);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => requestAnimationFrame(handleTransformScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    handleTransformScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [handleTransformScroll]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* LOADER */}
      <div id="loader" className={loading ? "" : "hidden"}>
        <div className="loader-brand">{t.loader.brand}</div>
        <div id="loader-bar-wrap">
          <div id="loader-bar" style={{ width: `${loaderProgress}%` }} />
        </div>
      </div>

      {/* HEADER */}
      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <a href="/" className="logo">
          <img src={vaiLogo} alt="Veehtor AI" className="logo-icon" style={{ height: 34 }} />
          veehtor <span>AI</span>
        </a>
        <nav style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <button className="nav-link-style hidden md:inline-block" onClick={() => scrollTo("process")}>{t.header.howItWorks}</button>
          <button className="nav-link-style hidden md:inline-block" onClick={() => scrollTo("pricing")}>{t.header.pricing}</button>
          <button className="nav-cta" onClick={() => scrollTo("contact")}>{t.header.getInTouch}</button>
          <LanguageSwitcher />
        </nav>
      </header>

      {/* HERO */}
      <div className="transformation-wrapper" ref={transformRef}>
        <div className="transformation-sticky">
          <div className="transform-phase phase-lost" style={{ opacity: phase1Opacity }}>
            <div className="phase-lost-visual">
              {PAIN_CARDS.map((card, i) => (
                <div key={i} className={`chaos-cell ${card.type}`}>{card.text}</div>
              ))}
            </div>
            <div className="phase-text">
              <h2 style={{ fontWeight: 700 }}>{t.hero.phase1.heading}</h2>
              <p>{t.hero.phase1.paragraph}</p>
            </div>
            <div className="scroll-indicator">
              <span>{t.hero.phase1.scroll}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </div>
          </div>

          <div className="transform-phase phase-transition" style={{ opacity: phase2Opacity }}>
            <h2>
              {t.hero.phase2.headingBefore}<em>{t.hero.phase2.em1}</em>{t.hero.phase2.headingMid}<em>{t.hero.phase2.em2}</em>{t.hero.phase2.headingAfter}
            </h2>
          </div>

          <div className="transform-phase phase-transformed" style={{ opacity: phase3Opacity }}>
            <h2>{t.hero.phase3.headingBefore}<em style={{ color: '#2dd4a8' }}>{t.hero.phase3.em}</em></h2>
            <p>{t.hero.phase3.paragraph}</p>
            <button className="btn-primary" onClick={() => scrollTo("contact")}>
              <strong>{t.hero.phase3.cta}</strong> →
            </button>
          </div>
        </div>
      </div>

      {/* MARQUEE */}
      <section className="marquee-section">
        <div className="marquee-track">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="marquee-text">
              <span className="highlight">{t.marquee.highlight}</span>{t.marquee.rest}
            </span>
          ))}
        </div>
      </section>

      {/* PROBLEM */}
      <section className="problem-section">
        <div className="problem-inner">
          <RevealDiv>
            <div className="section-label">{t.problem.label}</div>
            <h2 className="problem-heading">
              {t.problem.headingBefore}
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
            {t.problem.cards.map((card, i) => (
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
            <div className="section-label">{t.outcomes.label}</div>
            <h2 className="outcomes-heading">{t.outcomes.headingBefore}<em>{t.outcomes.em}</em>{t.outcomes.headingAfter}</h2>
            <p className="outcomes-sub">{t.outcomes.sub}</p>
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
            <div className="section-label">{t.process.label}</div>
            <h2 className="process-heading">{t.process.headingBefore}<em>{t.process.em}</em></h2>
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
            <div className="section-label">{t.cases.label}</div>
            <h2 className="cases-heading">{t.cases.headingBefore}<em>{t.cases.em}</em>{t.cases.headingAfter}</h2>
          </RevealDiv>

          <div className="case-cards">
            {CASES.map((c, i) => (
              <StaggerChild key={i} delay={i * 0.15}>
                <div className="case-card">
                  <div className="case-header">
                    <div className="case-industry">{c.industry}</div>
                    <div className="case-metric">{c.metric}</div>
                    <div style={{ fontSize: "1rem", color: "#8a8580", fontFamily: "var(--font-body)" }}>{c.metricLabel}</div>
                  </div>
                  <div className="case-body">
                    <p>{c.desc}</p>
                    <div className="case-before-after">
                      <div className="case-ba case-before">
                        <strong>{t.cases.before}</strong>
                        {c.before}
                      </div>
                      <div className="case-ba case-after">
                        <strong>{t.cases.after}</strong>
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
            <h2 className="pricing-heading">{t.pricing.headingBefore}<em>{t.pricing.em1}</em>{t.pricing.headingMid}<em>{t.pricing.em2}</em></h2>
            <p className="pricing-sub">{t.pricing.sub}</p>
          </RevealDiv>

          <div className="pricing-cards">
            <StaggerChild delay={0}>
              <div className="pricing-card featured">
                <div className="pricing-tier">{t.pricing.cardA.tier}</div>
                <div className="pricing-name">{t.pricing.cardA.name}</div>
                <div className="pricing-timeline">{t.pricing.cardA.timeline}</div>
                <div className="pricing-amount">{t.pricing.cardA.amount}</div>
                <p className="pricing-desc">{t.pricing.cardA.desc}</p>
                <ul className="pricing-features">
                  {t.pricing.cardA.features.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
                <button className="pricing-btn primary" onClick={() => scrollTo("contact")}>
                  <strong>{t.pricing.cardA.cta}</strong>
                </button>
              </div>
            </StaggerChild>

            <StaggerChild delay={0.15}>
              <div className="pricing-card">
                <div className="pricing-tier">{t.pricing.cardB.tier}</div>
                <div className="pricing-name">{t.pricing.cardB.name}</div>
                <div className="pricing-timeline">{t.pricing.cardB.timeline}</div>
                <div className="pricing-amount">{t.pricing.cardB.amount}</div>
                <p className="pricing-desc">{t.pricing.cardB.desc}</p>
                <ul className="pricing-features">
                  {t.pricing.cardB.features.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
                <a href="tel:+17813288464" className="pricing-btn outline">{t.pricing.cardB.cta}</a>
              </div>
            </StaggerChild>
          </div>

          <p className="pricing-note">{t.pricing.note}</p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta-section" id="contact">
        <div className="cta-inner">
          <RevealDiv>
            <div className="section-label">{t.finalCta.label}</div>
            <h2 className="cta-heading">{t.finalCta.headingBefore}<em>{t.finalCta.em}</em>{t.finalCta.headingAfter}</h2>
            <p className="cta-sub">{t.finalCta.sub}</p>
            <div className="cta-buttons">
              <a href="mailto:vitor@veehtor.com?subject=AI%20Audit%20Inquiry" className="btn-primary">
                <strong>{t.finalCta.primary}</strong> →
              </a>
              <a href="tel:+17813288464" className="btn-secondary">{t.finalCta.secondary}</a>
            </div>
            <div className="cta-contact">
              <a href="mailto:vitor@veehtor.com">vitor@veehtor.com</a>
            </div>
          </RevealDiv>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <span className="footer-text">{t.footer.copyright}</span>
        <div className="footer-links">
          <a href="https://www.linkedin.com/in/vitorungari/" target="_blank" rel="noopener noreferrer">{t.footer.linkedin}</a>
        </div>
      </footer>
    </>
  );
}
