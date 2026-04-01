export default function MarqueeSection() {
  const text = (
    <>
      <span className="text-primary" style={{ opacity: 0.22 }}>AI that pays for itself</span>
      <span className="mx-8" style={{ opacity: 0.08, color: "white" }}>—</span>
      <span style={{ opacity: 0.08, color: "white" }}>Stop experimenting. Start profiting.</span>
      <span className="mx-16" />
    </>
  );

  return (
    <section className="py-8 md:py-12 overflow-hidden bg-background select-none">
      <div className="animate-marquee flex whitespace-nowrap" style={{ width: "max-content" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] font-normal tracking-tight"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            {text}
          </span>
        ))}
      </div>
    </section>
  );
}
