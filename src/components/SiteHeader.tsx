import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import vaiLogo from "@/assets/vai-logo-new.png";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";

/**
 * Shared site header. Reproduces the inline header in Index.tsx so the visual
 * design is identical across pages. Anchor links (How it works, Pricing,
 * Get in touch) scroll on the home page and route to `/#anchor` from any
 * other route. "Case Studies" is a real page link.
 */
export default function SiteHeader() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goToAnchor = (id: string) => {
    if (location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <Link to="/" className="logo">
        <img src={vaiLogo} alt="Veehtor AI" className="logo-icon" style={{ height: 34 }} />
        veehtor <span>AI</span>
      </Link>
      <nav style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
        <button className="nav-link-style hidden md:inline-block" onClick={() => goToAnchor("process")}>
          {t.header.howItWorks}
        </button>
        <Link to="/case-studies" className="nav-link-style hidden md:inline-block">
          {t.header.caseStudies}
        </Link>
        <button className="nav-link-style hidden md:inline-block" onClick={() => goToAnchor("pricing")}>
          {t.header.pricing}
        </button>
        <button className="nav-cta" onClick={() => goToAnchor("contact")}>
          {t.header.getInTouch}
        </button>
        <LanguageSwitcher />
      </nav>
    </header>
  );
}
