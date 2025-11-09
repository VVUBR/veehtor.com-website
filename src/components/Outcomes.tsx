interface OutcomesProps {
  content: any;
}

export const Outcomes = ({ content }: OutcomesProps) => {
  if (!content?.outcomes) return null;

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Real results from real companies
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Measurable outcomes in 90 days or less
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {content.outcomes.map((outcome: any, idx: number) => (
            <div
              key={idx}
              className="reveal text-center p-8 bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-3 shiny-text">
                {outcome.metric}
              </div>
              <h3 className="text-xl font-semibold mb-2">{outcome.title}</h3>
              <p className="text-muted-foreground">{outcome.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
