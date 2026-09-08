import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import { useMapDialog } from "@/components/site/MapDialogProvider";
import { useReveal } from "@/hooks/useReveal";
import { useLanguage } from "@/i18n/LanguageContext";
import { useSiteContent } from "@/i18n/siteContent";
import { track } from "@/lib/analytics";
import {
  SECTOR_LABELS,
  AREA_LABELS,
  PROOF_LABELS,
  pick,
  sortedCases,
  getClientName,
  FEATURED_COUNT,
  type CaseStudy,
  type ProofClass,
  type Sector,
  type Area,
} from "@/data/caseStudies";
import "@/styles/home.css";

const badgeClass: Record<ProofClass, string> = {
  measured: "b-measured",
  operational: "b-operational",
  system: "b-system",
  estimated: "b-estimated",
  scale: "b-scale",
};

const SITE = "https://www.veehtor.com";

function setMeta(title: string, description: string) {
  document.title = title;
  const setOrCreate = (name: string, content: string, isProp = false) => {
    const attr = isProp ? "property" : "name";
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
  setOrCreate("og:url", `${SITE}/case-studies`, true);
  setOrCreate("twitter:title", title);
  setOrCreate("twitter:description", description);
  let canon = document.querySelector('link[rel="canonical"]');
  if (!canon) {
    canon = document.createElement("link");
    canon.setAttribute("rel", "canonical");
    document.head.appendChild(canon);
  }
  canon.setAttribute("href", `${SITE}/case-studies`);
}

function CaseCard({
  c,
  lang,
  cardCta,
  featured,
}: {
  c: CaseStudy;
  lang: "en" | "pt";
  cardCta: string;
  featured: boolean;
}) {
  const metrics = (c.metrics ?? []).slice(0, 2);
  const highlights = c.highlights.slice(0, 2);
  return (
    <Link
      to={`/case-studies/${c.slug}`}
      className={`scard-link reveal${featured ? " scard-featured" : ""}`}
      onClick={() => track("case_clicked", { case_id: c.id, slug: c.slug, lang, from: "list" })}
    >
      <article className="scard">
        <div className="case-context">
          {pick(SECTOR_LABELS[c.sector], lang)}
          {c.areas[0] && <> · {pick(AREA_LABELS[c.areas[0]], lang)}</>}
        </div>
        <div className="case-client">{pick(getClientName(c), lang)}</div>
        <h3>{pick(c.title, lang)}</h3>
        <p className="desc">{pick(c.summary, lang)}</p>

        {metrics.length > 0 ? (
          <div>
            {metrics.map((m, i) => (
              <div className="m" key={i}>
                <div className="m-value">{pick(m.value, lang)}</div>
                <div className="m-label">{pick(m.label, lang)}</div>
                <span className={`badge ${badgeClass[m.proof]}`} style={{ marginTop: ".55rem" }}>
                  {pick(PROOF_LABELS[m.proof], lang)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <ul className="case-highlights">
            {highlights.map((h, i) => (
              <li key={i}>{pick(h, lang)}</li>
            ))}
          </ul>
        )}

        <span className="case-cta">{cardCta}</span>
      </article>
    </Link>
  );
}

export default function CaseStudies() {
  const { language } = useLanguage();
  const { open: openMap } = useMapDialog();
  const UI = useSiteContent().caseStudiesUI;
  useReveal();

  const [sector, setSector] = useState<Sector | "All">("All");
  const [area, setArea] = useState<Area | "All">("All");

  const allSorted = useMemo(() => sortedCases(), []);

  const presentSectors = useMemo(() => {
    const s = new Set<Sector>();
    allSorted.forEach((c) => s.add(c.sector));
    return Array.from(s);
  }, [allSorted]);

  const presentAreas = useMemo(() => {
    const s = new Set<Area>();
    allSorted.forEach((c) => c.areas.forEach((a) => s.add(a)));
    return Array.from(s);
  }, [allSorted]);

  const cases = useMemo(
    () =>
      allSorted.filter((c) => {
        if (sector !== "All" && c.sector !== sector) return false;
        if (area !== "All" && !c.areas.includes(area)) return false;
        return true;
      }),
    [allSorted, sector, area],
  );

  useEffect(() => {
    setMeta(UI.metaTitle, UI.metaDescription);
    window.scrollTo(0, 0);
    track("case_list_viewed", { count: allSorted.length, lang: language });
  }, [allSorted.length, UI.metaTitle, UI.metaDescription, language]);

  useEffect(() => {
    if (sector !== "All" || area !== "All") {
      track("case_filter_changed", { sector, area, count: cases.length, lang: language });
    }
  }, [sector, area, cases.length, language]);

  const pill = (active: boolean): React.CSSProperties => ({
    padding: ".4rem .85rem",
    borderRadius: 999,
    fontFamily: "var(--font-sans)",
    fontSize: ".85rem",
    fontWeight: 600,
    border: `1px solid ${active ? "var(--ink)" : "var(--line)"}`,
    background: active ? "var(--ink)" : "transparent",
    color: active ? "#fff" : "var(--ink)",
    cursor: "pointer",
    transition: "all .15s",
  });

  const filterLabel: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: ".68rem",
    letterSpacing: ".1em",
    textTransform: "uppercase",
    color: "var(--muted)",
    marginBottom: ".5rem",
  };

  return (
    <div className="home">
      <a className="skip" href="#main">{UI.skip}</a>
      <SiteNav />

      <main id="main">
        <section className="page-hero page-hero-compact">
          <div className="wrap">
            <div className="eyebrow reveal"><b>{UI.eyebrow}</b></div>
            <h1 className="reveal">
              {UI.h1a}<br />{UI.h1b}
            </h1>
            <p className="lede reveal">{UI.lede}</p>
            <p className="lede reveal" style={{ marginTop: ".5rem" }}>{UI.lede2}</p>
          </div>
        </section>

        <section className="zone-white section-compact">
          <div className="wrap">
            <div className="reveal case-filters">
              <div>
                <div style={filterLabel}>{UI.filterSector}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
                  <button style={pill(sector === "All")} onClick={() => setSector("All")}>{UI.allSectors}</button>
                  {presentSectors.map((s) => (
                    <button key={s} style={pill(sector === s)} onClick={() => setSector(s)}>
                      {pick(SECTOR_LABELS[s], language)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div style={filterLabel}>{UI.filterArea}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
                  <button style={pill(area === "All")} onClick={() => setArea("All")}>{UI.allAreas}</button>
                  {presentAreas.map((a) => (
                    <button key={a} style={pill(area === a)} onClick={() => setArea(a)}>
                      {pick(AREA_LABELS[a], language)}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: ".72rem", color: "var(--muted)" }}>
                {UI.counter(cases.length, allSorted.length)}
              </div>
            </div>

            {cases.length > 0 ? (
              <div className="cases-list">
                {cases.map((c) => (
                  <CaseCard
                    key={c.slug}
                    c={c}
                    lang={language}
                    cardCta={UI.cardCta}
                    featured={c.order <= FEATURED_COUNT}
                  />
                ))}
              </div>
            ) : (
              <p style={{ fontFamily: "var(--font-mono)", fontSize: ".85rem", color: "var(--muted)", padding: "2rem 0" }}>
                {UI.empty}
              </p>
            )}
          </div>
        </section>

        <section className="dark">
          <div className="wrap closing">
            <div className="eyebrow reveal">{UI.closingEyebrow}</div>
            <h2 className="reveal">{UI.closingH2}</h2>
            <p className="reveal">{UI.closingBody}</p>
            <button
              className="btn btn-primary reveal"
              onClick={(e) => openMap("cases-list-closing", e.currentTarget)}
            >
              {UI.closingCta}
            </button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
