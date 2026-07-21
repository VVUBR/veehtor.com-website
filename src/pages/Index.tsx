import { useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import OpMap, { HOME_STACK_BREAKPOINT } from "@/components/home/OpMap";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import { useMapDialog } from "@/components/site/MapDialogProvider";
import { useReveal } from "@/hooks/useReveal";
import { useHomeContent } from "@/i18n/homeContent";
import { track } from "@/lib/analytics";
import "@/styles/home.css";

function useCasesInView() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const sec = document.getElementById("cases");
    if (!sec) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            track("cases_section_viewed");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.25 },
    );
    io.observe(sec);
    return () => io.disconnect();
  }, []);
}

export default function Index() {
  const location = useLocation();
  const navigate = useNavigate();
  const { open: openDialog } = useMapDialog();
  const C = useHomeContent();

  const reducedOrSmall = useMemo(() => {
    if (typeof window === "undefined") return true;
    return (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia(`(max-width: ${HOME_STACK_BREAKPOINT}px)`).matches
    );
  }, []);

  useReveal(".home");
  useCasesInView();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [location.hash]);

  const openMap = (source: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
    if (source === "hero") track("hero_primary_cta_clicked");
    openDialog(source, e.currentTarget);
  };

  const goCases = (from: "hero" | "more") => (e: React.MouseEvent) => {
    e.preventDefault();
    if (from === "hero") track("hero_cases_clicked");
    if (from === "more") track("all_cases_clicked");
    navigate("/case-studies");
  };

  const heroCopyClass = reducedOrSmall ? "still-copy" : "play-copy";

  return (
    <div className={`home ${heroCopyClass}`}>
      <a className="skip" href="#main">{C.nav.skip}</a>

      <SiteNav />

      <main id="main">
        <div className="zone-white">
          <section className="hero">
            <div className="wrap">
              <div className="hero-grid">
                <div className="hero-copy">
                  <h1>
                    {C.hero.h1a}<br />{C.hero.h1b}
                  </h1>
                  <p className="hero-body">{C.hero.body}</p>
                  <p className="hero-qual">{C.hero.qual}</p>
                  <div className="hero-ctas">
                    <button className="btn btn-primary" onClick={openMap("hero")}>{C.hero.ctaPrimary}</button>
                    <a className="btn btn-ghost" href="/case-studies" onClick={goCases("hero")}>{C.hero.ctaSecondary}</a>
                  </div>
                  <p className="hero-micro">{C.hero.micro}</p>
                </div>

                <div className="opmap-wrap">
                  <div className="opmap-zone">
                    <OpMap reducedOrSmall={reducedOrSmall} />
                  </div>
                  <div className="map-mini-legend" aria-label={C.hero.legendAria}>
                    {C.hero.legend.map((l, i) => (
                      <span key={l.label}>
                        {i > 0 && <span className="sep">·</span>}
                        <span>
                          <i style={{ background: l.color }} />
                          {l.label}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section aria-label={C.proof.eyebrow}>
            <div className="wrap">
              <div className="sec-head reveal">
                <div className="eyebrow">{C.proof.eyebrow}</div>
                <h2>{C.proof.h2}</h2>
                <p className="sec-sub">{C.proof.sub}</p>
              </div>
              <div className="proof-strip reveal">
                {C.proof.stats.map((s) => (
                  <div className="stat" key={s.client}>
                    <div className="stat-client">{s.client}</div>
                    <div className="stat-num">{s.num}</div>
                    <div className="stat-label">{s.label}</div>
                    <span className={`badge b-${s.badge}`}>{s.badgeLabel}</span>
                  </div>
                ))}
              </div>
              <div className="proof-foot reveal">
                <a
                  className="proof-link all-cases"
                  href="/case-studies"
                  onClick={goCases("more")}
                >
                  {C.proof.link} <span className="arr">→</span>
                </a>
                <span className="proof-note">{C.proof.note}</span>
              </div>
            </div>
          </section>
        </div>

        <div className="dark">
          <section id="oportunidades" style={{ paddingTop: "1rem" }} aria-label={C.vals.eyebrow}>
            <div className="wrap">
              <div className="sec-head reveal">
                <div className="eyebrow">{C.vals.eyebrow}</div>
                <h2>{C.vals.h2}</h2>
                <p className="sec-sub">{C.vals.sub}</p>
              </div>
              <div className="vals reveal">
                {C.vals.items.map((v) => (
                  <div className="val" key={v.title}>
                    <h3>{v.title}</h3>
                    <p>{v.body}</p>
                    <div className="vm">{v.metric}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section aria-label={C.rules.eyebrow}>
            <div className="wrap">
              <div className="sec-head reveal">
                <div className="eyebrow"><b>{C.rules.eyebrow}</b></div>
                <h2>{C.rules.h2}</h2>
              </div>
              <div className="rules-grid">
                <div className="reveal">
                  {C.rules.items.map((r, i) => (
                    <div className="rule" key={r}>
                      <span className="num">{String(i + 1).padStart(2, "0")}</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
                <div className="reveal">
                  <p className="bigphrase">{C.rules.phrase}<span className="odot">.</span></p>
                </div>
              </div>

              <div className="founder reveal" id="sobre">
                <div className="founder-photo" aria-hidden="true" />
                <div>
                  <div className="eyebrow">{C.founder.eyebrow}</div>
                  <h3>{C.founder.h3}</h3>
                  <p>{C.founder.body}</p>
                  <p className="founder-quote">{C.founder.quote}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="closing" aria-label={C.closing.contactAria}>
            <div className="wrap">
              <div className="reveal">
                <h2>{C.closing.h2}</h2>
                <p>{C.closing.body}</p>
                <button className="btn btn-primary" onClick={openMap("final")}>{C.closing.cta}</button>
                <div className="closing-micro">{C.closing.micro}</div>
              </div>
              <div className="agora reveal" aria-hidden="true">
                {C.closing.agora.replace(/v\.AI\.?$/, "")}v<span className="dot">.</span>AI.
              </div>
            </div>
          </section>

          <SiteFooter />
        </div>
      </main>
    </div>
  );
}
