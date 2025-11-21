import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface LegalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "privacy" | "terms";
}

export const LegalModal = ({ open, onOpenChange, type }: LegalModalProps) => {
  const navigate = useNavigate();

  const privacyContent = {
    title: "🔒 Privacy Policy – Summary",
    intro: "Here's the quick version of how Veehtor AI handles your data:",
    bullets: [
      "We collect basic business and contact information you choose to share (like your name, email, company, and what you want help with).",
      "We use this data only to provide and improve our AI and automation services for you; we do not sell your personal information.",
      "Some data may be processed by trusted third-party providers (like AI and hosting platforms) to power the tools we build.",
      "You should avoid sending highly sensitive information (passwords, bank details, health data) through generic forms or demos.",
    ],
    footer: "Want all the details? You can read the complete policy on the next page.",
    primaryButton: "View Full Privacy Policy",
    route: "/privacy",
  };

  const termsContent = {
    title: "📜 Terms of Service – Summary",
    intro: "Here's the short version of how our site and services work:",
    bullets: [
      "Veehtor AI provides AI consulting, automations, and agents, and any actual work is governed by a separate written agreement.",
      "AI-generated content is guidance only and may contain errors—you are responsible for reviewing and deciding how to use it.",
      "The site and tools are provided \"as is\", and we may improve or change them over time.",
      "By using this site, you agree to these terms and to use our tools in a lawful, responsible way.",
    ],
    footer: "Want all the legal fine print? You can read the complete terms on the next page.",
    primaryButton: "View Full Terms of Service",
    route: "/terms",
  };

  const content = type === "privacy" ? privacyContent : termsContent;

  const handleViewFull = () => {
    onOpenChange(false);
    navigate(content.route);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{content.title}</DialogTitle>
          <DialogDescription className="text-base pt-4">
            {content.intro}
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-3 my-6">
          {content.bullets.map((bullet, idx) => (
            <li key={idx} className="flex gap-3 text-sm">
              <span className="text-secondary mt-0.5">•</span>
              <span className="text-foreground">{bullet}</span>
            </li>
          ))}
        </ul>

        <p className="text-sm text-muted-foreground mb-6">{content.footer}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleViewFull}>{content.primaryButton}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
