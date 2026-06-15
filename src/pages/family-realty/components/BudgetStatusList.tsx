import { JOBS_META, type JobFilter, ALL_JOBS } from "../data";

function statusFor(pct: number) {
  if (pct > 100) return { label: "Acima do budget", color: "var(--fr-red)" };
  if (pct >= 90) return { label: "Perto do limite", color: "var(--fr-gold)" };
  return { label: "Dentro do budget", color: "var(--fr-green)" };
}

export default function BudgetStatusList({ job }: { job: JobFilter }) {
  const rows = (job === ALL_JOBS ? JOBS_META : JOBS_META.filter((j) => j.name === job)).map(
    (j) => {
      const pct = (j.realizado / j.budget) * 100;
      return { name: j.name, pct, status: statusFor(pct) };
    }
  );

  return (
    <div className="fr-card p-5 h-full">
      <h3
        className="fr-heading"
        style={{ fontSize: 16, color: "var(--fr-navy)", marginBottom: 16 }}
      >
        Status de budget por obra
      </h3>

      <div className="flex flex-col gap-3">
        {rows.map((r) => {
          const fill = Math.min(r.pct, 100);
          const over = Math.max(r.pct - 100, 0);
          return (
            <div key={r.name} className="flex items-center gap-3">
              <div style={{ width: 110, fontSize: 13, fontWeight: 700, color: "var(--fr-navy)" }}>
                {r.name}
              </div>

              <div
                style={{
                  flex: 1,
                  position: "relative",
                  height: 14,
                  background: "var(--fr-surface)",
                  borderRadius: 4,
                  overflow: "visible",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: `${fill}%`,
                    background: r.status.color,
                    borderRadius: 4,
                  }}
                />
                {over > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: -2,
                      left: "100%",
                      height: 18,
                      width: `${Math.min(over, 40)}%`,
                      background:
                        "repeating-linear-gradient(45deg, var(--fr-red), var(--fr-red) 4px, #8a0200 4px, #8a0200 8px)",
                      borderRadius: 4,
                    }}
                  />
                )}
              </div>

              <div
                style={{
                  width: 70,
                  textAlign: "right",
                  fontFamily: "Roboto",
                  fontWeight: 900,
                  fontSize: 16,
                  color: r.status.color,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {Math.round(r.pct)}%
              </div>

              <div
                style={{
                  width: 150,
                  textAlign: "right",
                  fontSize: 12,
                  fontWeight: 700,
                  color: r.status.color,
                }}
              >
                {r.status.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
