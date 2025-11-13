import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import GlareButton from "./GlareButton";
import vaiLogo from "@/assets/vai-logo-dark.png";

interface HeaderProps {
  content: any;
}

export const Header = ({ content }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCTA = () => {
    const ctaSection = document.getElementById("contact");
    ctaSection?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-border/20 ${
        isScrolled ? "bg-[#111827] backdrop-blur-md shadow-sm" : "bg-[#111827]"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex-shrink-0">
            <img 
              src={vaiLogo} 
              alt="v.AI Logo" 
              className="h-10 md:h-12 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {content?.navigation?.links?.map((link: any) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-sm font-medium text-white hover:text-secondary transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-secondary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:block">
            <GlareButton onClick={handleCTA}>
              {content?.navigation?.cta || "Get Started"}
            </GlareButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/20 bg-[#111827]">
            <nav className="flex flex-col space-y-4">
              {content?.navigation?.links?.map((link: any) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left px-4 py-2 text-sm font-medium text-white hover:text-secondary transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <div className="px-4">
                <GlareButton onClick={handleCTA} className="w-full">
                  {content?.navigation?.cta || "Get Started"}
                </GlareButton>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
