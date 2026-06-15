type Tone = "default" | "gold" | "red";

export default function KpiCard({
  label,
  value,
  sub,
  trend,
  tone = "default",
}: {
  label: string;
  value: string | number;
  sub?: string;
  trend?: { dir: "up" | "down"; text: string; good: boolean };
  tone?: Tone;
}) {
  const valueColor =
    tone === "gold"
      ? "var(--fr-gold)"
      : tone === "red"
      ? "var(--fr-red)"
      : "var(--fr-navy)";

  return (
    <div className="fr-card p-5 flex flex-col gap-2">
      <div className="fr-muted" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </div>
      <div
        className="fr-heading"
        style={{ fontSize: 28, color: valueColor, lineHeight: 1.1 }}
      >
        {value}
      </div>
      {sub && (
        <div className="fr-muted" style={{ fontSize: 13 }}>
          {sub}
        </div>
      )}
      {trend && (
        <div
          style={{
            fontSize: 12,
            color: trend.good ? "var(--fr-green)" : "var(--fr-red)",
            fontWeight: 700,
          }}
        >
          {trend.dir === "up" ? "▲" : "▼"} {trend.text}
        </div>
      )}
    </div>
  );
}
