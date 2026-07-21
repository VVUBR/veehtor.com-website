import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
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
  getStatus,
  getMetricProof,
  getHonesty,
  type ProofClass,
} from "@/data/caseStudies";
import "@/styles/home.css";

const badgeClass: Record<ProofClass, string> = {
  measured: "b-measured",
  operational: "b-operational",
  system: "b-system",
  estimated: "b-estimated",
  scale: "b-scale",
};

function setMeta(title: string, description: string, slug: string) {
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
  canon.setAttribute("href", `/case-studies/${slug}`);
}

export default function CaseStudyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const { open: openMap } = useMapDialog();
  const UI = useSiteContent().caseDetailUI;
  useReveal();

  const ordered = useMemo(() => sortedCases(), []);
  const idx = useMemo(() => ordered.findIndex((c) => c.slug === slug), [ordered, slug]);
  const study = idx >= 0 ? ordered[idx] : undefined;
  const next = idx >= 0 ? ordered[(idx + 1) % ordered.length] : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (study) {
      const title = `${pick(study.title, language)} — ${study.client} | Veehtor AI`;
      setMeta(title, pick(study.seoDescription, language), study.slug);
      track("case_detail_viewed", { slug: study.slug });
    } else {
      document.title = UI.notFoundMetaTitle;
    }
  }, [study, language, UI.notFoundMetaTitle]);

  if (!study) {
    return (
      <div className="home">
        <SiteNav />
        <main>
          <section className="page-hero">
            <div className="wrap">
              <h1>{UI.notFoundTitle}</h1>
              <p className="lede">
                <Link to="/case-studies">{UI.backToList}</Link>
              </p>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const status = getStatus(study);
  const honesty = getHonesty(study);
  const scale = study.aboutClient;

  return (
    <div className="home">
      <a className="skip" href="#main">{UI.backToList}</a>
      <SiteNav />

      <main id="main">
        <section className="detail-hero page-hero">
          <div className="wrap">
            <nav className="crumb" aria-label={UI.breadcrumbAria}>
              <Link to="/case-studies">{UI.breadcrumbRoot}</Link>
              <span aria-hidden>/</span>
              <span>{study.client}</span>
            </nav>
            <div className="eyebrow reveal" style={{ color: "rgba(255,255,255,.55)" }}>
              {pick(SECTOR_LABELS[study.sector], language)}
              {study.areas[0] && <> · {pick(AREA_LABELS[study.areas[0]], language)}</>}
            </div>
            <h1 className="reveal">{pick(study.title, language)}</h1>
            <div className="client reveal">{study.client}</div>
            <p className="lede reveal">{pick(study.summary, language)}</p>
            <div className="reveal" style={{ marginTop: "1rem" }}>
              <span className={`badge ${badgeClass[status]}`}>
                {pick(PROOF_LABELS[status], language)}
              </span>
            </div>

            <div className="top-metrics reveal">
              {study.metrics.map((m, i) => {
                const proof = getMetricProof(study, i);
                return (
                  <div className="m" key={i}>
                    <div className="m-value">{pick(m.value, language)}</div>
                    <div className="m-label">{pick(m.label, language)}</div>
                    <span className={`badge ${badgeClass[proof]}`}>
                      {pick(PROOF_LABELS[proof], language)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="narrative">
          <div className="wrap">
            <div className="n-block reveal">
              <div className="eyebrow">{UI.contextEyebrow}</div>
              <h2>{UI.contextH2}</h2>
              <p>{pick(study.challenge, language)}</p>
            </div>

            <div className="n-block reveal">
              <div className="eyebrow">{UI.solutionEyebrow}</div>
              <h2>{UI.solutionH2}</h2>
              <p>{pick(study.solution, language)}</p>
            </div>

            <div className="n-block reveal">
              <div className="eyebrow">{UI.resultEyebrow}</div>
              <h2>{UI.resultH2}</h2>
              <p>{pick(study.result, language)}</p>
              <div className="beforeafter">
                {study.metrics.map((m, i) => {
                  const proof = getMetricProof(study, i);
                  return (
                    <div className="ba-cell" key={i}>
                      <div className="m-value">{pick(m.value, language)}</div>
                      <div className="m-label">{pick(m.label, language)}</div>
                      <span className={`badge ${badgeClass[proof]}`}>
                        {pick(PROOF_LABELS[proof], language)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="n-block reveal">
              <div className="eyebrow">{UI.scaleEyebrow}</div>
              <h2>{UI.scaleH2}</h2>
              <dl className="scale-grid">
                <div>
                  <dt>{UI.scaleSector}</dt>
                  <dd>{pick(scale.sector, language)}</dd>
                </div>
                {scale.size && (
                  <div>
                    <dt>{UI.scaleSize}</dt>
                    <dd>{pick(scale.size, language)}</dd>
                  </div>
                )}
                {scale.scale && (
                  <div>
                    <dt>{UI.scaleScale}</dt>
                    <dd>{pick(scale.scale, language)}</dd>
                  </div>
                )}
                <div>
                  <dt>{UI.scaleAreas}</dt>
                  <dd>{study.areas.map((a) => pick(AREA_LABELS[a], language)).join(" · ")}</dd>
                </div>
              </dl>
            </div>

            {honesty && (
              <div className="n-block reveal">
                <div className="honesty">
                  <strong>{UI.honestyLabel}</strong>
                  {pick(honesty, language)}
                </div>
              </div>
            )}
          </div>
        </section>

        {next && (
          <section className="next-case">
            <div className="wrap">
              <Link
                to={`/case-studies/${next.slug}`}
                className="nc"
                onClick={() => track("case_next_clicked", { from: study.slug, to: next.slug })}
              >
                <div>
                  <div className="nc-left">{UI.nextCase}</div>
                  <div className="nc-title">{pick(next.title, language)}</div>
                </div>
                <span className="arr" aria-hidden>→</span>
              </Link>
            </div>
          </section>
        )}

        <section className="dark">
          <div className="wrap closing">
            <div className="eyebrow reveal">{UI.closingEyebrow}</div>
            <h2 className="reveal">
              {UI.closingH2a}<br />{UI.closingH2b}
            </h2>
            <p className="reveal">{UI.closingBody}</p>
            <button
              className="btn btn-primary reveal"
              onClick={(e) => openMap(`case-detail:${study.slug}`, e.currentTarget)}
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
