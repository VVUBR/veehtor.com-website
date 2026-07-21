import { Link, useLocation, useNavigate } from "react-router-dom";

const S = {
  tag: "Sistemas aplicados à operação.",
  links: [
    { label: "Cases", href: "/case-studies", external: false },
    { label: "Sobre", href: "/#sobre", external: false },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/vitorungari/", external: true },
    { label: "Privacidade", href: "https://www.veehtor.com/privacy", external: true },
    { label: "Termos", href: "https://www.veehtor.com/terms", external: true },
  ],
  copy: "© 2026 Veehtor AI LLC",
};

/** Shared marketing-site footer. Same visual as the home footer. */
export default function SiteFooter() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleAnchor = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const id = href.replace(/^\/?#/, "");
    if (location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <footer>
      <div className="foot-in">
        <div className="foot-brand">v<span className="dot">.</span>AI</div>
        <div className="foot-tag">{S.tag}</div>
        <div className="foot-links">
          {S.links.map((l) =>
            l.external ? (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
            ) : l.href.includes("#") ? (
              <a key={l.label} href={l.href} onClick={handleAnchor(l.href)}>{l.label}</a>
            ) : (
              <Link key={l.label} to={l.href}>{l.label}</Link>
            ),
          )}
        </div>
        <div className="foot-copy">{S.copy}</div>
      </div>
    </footer>
  );
}
