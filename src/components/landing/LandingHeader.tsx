import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import vaiLogo from "@/assets/vai-logo-new.png";

const NAV_LINKS = [
  { label: "How it works", href: "#process" },
  { label: "About", href: "#outcomes" },
  { label: "Pricing", href: "#pricing" },
];

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/30 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5">
            <img src={vaiLogo} alt="Veehtor AI" className="h-8 md:h-9 w-auto" />
            <span className="text-foreground font-medium text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              veehtor <span className="text-primary">AI</span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("#contact")}
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:brightness-110 transition-all glare-effect"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Get in touch
            </button>
          </nav>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => scrollTo("#contact")}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Get in touch
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="text-foreground p-2">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-border/20">
            <nav className="flex flex-col gap-1 pt-3">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-left px-4 py-3 text-foreground/80 hover:text-foreground text-sm font-medium transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
