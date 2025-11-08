import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  content: any;
}

export const FAQ = ({ content }: FAQProps) => {
  if (!content?.faq) return null;

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Frequently asked questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about working together
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {content.faq.map((item: any, idx: number) => (
            <AccordionItem
              key={idx}
              value={`item-${idx}`}
              className="reveal bg-card border border-border rounded-lg px-6"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
