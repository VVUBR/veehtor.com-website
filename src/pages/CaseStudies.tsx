import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import { CASE_STUDIES, type Area, type Sector, type CaseStudy } from "@/data/caseStudies";

function setMeta(title: string, description: string) {
  document.title = title;
  const set = (sel: string, attr: string, val: string) => {
    let el = document.querySelector(sel);
    if (!el) {
      el = document.createElement("meta");
      const [name, key] = sel.replace(/[[\]"]/g, "").split("=");
      el.setAttribute(name.startsWith("meta") ? name.split("[")[0] : "meta", "");
      // fallback simple creation
    }
    document.querySelector(sel)?.setAttribute(attr, val);
  };
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

function CaseCard({ c }: { c: CaseStudy }) {
  return (
    <Link
      to={`/case-studies/${c.slug}`}
      className="case-card block no-underline text-inherit"
      style={{ color: "inherit", textDecoration: "none" }}
    >
      <div className="case-header">
        <div className="case-industry" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          <span>{c.sector}</span>
          {c.areas.map((a) => (
            <span key={a} style={{ color: "var(--text-muted-dark)" }}>· {a}</span>
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
          {c.title}
        </h3>
        <p style={{ fontFamily: "var(--font-body)", color: "#5a5550", fontSize: "0.95rem", margin: 0 }}>
          {c.summary}
        </p>
      </div>
      <div className="case-body">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
          {c.metrics.map((m, i) => (
            <div key={i}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", lineHeight: 1.15, color: "var(--text-dark)" }}>
                {m.value}
                {m.estimated && (
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted-dark)", marginLeft: 4, fontFamily: "var(--font-body)" }}>
                    est.
                  </span>
                )}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#8a8580", fontFamily: "var(--font-body)", marginTop: 2, lineHeight: 1.3 }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "1.25rem", color: "var(--teal)", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.9rem" }}>
          Read the case →
        </div>
      </div>
    </Link>
  );
}

export default function CaseStudies() {
  const [sector, setSector] = useState<Sector | "All">("All");
  const [area, setArea] = useState<Area | "All">("All");

  useEffect(() => {
    setMeta(
      "Case Studies | Veehtor AI",
      "Real systems we built and shipped for real clients. Each card is one solution: the problem, what we built, and the measured result."
    );
    window.scrollTo(0, 0);
  }, []);

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
          <div className="section-label" style={{ color: "var(--teal)" }}>Case Studies</div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              lineHeight: 1.05,
              margin: "0.5rem 0 1.5rem",
            }}
          >
            Real systems. <em>Real numbers.</em>
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1.15rem", color: "var(--text-muted)", maxWidth: 720, lineHeight: 1.6 }}>
            Every card below is a system we built and shipped for a real client. The problem, what we built, and the measured result. Several clients came back for more: you will see their names repeat.
          </p>
        </div>
      </section>

      {/* Listing */}
      <section style={{ background: "var(--bg-light)", color: "var(--text-dark)", padding: "3rem 5vw 6rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Filter bar */}
          <div style={{ marginBottom: "2rem" }}>
            {/* Desktop: pills (md and up) */}
            <div className="hidden md:block" style={{ display: undefined }}>
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#8a8580", marginBottom: "0.5rem", fontFamily: "var(--font-body)", fontWeight: 600 }}>
                  Sector
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  <button style={pillStyle(sector === "All")} onClick={() => setSector("All")}>All</button>
                  {presentSectors.map((s) => (
                    <button key={s} style={pillStyle(sector === s)} onClick={() => setSector(s)}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#8a8580", marginBottom: "0.5rem", fontFamily: "var(--font-body)", fontWeight: 600 }}>
                  Area
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  <button style={pillStyle(area === "All")} onClick={() => setArea("All")}>All</button>
                  {presentAreas.map((a) => (
                    <button key={a} style={pillStyle(area === a)} onClick={() => setArea(a)}>{a}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile: native selects (below md) */}
            <div className="md:hidden" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <label style={{ display: "block" }}>
                <span style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#8a8580", marginBottom: "0.3rem", fontFamily: "var(--font-body)", fontWeight: 600 }}>
                  Sector
                </span>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value as Sector | "All")}
                  style={{ width: "100%", padding: "0.55rem 0.6rem", borderRadius: 8, border: "1px solid rgba(0,0,0,0.15)", fontFamily: "var(--font-body)", fontSize: "0.9rem", background: "white" }}
                >
                  <option value="All">All</option>
                  {presentSectors.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <label style={{ display: "block" }}>
                <span style={{ display: "block", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#8a8580", marginBottom: "0.3rem", fontFamily: "var(--font-body)", fontWeight: 600 }}>
                  Area
                </span>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value as Area | "All")}
                  style={{ width: "100%", padding: "0.55rem 0.6rem", borderRadius: 8, border: "1px solid rgba(0,0,0,0.15)", fontFamily: "var(--font-body)", fontSize: "0.9rem", background: "white" }}
                >
                  <option value="All">All</option>
                  {presentAreas.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </label>
            </div>

            <div style={{ marginTop: "1rem", fontSize: "0.85rem", color: "#8a8580", fontFamily: "var(--font-body)" }}>
              Showing {visible.length} of {CASE_STUDIES.length}
            </div>
          </div>

          {/* Grid */}
          <div className="case-cards">
            {visible.map((c) => (
              <CaseCard key={c.slug} c={c} />
            ))}
          </div>

          {visible.length === 0 && (
            <p style={{ textAlign: "center", marginTop: "3rem", color: "#8a8580", fontFamily: "var(--font-body)" }}>
              No cases match this combination yet.
            </p>
          )}
        </div>
      </section>

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
