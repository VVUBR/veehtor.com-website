import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import { CASE_STUDIES, type CaseStudy } from "@/data/caseStudies";

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

function MiniCard({ c }: { c: CaseStudy }) {
  return (
    <Link to={`/case-studies/${c.slug}`} className="case-card block" style={{ color: "inherit", textDecoration: "none" }}>
      <div className="case-header">
        <div className="case-industry" style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          <span>{c.sector}</span>
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", lineHeight: 1.15, margin: "0.3rem 0 0.4rem", color: "var(--text-dark)" }}>
          {c.title}
        </h3>
        <p style={{ fontFamily: "var(--font-body)", color: "#5a5550", fontSize: "0.9rem", margin: 0 }}>
          {c.summary}
        </p>
      </div>
    </Link>
  );
}

export default function CaseStudyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const study = useMemo(() => CASE_STUDIES.find((c) => c.slug === slug), [slug]);

  useEffect(() => {
    if (study) {
      setMeta(`${study.title} | Veehtor AI`, study.seoDescription);
    } else {
      setMeta("Case not found | Veehtor AI", "This case does not exist.");
    }
    window.scrollTo(0, 0);
  }, [study]);

  const related = useMemo(() => {
    if (!study) return { list: [] as CaseStudy[], label: "" };
    const bySector = CASE_STUDIES.filter((c) => c.slug !== study.slug && c.sector === study.sector);
    if (bySector.length > 0) {
      return { list: bySector.slice(0, 3), label: `More in ${study.sector}` };
    }
    const byArea = CASE_STUDIES.filter(
      (c) => c.slug !== study.slug && c.areas.some((a) => study.areas.includes(a))
    );
    if (byArea.length > 0) {
      const sharedArea = study.areas.find((a) => byArea.some((c) => c.areas.includes(a)));
      return { list: byArea.slice(0, 3), label: `More in ${sharedArea}` };
    }
    return { list: [] as CaseStudy[], label: "" };
  }, [study]);

  if (!study) {
    return (
      <>
        <SiteHeader />
        <section style={{ background: "var(--bg-hero)", color: "var(--text-light)", padding: "10rem 5vw", minHeight: "80vh" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "3rem", marginBottom: "1rem" }}>Case not found</h1>
            <Link to="/case-studies" style={{ color: "var(--teal)", fontFamily: "var(--font-body)" }}>← Back to Case Studies</Link>
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
            <Link to="/case-studies" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Case Studies</Link>
            <span style={{ margin: "0 0.5rem" }}>/</span>
            <span style={{ color: "var(--text-light)" }}>{study.title}</span>
          </nav>

          <div style={{ marginBottom: "1rem" }}>
            <span style={tagStyle}>{study.sector}</span>
            {study.areas.map((a) => (
              <span key={a} style={{ ...tagStyle, background: "rgba(255,255,255,0.06)", color: "var(--text-light)" }}>{a}</span>
            ))}
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 5vw, 3.8rem)", lineHeight: 1.1, margin: "0 0 1.25rem" }}>
            {study.title}
          </h1>

          <p style={{ fontFamily: "var(--font-body)", fontSize: "1.15rem", lineHeight: 1.6, color: "var(--text-muted)", maxWidth: 760, marginBottom: "1rem" }}>
            {study.summary}
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
                {m.value}
                {m.estimated && (
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: 6, fontFamily: "var(--font-body)" }}>
                    est.
                  </span>
                )}
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--text-muted)", marginTop: "0.4rem", lineHeight: 1.4 }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Narrative */}
      <section style={{ background: "var(--bg-light)", color: "var(--text-dark)", padding: "5rem 5vw" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "grid", gap: "3rem", fontFamily: "var(--font-body)", fontSize: "1.05rem", lineHeight: 1.75 }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: "1rem", color: "var(--text-dark)" }}>The challenge</h2>
            <p style={{ color: "#3a3530", margin: 0 }}>{study.challenge}</p>
          </div>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: "1rem", color: "var(--text-dark)" }}>What we built</h2>
            <p style={{ color: "#3a3530", margin: 0 }}>{study.solution}</p>
          </div>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: "1rem", color: "var(--text-dark)" }}>The result</h2>
            <p style={{ color: "#3a3530", margin: 0 }}>{study.result}</p>
          </div>

          {/* Quote slot: renders nothing until an approved client quote is added */}
          {study.quote && (
            <blockquote style={{ borderLeft: "4px solid var(--teal)", padding: "0.5rem 0 0.5rem 1.5rem", margin: 0, fontStyle: "italic", color: "#3a3530" }}>
              <p style={{ margin: 0, fontSize: "1.15rem" }}>“{study.quote.text}”</p>
              <footer style={{ marginTop: "0.75rem", fontStyle: "normal", fontSize: "0.9rem", color: "#8a8580" }}>— {study.quote.author}</footer>
            </blockquote>
          )}

          {/* About the client */}
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: "1rem", color: "var(--text-dark)" }}>About the client</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
              <tbody>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                  <th style={{ textAlign: "left", padding: "0.75rem 0", color: "#8a8580", fontWeight: 600, width: 140 }}>Sector</th>
                  <td style={{ padding: "0.75rem 0", color: "#3a3530" }}>{study.aboutClient.sector}</td>
                </tr>
                {study.aboutClient.size && (
                  <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                    <th style={{ textAlign: "left", padding: "0.75rem 0", color: "#8a8580", fontWeight: 600 }}>Size</th>
                    <td style={{ padding: "0.75rem 0", color: "#3a3530" }}>{study.aboutClient.size}</td>
                  </tr>
                )}
                {study.aboutClient.scale && (
                  <tr>
                    <th style={{ textAlign: "left", padding: "0.75rem 0", color: "#8a8580", fontWeight: 600 }}>Scale</th>
                    <td style={{ padding: "0.75rem 0", color: "#3a3530" }}>{study.aboutClient.scale}</td>
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
                <MiniCard key={c.slug} c={c} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <div className="section-label">Talk to us</div>
          <h2 className="cta-heading">
            Have a process that <em>still slows your operation down?</em>
          </h2>
          <p className="cta-sub">
            Tell us your challenge. We map where the bottleneck is and build the system around it, like the ones you just read.
          </p>
          <div className="cta-buttons">
            <a
              href="https://cal.com/veehtorai/ai.audit.meeting"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <strong>Book your AI Audit</strong> →
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <span className="footer-text">© Veehtor AI</span>
      </footer>
    </>
  );
}
