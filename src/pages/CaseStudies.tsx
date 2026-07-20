import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  CASE_STUDIES,
  SECTOR_LABELS,
  AREA_LABELS,
  pick,
  type Area,
  type Sector,
  type CaseStudy,
} from "@/data/caseStudies";

function setMeta(title: string, description: string) {
  document.title = title;
  const setOrCreate = (name: string, content: string, isProperty = false) => {
    const attr = isProperty ? "property" : "name";
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  };
  setOrCreate("description", description);
  setOrCreate("og:title", title, true);
  setOrCreate("og:description", description, true);
  setOrCreate("twitter:title", title);
  setOrCreate("twitter:description", description);
}

function CaseCard({ c, lang, tCases }: { c: CaseStudy; lang: "en" | "pt"; tCases: any }) {
  return (
    <Link
      to={`/case-studies/${c.slug}`}
      className="case-card block no-underline text-inherit"
      style={{ color: "inherit", textDecoration: "none" }}
    >
      <div className="case-header">
        <div className="case-industry" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          <span>{pick(SECTOR_LABELS[c.sector], lang)}</span>
          {c.areas.map((a) => (
            <span key={a} style={{ color: "var(--text-muted-dark)" }}>· {pick(AREA_LABELS[a], lang)}</span>
          ))}
        </div>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.6rem",
            lineHeight: 1.15,
            margin: "0.3rem 0 0.6rem",
            color: "var(--text-dark)",
          }}
        >
          {pick(c.title, lang)}
        </h3>
        <p style={{ fontFamily: "var(--font-body)", color: "#5a5550", fontSize: "0.95rem", margin: 0 }}>
          {pick(c.summary, lang)}
        </p>
      </div>
      <div className="case-body">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
          {c.metrics.map((m, i) => (
            <div key={i}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", lineHeight: 1.15, color: "var(--text-dark)" }}>
                {pick(m.value, lang)}
                {m.estimated && (
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted-dark)", marginLeft: 4, fontFamily: "var(--font-body)" }}>
                    {tCases.est}
                  </span>
                )}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#8a8580", fontFamily: "var(--font-body)", marginTop: 2, lineHeight: 1.3 }}>
                {pick(m.label, lang)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "1.25rem", color: "var(--teal)", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.9rem" }}>
          {tCases.readCase}
        </div>
      </div>
    </Link>
  );
}

export default function CaseStudies() {
  const { t, language } = useLanguage();
  const tCases = t.caseStudies;
  const [sector, setSector] = useState<Sector | "All">("All");
  const [area, setArea] = useState<Area | "All">("All");

  useEffect(() => {
    setMeta(tCases.metaTitle, tCases.metaDescription);
    window.scrollTo(0, 0);
  }, [tCases.metaTitle, tCases.metaDescription]);

  const presentSectors = useMemo(() => {
    const s = new Set<Sector>();
    CASE_STUDIES.forEach((c) => s.add(c.sector));
    return Array.from(s);
  }, []);

  const presentAreas = useMemo(() => {
    const s = new Set<Area>();
    CASE_STUDIES.forEach((c) => c.areas.forEach((a) => s.add(a)));
    return Array.from(s);
  }, []);

  const visible = useMemo(() => {
    return CASE_STUDIES.filter((c) => {
      if (sector !== "All" && c.sector !== sector) return false;
      if (area !== "All" && !c.areas.includes(area)) return false;
      return true;
    });
  }, [sector, area]);

  const pillStyle = (active: boolean): React.CSSProperties => ({
    padding: "0.45rem 0.95rem",
    borderRadius: 999,
    fontFamily: "var(--font-body)",
    fontSize: "0.85rem",
    fontWeight: 600,
    border: active ? "1px solid var(--teal)" : "1px solid rgba(0,0,0,0.12)",
    background: active ? "var(--teal)" : "transparent",
    color: active ? "var(--text-dark)" : "#3a3530",
    cursor: "pointer",
    transition: "all 0.15s",
  });

  return (
    <>
      <SiteHeader />

      {/* Hero */}
      <section style={{ background: "var(--bg-hero)", color: "var(--text-light)", padding: "8rem 5vw 4rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="section-label" style={{ color: "var(--teal)" }}>{tCases.sectionLabel}</div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              lineHeight: 1.05,
              margin: "0.5rem 0 1.5rem",
            }}
          >
            {tCases.heroHeadingBefore}<em>{tCases.heroHeadingEm}</em>
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1.15rem", color: "var(--text-muted)", maxWidth: 720, lineHeight: 1.6 }}>
            {tCases.heroSub}
          </p>
        </div>
      </section>

      {/* Listing */}
      <section style={{ background: "var(--bg-light)", color: "var(--text-dark)", padding: "3rem 5vw 6rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Filter bar */}
          <div style={{ marginBottom: "2rem" }}>
            {/* Desktop: pills (md and up) */}
            <div className="hidden md:block">
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#8a8580", marginBottom: "0.5rem", fontFamily: "var(--font-body)", fontWeight: 600 }}>
                  {tCases.filterSector}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  <button style={pillStyle(sector === "All")} onClick={() => setSector("All")}>{tCases.all}</button>
                  {presentSectors.map((s) => (
                    <button key={s} style={pillStyle(sector === s)} onClick={() => setSector(s)}>{pick(SECTOR_LABELS[s], language)}</button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#8a8580", marginBottom: "0.5rem", fontFamily: "var(--font-body)", fontWeight: 600 }}>
                  {tCases.filterArea}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  <button style={pillStyle(area === "All")} onClick={() => setArea("All")}>{tCases.all}</button>
                  {presentAreas.map((a) => (
                    <button key={a} style={pillStyle(area === a)} onClick={() => setArea(a)}>{pick(AREA_LABELS[a], language)}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile: native selects (below md) */}
            <div className="md:hidden" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <label style={{ display: "block" }}>
                <span style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#8a8580", marginBottom: "0.3rem", fontFamily: "var(--font-body)", fontWeight: 600 }}>
                  {tCases.filterSector}
                </span>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value as Sector | "All")}
                  style={{ width: "100%", padding: "0.55rem 0.6rem", borderRadius: 8, border: "1px solid rgba(0,0,0,0.15)", fontFamily: "var(--font-body)", fontSize: "0.9rem", background: "white" }}
                >
                  <option value="All">{tCases.all}</option>
                  {presentSectors.map((s) => <option key={s} value={s}>{pick(SECTOR_LABELS[s], language)}</option>)}
                </select>
              </label>
              <label style={{ display: "block" }}>
                <span style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#8a8580", marginBottom: "0.3rem", fontFamily: "var(--font-body)", fontWeight: 600 }}>
                  {tCases.filterArea}
                </span>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value as Area | "All")}
                  style={{ width: "100%", padding: "0.55rem 0.6rem", borderRadius: 8, border: "1px solid rgba(0,0,0,0.15)", fontFamily: "var(--font-body)", fontSize: "0.9rem", background: "white" }}
                >
                  <option value="All">{tCases.all}</option>
                  {presentAreas.map((a) => <option key={a} value={a}>{pick(AREA_LABELS[a], language)}</option>)}
                </select>
              </label>
            </div>

            <div style={{ marginTop: "1rem", fontSize: "0.85rem", color: "#8a8580", fontFamily: "var(--font-body)" }}>
              {tCases.showing.replace("{n}", String(visible.length)).replace("{total}", String(CASE_STUDIES.length))}
            </div>
          </div>

          {/* Grid */}
          <div className="case-cards">
            {visible.map((c) => (
              <CaseCard key={c.slug} c={c} lang={language} tCases={tCases} />
            ))}
          </div>

          {visible.length === 0 && (
            <p style={{ textAlign: "center", marginTop: "3rem", color: "#8a8580", fontFamily: "var(--font-body)" }}>
              {tCases.noMatch}
            </p>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <div className="section-label">{tCases.ctaLabel}</div>
          <h2 className="cta-heading">
            {tCases.ctaHeadingBefore}<em>{tCases.ctaHeadingEm}</em>
          </h2>
          <p className="cta-sub">{tCases.ctaSub}</p>
          <div className="cta-buttons">
            <a
              href="https://cal.com/veehtorai/ai.audit.meeting"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <strong>{tCases.ctaButton}</strong> →
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <span className="footer-text">{tCases.footerCopy}</span>
      </footer>
    </>
  );
}
