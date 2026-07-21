import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import { useMapDialog } from "@/components/site/MapDialogProvider";
import { useReveal } from "@/hooks/useReveal";
import { useLanguage } from "@/i18n/LanguageContext";
import { track } from "@/lib/analytics";
import {
  CASE_STUDIES,
  SECTOR_LABELS,
  AREA_LABELS,
  PROOF_LABELS,
  pick,
  sortedCases,
  getStatus,
  getMetricProof,
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
  let canon = document.querySelector('link[rel="canonical"]');
  if (!canon) {
    canon = document.createElement("link");
    canon.setAttribute("rel", "canonical");
    document.head.appendChild(canon);
  }
  canon.setAttribute("href", "/case-studies");
}

function CaseCard({ c, lang }: { c: CaseStudy; lang: "en" | "pt" }) {
  const status = getStatus(c);
  const showMetrics = c.metrics.slice(0, 2);
  return (
    <Link
      to={`/case-studies/${c.slug}`}
      className="scard-link reveal"
      onClick={() => track("case_clicked", { slug: c.slug, from: "list" })}
    >
      <article className="scard">
        <div className="case-context">
          {pick(SECTOR_LABELS[c.sector], lang)}
          {c.areas[0] && <> · {pick(AREA_LABELS[c.areas[0]], lang)}</>}
        </div>
        <div className="case-client">{c.client}</div>
        <h3>{pick(c.title, lang)}</h3>
        <p className="desc">{pick(c.summary, lang)}</p>
        <div>
          {showMetrics.map((m, i) => {
            const proof = getMetricProof(c, i);
            return (
              <div className="m" key={i}>
                <div className="m-value">{pick(m.value, lang)}</div>
                <div className="m-label">{pick(m.label, lang)}</div>
                <span className={`badge ${badgeClass[proof]}`} style={{ marginTop: ".55rem" }}>
                  {pick(PROOF_LABELS[proof], lang)}
                </span>
              </div>
            );
          })}
        </div>
        <span className={`badge ${badgeClass[status]}`}>{pick(PROOF_LABELS[status], lang)}</span>
        <span className="case-cta">
          Ver sistema e resultados <span className="arr">→</span>
        </span>
      </article>
    </Link>
  );
}

export default function CaseStudies() {
  const { language } = useLanguage();
  const { open: openMap } = useMapDialog();
  useReveal();

  const cases = useMemo(() => sortedCases(), []);

  useEffect(() => {
    setMeta(
      "Cases entregues | Veehtor AI",
      "10 sistemas em operação com resultados que aparecem no processo. Casos de crédito, folha, checklists por IA e prospecção.",
    );
    window.scrollTo(0, 0);
    track("case_list_viewed", { count: cases.length });
  }, [cases.length]);

  return (
    <div className="home">
      <a className="skip" href="#main">Pular para o conteúdo</a>
      <SiteNav />

      <main id="main">
        <section className="page-hero">
          <div className="wrap">
            <div className="eyebrow reveal">Cases entregues</div>
            <h1 className="reveal">
              10 sistemas em operação.<br />Resultados que aparecem no processo.
            </h1>
            <p className="lede reveal">
              Cada case informa o que foi resolvido, o que foi medido e a escala em que o
              sistema opera.
            </p>
          </div>
        </section>

        <section className="zone-white">
          <div className="wrap">
            <div className="cases-list">
              {cases.map((c) => (
                <CaseCard key={c.slug} c={c} lang={language} />
              ))}
            </div>
          </div>
        </section>

        <section className="dark">
          <div className="wrap closing">
            <div className="eyebrow reveal">Próximo passo</div>
            <h2 className="reveal">
              Qual processo da sua operação<br />custa mais do que deveria?
            </h2>
            <p className="reveal">
              30 minutos. Direto no processo. Sem apresentação genérica.
            </p>
            <button
              className="btn btn-primary reveal"
              onClick={(e) => openMap("cases-list-closing", e.currentTarget)}
            >
              Mapear meu processo →
            </button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
