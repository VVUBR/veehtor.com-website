import { ALL_JOBS, fmtUSD, type JobFilter, type JobMeta } from "../data";

function statusFor(pct: number) {
  if (pct > 100) return { label: "Acima do budget", color: "var(--fr-red)" };
  if (pct >= 90) return { label: "Perto do limite", color: "var(--fr-gold)" };
  return { label: "Dentro do budget", color: "var(--fr-green)" };
}

export default function BudgetStatusList({
  job,
  jobsMeta,
}: {
  job: JobFilter;
  jobsMeta: JobMeta[];
}) {
  const scope = job === ALL_JOBS ? jobsMeta : jobsMeta.filter((j) => j.name === job);
  const rows = scope
    .map((j) => {
      const pct = j.budget > 0 ? (j.realizado / j.budget) * 100 : 0;
      return { name: j.name, budget: j.budget, realizado: j.realizado, pct, status: statusFor(pct) };
    })
    .sort((a, b) => b.pct - a.pct);

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
          const noBudget = r.budget === 0;
          return (
            <div key={r.name} className="flex items-center gap-3">
              <div style={{ width: 140, fontSize: 13, fontWeight: 700, color: "var(--fr-navy)" }}>
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
                  width: 90,
                  textAlign: "right",
                  fontFamily: "Roboto",
                  fontWeight: 900,
                  fontSize: 15,
                  color: noBudget ? "var(--fr-muted)" : r.status.color,
                  fontVariantNumeric: "tabular-nums",
                }}
                title={`${fmtUSD(r.realizado)} de ${fmtUSD(r.budget)}`}
              >
                {noBudget ? "s/ budget" : `${Math.round(r.pct)}%`}
              </div>

              <div
                style={{
                  width: 150,
                  textAlign: "right",
                  fontSize: 12,
                  fontWeight: 700,
                  color: noBudget ? "var(--fr-muted)" : r.status.color,
                }}
              >
                {noBudget ? "Sem estimate" : r.status.label}
              </div>
            </div>
          );
        })}
        {rows.length === 0 && (
          <div className="fr-muted" style={{ fontSize: 13, padding: 12 }}>
            Nenhuma obra encontrada.
          </div>
        )}
      </div>
    </div>
  );
}
