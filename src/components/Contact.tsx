import { Calendar, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import GlareButton from "./GlareButton";
import Reveal from "./Reveal";

interface ContactProps {
  content: any;
}

export const Contact = ({ content }: ContactProps) => {
  const calendarLink = "https://cal.com/veehtorai";
  const email = content?.personal?.email;
  const phone = content?.personal?.phone;

  return (
    <section id="contact" className="py-16 md:py-24 px-4 border-t border-slate-200">
      <div className="container mx-auto max-w-4xl">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Get started today</h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Book your 2-week AI Audit and get a custom roadmap with clear ROI projections
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="bg-card rounded-xl p-8 md:p-12 border border-border shadow-lg">
            <div className="grid md:grid-cols-3 gap-6">
              {calendarLink && (
                <GlareButton
                  size="lg"
                  onClick={() => window.open(calendarLink, "_blank")}
                  className="h-auto flex-col py-6 gap-3"
                >
                <Calendar className="w-8 h-8" />
                <div>
                  <div className="font-semibold">Book a call</div>
                  <div className="text-xs opacity-90">Schedule on my calendar</div>
                </div>
              </GlareButton>
            )}

            {email && (
              <Button
                size="lg"
                variant="outline"
                onClick={() => (window.location.href = `mailto:${email}`)}
                className="h-auto flex-col py-6 gap-3"
              >
                <Mail className="w-8 h-8 text-[#020617]" />
                <div>
                  <div className="font-semibold text-[#020617]">Email me</div>
                <div className="text-xs text-[#020617] opacity-70">{email}</div>
              </div>
            </Button>
          )}

          {phone && (
              <Button
                size="lg"
                variant="outline"
                onClick={() => (window.location.href = `tel:${phone}`)}
                className="h-auto flex-col py-6 gap-3"
              >
                <Phone className="w-8 h-8" />
                <div>
                  <div className="font-semibold text-[#020617]">Call me</div>
                <div className="text-xs opacity-70">{phone}</div>
              </div>
            </Button>
          )}
          </div>
        </div>
      </Reveal>
      </div>
    </section>
  );
};
