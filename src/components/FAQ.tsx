import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Reveal from "./Reveal";

interface FAQProps {
  content: any;
}

export const FAQ = ({ content }: FAQProps) => {
  if (!content?.faq) return null;

  return (
    <section className="py-16 md:py-24 px-4 border-t border-slate-200">
      <div className="container mx-auto max-w-4xl">
        <Reveal>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Frequently asked questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about working together
            </p>
          </div>
        </Reveal>

        <Accordion type="single" collapsible className="space-y-4">
          {content.faq.map((item: any, idx: number) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <AccordionItem
                value={`item-${idx}`}
                className="bg-card border border-border rounded-lg px-6"
              >
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                {item.question}
              </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            </Reveal>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
