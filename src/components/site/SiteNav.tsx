import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMapDialog } from "@/components/site/MapDialogProvider";
import { useHomeContent } from "@/i18n/homeContent";
import { useSiteContent } from "@/i18n/siteContent";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Logo } from "@/components/site/Logo";
import { track } from "@/lib/analytics";

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { open } = useMapDialog();
  const C = useHomeContent();
  const S = useSiteContent();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const handleAnchor = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    if (location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate(`/#${id}`);
    }
  };

  const handleCases = (from: "nav" | "nav-mobile") => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    track("cases_nav_clicked", { from });
    navigate("/case-studies");
  };

  const openMap = (source: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
    setMenuOpen(false);
    open(source, e.currentTarget);
  };

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`} id="nav">
      <div className="nav-in">
        <Link className="logo" to="/" aria-label={C.nav.logoAria}>
          <span className="logo-mark">v<span className="dot">.</span>AI</span>
        </Link>
        <nav className="links" aria-label={C.nav.mainAria}>
          <a className="navlink" href="/#oportunidades" onClick={handleAnchor("oportunidades")}>{C.nav.opportunities}</a>
          <a className="navlink" href="/case-studies" onClick={handleCases("nav")}>{C.nav.cases}</a>
          <a className="navlink" href="/#sobre" onClick={handleAnchor("sobre")}>{C.nav.about}</a>
          <button className="btn btn-primary btn-sm nav-cta-desktop" onClick={openMap("nav")}>{C.nav.cta}</button>
        </nav>
        <div className="lang-switcher-wrap" style={{ display: "flex", alignItems: "center", marginLeft: 8 }}>
          <LanguageSwitcher />
        </div>
        <button
          className="menu-btn"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? C.nav.closeMenu : C.nav.openMenu}
          aria-controls="site-mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span /><span />
        </button>
      </div>
      <div className={`mobile-nav${menuOpen ? " open" : ""}`} id="site-mobile-menu">
        <a href="/#oportunidades" onClick={handleAnchor("oportunidades")}>{C.nav.opportunities}</a>
        <a href="/case-studies" onClick={handleCases("nav-mobile")}>{C.nav.cases}</a>
        <a href="/#sobre" onClick={handleAnchor("sobre")}>{C.nav.about}</a>
        <button className="btn btn-primary" onClick={openMap("nav-mobile")}>{C.nav.cta}</button>
      </div>
    </header>
  );
}
