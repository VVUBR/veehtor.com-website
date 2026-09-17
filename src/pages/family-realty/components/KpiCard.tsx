type Tone = "default" | "gold" | "red" | "green";

export default function KpiCard({
  label,
  value,
  sub,
  tone = "default",
  subTone,
}: {
  label: string;
  value: string | number;
  sub?: string;
  tone?: Tone;
  subTone?: Tone;
}) {
  const toneColor = (t: Tone) =>
    t === "gold" ? "var(--fr-gold)" :
    t === "red" ? "var(--fr-red)" :
    t === "green" ? "var(--fr-green)" :
    "var(--fr-navy)";

  return (
    <div className="fr-card p-3 flex flex-col gap-1" style={{ minWidth: 0 }}>
      <div className="fr-muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </div>
      <div
        className="fr-heading"
        style={{
          fontSize: "clamp(15px, 1.6vw, 22px)",
          color: toneColor(tone),
          lineHeight: 1.1,
          whiteSpace: "nowrap",
          fontVariantNumeric: "tabular-nums",
          minWidth: 0,
        }}
      >
        {value}
      </div>
      {sub && (
        <div
          style={{
            fontSize: 11,
            lineHeight: 1.25,
            color: subTone ? toneColor(subTone) : "var(--fr-muted)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}
