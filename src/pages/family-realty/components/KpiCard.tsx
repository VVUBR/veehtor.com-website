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
    <div className="fr-card p-5 flex flex-col gap-2">
      <div className="fr-muted" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </div>
      <div className="fr-heading" style={{ fontSize: 28, color: toneColor(tone), lineHeight: 1.1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 13, color: subTone ? toneColor(subTone) : "var(--fr-muted)" }}>
          {sub}
        </div>
      )}
    </div>
  );
}
