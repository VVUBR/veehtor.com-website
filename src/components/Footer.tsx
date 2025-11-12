import { ArrowUp, Linkedin, Twitter, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface FooterProps {
  content: any;
}

export const Footer = ({ content }: FooterProps) => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer id="about" className="py-12 md:py-16 px-4 border-t border-border bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-12 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">
                {content?.personal?.name || "AI Consultant"}
              </h3>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm">
                {content?.personal?.email && (
                  <a
                    href={`mailto:${content.personal.email}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    {content.personal.email}
                  </a>
                )}
                {content?.personal?.phone && (
                  <a
                    href={`tel:${content.personal.phone}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    (781) 328-8464
                  </a>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Follow</h4>
              <div className="flex gap-4">
                {content?.personal?.linkedin && (
                  <a
                    href={content.personal.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {content?.personal?.twitter && (
                  <a
                    href={content.personal.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {content?.footer?.copyright || "© 2025 AI Audit. All rights reserved."}
            </p>
            <div className="flex gap-6">
              {content?.footer?.links?.map((link: any, idx: number) => (
                <a
                  key={idx}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile FABs */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 md:hidden z-40">
        {content?.personal?.phone && (
          <Button
            size="icon"
            onClick={() => (window.location.href = `tel:${content.personal.phone}`)}
            className="w-14 h-14 rounded-full shadow-lg"
          >
            <Phone className="w-5 h-5" />
          </Button>
        )}
        {content?.personal?.email && (
          <Button
            size="icon"
            variant="outline"
            onClick={() => (window.location.href = `mailto:${content.personal.email}`)}
            className="w-14 h-14 rounded-full shadow-lg"
          >
            <Mail className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          size="icon"
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 w-12 h-12 rounded-full shadow-lg z-40 hidden md:flex"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </>
  );
};
