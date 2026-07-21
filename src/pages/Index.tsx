import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import OpMap, { HOME_STACK_BREAKPOINT } from "@/components/home/OpMap";
import MapDialog, { type MapDialogHandle } from "@/components/home/MapDialog";
import { homeContent as C } from "@/i18n/homeContent";
import { track } from "@/lib/analytics";
import "@/styles/home.css";

function useReveal() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = document.querySelectorAll<HTMLElement>(".home .reveal");
    if (reduced || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

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

function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrolled;
}

export default function Index() {
  const dialogRef = useRef<MapDialogHandle>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrolled();
  const location = useLocation();
  const navigate = useNavigate();

  const reducedOrSmall = useMemo(() => {
    if (typeof window === "undefined") return true;
    return (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia(`(max-width: ${HOME_STACK_BREAKPOINT}px)`).matches
    );
  }, []);

  useReveal();
  useCasesInView();

  // Close mobile menu on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Handle incoming #anchor from other routes (e.g. /#sobre)
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
    dialogRef.current?.open(source, e.currentTarget);
    setMenuOpen(false);
  };

  const scrollTo = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  const goCases = (from: "hero" | "nav" | "more") => (e: React.MouseEvent) => {
    e.preventDefault();
    if (from === "hero") track("hero_cases_clicked");
    if (from === "more") track("all_cases_clicked");
    setMenuOpen(false);
    navigate("/case-studies");
  };

  const heroCopyClass = reducedOrSmall ? "still-copy" : "play-copy";

  return (
    <div className={`home ${heroCopyClass}`}>
      <a className="skip" href="#main">{C.nav.skip}</a>

      <header className={`nav${scrolled ? " scrolled" : ""}`} id="nav">
        <div className="nav-in">
          <Link className="logo" to="/" aria-label={C.nav.logoAria}>
            v<span className="dot">.</span>AI
          </Link>
          <nav className="links" aria-label={C.nav.mainAria}>
            <a className="navlink" href="#oportunidades" onClick={scrollTo("oportunidades")}>{C.nav.opportunities}</a>
            <a className="navlink" href="/case-studies" onClick={goCases("nav")}>{C.nav.cases}</a>
            <a className="navlink" href="#sobre" onClick={scrollTo("sobre")}>{C.nav.about}</a>
            <button className="btn btn-primary btn-sm nav-cta-desktop" onClick={openMap("nav")}>{C.nav.cta}</button>
          </nav>
          <button
            className="menu-btn"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? C.nav.closeMenu : C.nav.openMenu}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span /><span />
          </button>
        </div>
        <div className={`mobile-nav${menuOpen ? " open" : ""}`} id="mobileMenu">
          <a href="#oportunidades" onClick={scrollTo("oportunidades")}>{C.nav.opportunities}</a>
          <a href="/case-studies" onClick={goCases("nav")}>{C.nav.cases}</a>
          <a href="#sobre" onClick={scrollTo("sobre")}>{C.nav.about}</a>
          <button className="btn btn-primary" onClick={openMap("nav-mobile")}>{C.nav.cta}</button>
        </div>
      </header>

      <main id="main">
        {/* HERO */}
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
                <div className="map-mini-legend" aria-label="Legenda do mapa">
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

        {/* VALS */}
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

        {/* PROOF */}
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
              <a className="proof-link all-cases" href="/case-studies" onClick={goCases("more")}>
                {C.proof.link} <span className="arr">→</span>
              </a>
              <span className="proof-note">{C.proof.note}</span>
            </div>
          </div>
        </section>

        {/* CASES */}
        <div className="zone-white">
          <section id="cases" aria-label={C.cases.eyebrow}>
            <div className="wrap">
              <div className="sec-head reveal">
                <div className="eyebrow">{C.cases.eyebrow}</div>
                <h2>{C.cases.h2}</h2>
                <p className="sec-sub">{C.cases.sub}</p>
              </div>
              <div className="cases3">
                {C.cases.items.map((c) => (
                  <article className="scard reveal" key={c.client + c.h3}>
                    <div>
                      <div className="case-context">{c.context}</div>
                      <div className="case-client">{c.client}</div>
                    </div>
                    <h3>{c.h3}</h3>
                    <p className="desc">{c.desc}</p>
                    <div className="m">
                      <div className="m-value">{c.metric}</div>
                      <div className="m-label">{c.metricLabel}</div>
                    </div>
                    <span className={`badge b-${c.badge}`}>{c.badgeLabel}</span>
                    <Link
                      className="case-cta"
                      to={c.href}
                      data-client={c.client}
                      onClick={() => track("case_clicked", { client: c.client })}
                    >
                      Ver detalhes <span className="arr">→</span>
                    </Link>
                  </article>
                ))}
              </div>
              <div className="cases-more reveal">
                <a className="btn btn-ghost all-cases" href="/case-studies" onClick={goCases("more")}>{C.cases.more}</a>
              </div>
            </div>
          </section>
        </div>

        {/* DARK */}
        <div className="dark">
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

          <section className="closing" aria-label="Contato">
            <div className="wrap">
              <div className="reveal">
                <h2>{C.closing.h2}</h2>
                <p>{C.closing.body}</p>
                <button className="btn btn-primary" onClick={openMap("final")}>{C.closing.cta}</button>
                <div className="closing-micro">{C.closing.micro}</div>
              </div>
              <div className="agora reveal" aria-hidden="true">
                Agora v<span className="dot">.</span>AI.
              </div>
            </div>
          </section>

          <footer>
            <div className="foot-in">
              <div className="foot-brand">v<span className="dot">.</span>AI</div>
              <div className="foot-tag">{C.footer.tag}</div>
              <div className="foot-links">
                {C.footer.links.map((l) =>
                  l.external ? (
                    <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
                  ) : l.href.startsWith("#") ? (
                    <a key={l.label} href={l.href} onClick={scrollTo(l.href.slice(1))}>{l.label}</a>
                  ) : (
                    <Link key={l.label} to={l.href}>{l.label}</Link>
                  ),
                )}
              </div>
              <div className="foot-copy">{C.footer.copy}</div>
            </div>
          </footer>
        </div>
      </main>

      <MapDialog ref={dialogRef} />
    </div>
  );
}
