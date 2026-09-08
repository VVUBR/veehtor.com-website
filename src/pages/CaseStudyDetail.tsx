import { useEffect, useMemo } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
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
  bySlug,
  byLegacySlug,
  siblingCases,
  getClientName,
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

const SITE = "https://www.veehtor.com";

function setMeta(title: string, description: string, slug: string, jsonLd: object) {
  document.title = title;
  const url = `${SITE}/case-studies/${slug}`;
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
  setOrCreate("og:type", "article", true);
  setOrCreate("og:url", url, true);
  setOrCreate("twitter:title", title);
  setOrCreate("twitter:description", description);

  let canon = document.querySelector('link[rel="canonical"]');
  if (!canon) {
    canon = document.createElement("link");
    canon.setAttribute("rel", "canonical");
    document.head.appendChild(canon);
  }
  canon.setAttribute("href", url);

  let ld = document.getElementById("case-jsonld");
  if (!ld) {
    ld = document.createElement("script");
    ld.setAttribute("type", "application/ld+json");
    ld.id = "case-jsonld";
    document.head.appendChild(ld);
  }
  ld.textContent = JSON.stringify(jsonLd);
}

export default function CaseStudyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const { open: openMap } = useMapDialog();
  const UI = useSiteContent().caseDetailUI;
  useReveal();

  const ordered = useMemo(() => sortedCases(), []);
  const study = bySlug(slug);
  const legacy = study ? undefined : byLegacySlug(slug);

  // Legacy address: single hop to the new address, preserving query and hash.
  useEffect(() => {
    if (!study && legacy) {
      navigate(`/case-studies/${legacy.slug}${location.search}${location.hash}`, { replace: true });
    }
  }, [study, legacy, navigate, location.search, location.hash]);

  const idx = study ? ordered.findIndex((c) => c.id === study.id) : -1;
  const next = idx >= 0 ? ordered[(idx + 1) % ordered.length] : undefined;
  const siblings = study ? siblingCases(study) : [];

  useEffect(() => {
    if (!study) {
      if (!legacy) document.title = UI.notFoundMetaTitle;
      return;
    }
    window.scrollTo(0, 0);
    const title = `${pick(study.title, language)} | Veehtor AI`;
    const description = pick(study.seoDescription, language);
    setMeta(title, description, study.slug, {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: pick(study.title, language),
      description,
      inLanguage: language === "pt" ? "pt-BR" : "en-US",
      mainEntityOfPage: `${SITE}/case-studies/${study.slug}`,
      author: { "@type": "Organization", name: "Veehtor AI" },
      publisher: { "@type": "Organization", name: "Veehtor AI" },
      about: pick(getClientName(study), language),
    });
    track("case_detail_viewed", { case_id: study.id, slug: study.slug, lang: language });
  }, [study, legacy, language, UI.notFoundMetaTitle]);

  if (!study) {
    if (legacy) return null;
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

  const client = pick(getClientName(study), language);
  const metrics = study.metrics ?? [];

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
              <span>{client}</span>
            </nav>
            <div className="eyebrow reveal" style={{ color: "rgba(255,255,255,.55)" }}>
              {pick(SECTOR_LABELS[study.sector], language)}
              {study.areas.map((a) => (
                <span key={a}> · {pick(AREA_LABELS[a], language)}</span>
              ))}
            </div>
            <h1 className="reveal">{pick(study.title, language)}</h1>
            <div className="client reveal">{client}</div>
            <p className="lede reveal">{pick(study.summary, language)}</p>

            {metrics.length > 0 && (
              <div className="top-metrics reveal">
                {metrics.map((m, i) => (
                  <div className="m" key={i}>
                    <div className="m-value">{pick(m.value, language)}</div>
                    <div className="m-label">{pick(m.label, language)}</div>
                    <span className={`badge ${badgeClass[m.proof]}`}>
                      {pick(PROOF_LABELS[m.proof], language)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="narrative">
          <div className="wrap">
            <div className="n-block reveal">
              <h2>{UI.highlightsH2}</h2>
              <ul className="case-highlights">
                {study.highlights.map((h, i) => (
                  <li key={i}>{pick(h, language)}</li>
                ))}
              </ul>
            </div>

            <div className="n-block reveal">
              <div className="eyebrow">{UI.bottleneckEyebrow}</div>
              <h2>{UI.bottleneckH2}</h2>
              <p>{pick(study.bottleneck, language)}</p>
            </div>

            <div className="n-block reveal">
              <div className="eyebrow">{UI.implementedEyebrow}</div>
              <h2>{UI.implementedH2}</h2>
              <p>{pick(study.implemented, language)}</p>
            </div>

            <div className="n-block reveal">
              <div className="eyebrow">{UI.changedEyebrow}</div>
              <h2>{UI.changedH2}</h2>
              <p>{pick(study.changed, language)}</p>
            </div>

            {study.measurement && (
              <div className="n-block reveal">
                <h2>{UI.measurementH2}</h2>
                <p>{pick(study.measurement, language)}</p>
              </div>
            )}

            <div className="n-block reveal">
              <div className="eyebrow">{UI.ctaEyebrow}</div>
              <p>{pick(study.cta, language)}</p>
              <button
                className="btn btn-ink"
                onClick={(e) => openMap(`case-detail:${study.id}`, e.currentTarget)}
              >
                {UI.ctaButton}
              </button>
            </div>

            {siblings.length > 0 && (
              <div className="n-block reveal">
                <h2>{UI.siblingsH2}</h2>
                <ul className="sibling-list">
                  {siblings.map((s) => (
                    <li key={s.id}>
                      <Link
                        to={`/case-studies/${s.slug}`}
                        onClick={() =>
                          track("case_sibling_clicked", {
                            from: study.id,
                            to: s.id,
                            lang: language,
                          })
                        }
                      >
                        {pick(s.title, language)}
                      </Link>
                    </li>
                  ))}
                </ul>
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
                onClick={() =>
                  track("case_next_clicked", { from: study.id, to: next.id, lang: language })
                }
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
            <h2 className="reveal">{UI.closingH2}</h2>
            <p className="reveal">{UI.closingBody}</p>
            <button
              className="btn btn-primary reveal"
              onClick={(e) => openMap(`case-detail-closing:${study.id}`, e.currentTarget)}
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
