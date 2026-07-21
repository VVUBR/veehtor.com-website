import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "@/components/site/Logo";
import { useSiteContent } from "@/i18n/siteContent";

export default function SiteFooter() {
  const location = useLocation();
  const navigate = useNavigate();
  const S = useSiteContent();

  const handleAnchor = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const id = href.replace(/^\/?#/, "");
    if (location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate(`/#${id}`);
    }
  };

  const links = [
    { label: S.footer.linkCases, href: "/case-studies", external: false, kind: "route" as const },
    { label: S.footer.linkAbout, href: "/#sobre", external: false, kind: "anchor" as const },
    { label: S.footer.linkLinkedIn, href: "https://www.linkedin.com/in/vitorungari/", external: true, kind: "ext" as const },
    { label: S.footer.linkPrivacy, href: "/privacy", external: false, kind: "route" as const },
    { label: S.footer.linkTerms, href: "/terms", external: false, kind: "route" as const },
  ];

  return (
    <footer>
      <div className="foot-in">
        <Link className="foot-brand" to="/" aria-label="v.AI">
          <Logo textColor="#fff" />
        </Link>
        <div className="foot-tag">{S.footer.tag}</div>
        <div className="foot-links">
          {links.map((l) =>
            l.kind === "ext" ? (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
            ) : l.kind === "anchor" ? (
              <a key={l.label} href={l.href} onClick={handleAnchor(l.href)}>{l.label}</a>
            ) : (
              <Link key={l.label} to={l.href}>{l.label}</Link>
            ),
          )}
        </div>
        <div className="foot-copy">{S.footer.copy}</div>
      </div>
    </footer>
  );
}
