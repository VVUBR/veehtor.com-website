import { Button } from "@/components/ui/button";
import { Calendar, Mail, Phone } from "lucide-react";

interface ContactProps {
  content: any;
}

export const Contact = ({ content }: ContactProps) => {
  const calendarLink = content?.personal?.calendarLink;
  const email = content?.personal?.email;
  const phone = content?.personal?.phone;

  return (
    <section id="contact" className="py-16 md:py-24 px-4 bg-secondary/20">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Get started today</h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Book your 2-week AI Audit and get a custom roadmap with clear ROI projections
          </p>
        </div>

        <div className="reveal bg-card rounded-xl p-8 md:p-12 border border-border shadow-lg">
          <div className="grid md:grid-cols-3 gap-6">
            {calendarLink && (
              <Button
                size="lg"
                onClick={() => window.open(calendarLink, "_blank")}
                className="glare-effect h-auto flex-col py-6 gap-3"
              >
                <Calendar className="w-8 h-8" />
                <div>
                  <div className="font-semibold">Book a call</div>
                  <div className="text-xs opacity-90">Schedule on my calendar</div>
                </div>
              </Button>
            )}

            {email && (
              <Button
                size="lg"
                variant="outline"
                onClick={() => (window.location.href = `mailto:${email}`)}
                className="h-auto flex-col py-6 gap-3"
              >
                <Mail className="w-8 h-8" />
                <div>
                  <div className="font-semibold">Email me</div>
                  <div className="text-xs opacity-70">{email}</div>
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
                  <div className="font-semibold">Call me</div>
                  <div className="text-xs opacity-70">{phone}</div>
                </div>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
