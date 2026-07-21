import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMapDialog } from "@/components/site/MapDialogProvider";
import { track } from "@/lib/analytics";

// Structured strings — kept local so a future i18n layer can lift them.
const S = {
  opportunities: "Oportunidades",
  cases: "Cases",
  about: "Sobre",
  cta: "Mapear meu processo",
  logoAria: "v.AI",
  mainAria: "Navegação principal",
  openMenu: "Abrir menu",
  closeMenu: "Fechar menu",
};

/**
 * Shared marketing-site navigation. Sticky, same visual as the home nav.
 * Anchor links (#oportunidades, #sobre) scroll on `/` and navigate to
 * `/#anchor` from any other route. `/case-studies` is a real link.
 */
export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { open } = useMapDialog();

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
        <Link className="logo" to="/" aria-label={S.logoAria}>
          v<span className="dot">.</span>AI
        </Link>
        <nav className="links" aria-label={S.mainAria}>
          <a className="navlink" href="/#oportunidades" onClick={handleAnchor("oportunidades")}>{S.opportunities}</a>
          <a className="navlink" href="/case-studies" onClick={handleCases("nav")}>{S.cases}</a>
          <a className="navlink" href="/#sobre" onClick={handleAnchor("sobre")}>{S.about}</a>
          <button className="btn btn-primary btn-sm nav-cta-desktop" onClick={openMap("nav")}>{S.cta}</button>
        </nav>
        <button
          className="menu-btn"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? S.closeMenu : S.openMenu}
          aria-controls="site-mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span /><span />
        </button>
      </div>
      <div className={`mobile-nav${menuOpen ? " open" : ""}`} id="site-mobile-menu">
        <a href="/#oportunidades" onClick={handleAnchor("oportunidades")}>{S.opportunities}</a>
        <a href="/case-studies" onClick={handleCases("nav-mobile")}>{S.cases}</a>
        <a href="/#sobre" onClick={handleAnchor("sobre")}>{S.about}</a>
        <button className="btn btn-primary" onClick={openMap("nav-mobile")}>{S.cta}</button>
      </div>
    </header>
  );
}
