import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  CASE_STUDIES,
  SECTOR_LABELS,
  AREA_LABELS,
  pick,
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

function MiniCard({ c, lang }: { c: CaseStudy; lang: "en" | "pt" }) {
  return (
    <Link to={`/case-studies/${c.slug}`} className="case-card block" style={{ color: "inherit", textDecoration: "none" }}>
      <div className="case-header">
        <div className="case-industry" style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          <span>{pick(SECTOR_LABELS[c.sector], lang)}</span>
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", lineHeight: 1.15, margin: "0.3rem 0 0.4rem", color: "var(--text-dark)" }}>
          {pick(c.title, lang)}
        </h3>
        <p style={{ fontFamily: "var(--font-body)", color: "#5a5550", fontSize: "0.9rem", margin: 0 }}>
          {pick(c.summary, lang)}
        </p>
      </div>
    </Link>
  );
}

export default function CaseStudyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useLanguage();
  const tCases = t.caseStudies;
  const study = useMemo(() => CASE_STUDIES.find((c) => c.slug === slug), [slug]);

  useEffect(() => {
    if (study) {
      setMeta(`${pick(study.title, language)} | Veehtor AI`, pick(study.seoDescription, language));
    } else {
      setMeta(tCases.notFoundMetaTitle, tCases.notFoundMetaDescription);
    }
    window.scrollTo(0, 0);
  }, [study, language, tCases.notFoundMetaTitle, tCases.notFoundMetaDescription]);

  const related = useMemo(() => {
    if (!study) return { list: [] as CaseStudy[], label: "" };
    const bySector = CASE_STUDIES.filter((c) => c.slug !== study.slug && c.sector === study.sector);
    if (bySector.length > 0) {
      return {
        list: bySector.slice(0, 3),
        label: tCases.moreIn.replace("{label}", pick(SECTOR_LABELS[study.sector], language)),
      };
    }
    const byArea = CASE_STUDIES.filter(
      (c) => c.slug !== study.slug && c.areas.some((a) => study.areas.includes(a))
    );
    if (byArea.length > 0) {
      const sharedArea = study.areas.find((a) => byArea.some((c) => c.areas.includes(a)));
      return {
        list: byArea.slice(0, 3),
        label: sharedArea
          ? tCases.moreIn.replace("{label}", pick(AREA_LABELS[sharedArea], language))
          : "",
      };
    }
    return { list: [] as CaseStudy[], label: "" };
  }, [study, language, tCases.moreIn]);

  if (!study) {
    return (
      <>
        <SiteHeader />
        <section style={{ background: "var(--bg-hero)", color: "var(--text-light)", padding: "10rem 5vw", minHeight: "80vh" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "3rem", marginBottom: "1rem" }}>{tCases.notFoundTitle}</h1>
            <Link to="/case-studies" style={{ color: "var(--teal)", fontFamily: "var(--font-body)" }}>{tCases.back}</Link>
          </div>
        </section>
      </>
    );
  }

  const tagStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "0.25rem 0.6rem",
    borderRadius: 999,
    fontSize: "0.7rem",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    fontWeight: 700,
    fontFamily: "var(--font-body)",
    background: "rgba(45,212,168,0.12)",
    color: "var(--teal)",
    marginRight: "0.4rem",
    marginBottom: "0.4rem",
  };

  return (
    <>
      <SiteHeader />

      {/* Breadcrumb + Hero */}
      <section style={{ background: "var(--bg-hero)", color: "var(--text-light)", padding: "7rem 5vw 4rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <nav style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
            <Link to="/case-studies" style={{ color: "var(--text-muted)", textDecoration: "none" }}>{tCases.breadcrumbRoot}</Link>
            <span style={{ margin: "0 0.5rem" }}>/</span>
            <span style={{ color: "var(--text-light)" }}>{pick(study.title, language)}</span>
          </nav>

          <div style={{ marginBottom: "1rem" }}>
            <span style={tagStyle}>{pick(SECTOR_LABELS[study.sector], language)}</span>
            {study.areas.map((a) => (
              <span key={a} style={{ ...tagStyle, background: "rgba(255,255,255,0.06)", color: "var(--text-light)" }}>{pick(AREA_LABELS[a], language)}</span>
            ))}
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 5vw, 3.8rem)", lineHeight: 1.1, margin: "0 0 1.25rem" }}>
            {pick(study.title, language)}
          </h1>

          <p style={{ fontFamily: "var(--font-body)", fontSize: "1.15rem", lineHeight: 1.6, color: "var(--text-muted)", maxWidth: 760, marginBottom: "1rem" }}>
            {pick(study.summary, language)}
          </p>

          <div style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--teal)", fontWeight: 600 }}>
            {study.client}
          </div>
        </div>
      </section>

      {/* Metrics row */}
      <section style={{ background: "var(--bg-dark)", color: "var(--text-light)", padding: "4rem 5vw", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem" }}>
          {study.metrics.map((m, i) => (
            <div key={i}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", lineHeight: 1.1, color: "var(--teal)" }}>
                {pick(m.value, language)}
                {m.estimated && (
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: 6, fontFamily: "var(--font-body)" }}>
                    {tCases.est}
                  </span>
                )}
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--text-muted)", marginTop: "0.4rem", lineHeight: 1.4 }}>
                {pick(m.label, language)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Narrative */}
      <section style={{ background: "var(--bg-light)", color: "var(--text-dark)", padding: "5rem 5vw" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "grid", gap: "3rem", fontFamily: "var(--font-body)", fontSize: "1.05rem", lineHeight: 1.75 }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: "1rem", color: "var(--text-dark)" }}>{tCases.challenge}</h2>
            <p style={{ color: "#3a3530", margin: 0 }}>{pick(study.challenge, language)}</p>
          </div>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: "1rem", color: "var(--text-dark)" }}>{tCases.solution}</h2>
            <p style={{ color: "#3a3530", margin: 0 }}>{pick(study.solution, language)}</p>
          </div>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: "1rem", color: "var(--text-dark)" }}>{tCases.result}</h2>
            <p style={{ color: "#3a3530", margin: 0 }}>{pick(study.result, language)}</p>
          </div>

          {study.quote && (
            <blockquote style={{ borderLeft: "4px solid var(--teal)", padding: "0.5rem 0 0.5rem 1.5rem", margin: 0, fontStyle: "italic", color: "#3a3530" }}>
              <p style={{ margin: 0, fontSize: "1.15rem" }}>"{pick(study.quote.text, language)}"</p>
              <footer style={{ marginTop: "0.75rem", fontStyle: "normal", fontSize: "0.9rem", color: "#8a8580" }}>- {study.quote.author}</footer>
            </blockquote>
          )}

          {/* About the client */}
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: "1rem", color: "var(--text-dark)" }}>{tCases.aboutClient}</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
              <tbody>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                  <th style={{ textAlign: "left", padding: "0.75rem 0", color: "#8a8580", fontWeight: 600, width: 140 }}>{tCases.aboutSector}</th>
                  <td style={{ padding: "0.75rem 0", color: "#3a3530" }}>{pick(study.aboutClient.sector, language)}</td>
                </tr>
                {study.aboutClient.size && (
                  <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                    <th style={{ textAlign: "left", padding: "0.75rem 0", color: "#8a8580", fontWeight: 600 }}>{tCases.aboutSize}</th>
                    <td style={{ padding: "0.75rem 0", color: "#3a3530" }}>{pick(study.aboutClient.size, language)}</td>
                  </tr>
                )}
                {study.aboutClient.scale && (
                  <tr>
                    <th style={{ textAlign: "left", padding: "0.75rem 0", color: "#8a8580", fontWeight: 600 }}>{tCases.aboutScale}</th>
                    <td style={{ padding: "0.75rem 0", color: "#3a3530" }}>{pick(study.aboutClient.scale, language)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Related cases */}
      {related.list.length > 0 && (
        <section style={{ background: "var(--bg-light)", color: "var(--text-dark)", padding: "0 5vw 6rem" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: "2rem", color: "var(--text-dark)" }}>
              {related.label}
            </h2>
            <div className="case-cards">
              {related.list.map((c) => (
                <MiniCard key={c.slug} c={c} lang={language} />
              ))}
            </div>
          </div>
        </section>
      )}

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
