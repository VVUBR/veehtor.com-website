import { stageBreakdown, fmtUSD, type JobFilter, ALL_JOBS } from "../data";

function pctColor(pct: number) {
  if (pct > 100) return "var(--fr-red)";
  if (pct >= 90) return "var(--fr-gold)";
  return "var(--fr-green)";
}

export default function StageDetailTable({ job }: { job: JobFilter }) {
  const rows = stageBreakdown(job);

  return (
    <div className="fr-card p-5">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="fr-heading" style={{ fontSize: 16, color: "var(--fr-navy)", margin: 0 }}>
          Detalhe por etapa
        </h3>
        <span className="fr-muted" style={{ fontSize: 12 }}>
          {job === ALL_JOBS ? "Consolidado de todas as obras" : `Obra: ${job}`}
        </span>
      </div>

      <div style={{ border: "1px solid var(--fr-border)", borderRadius: 8, overflow: "hidden" }}>
        <table className="fr-table">
          <thead>
            <tr>
              <th>Etapa</th>
              <th style={{ textAlign: "right" }}>Budget</th>
              <th style={{ textAlign: "right" }}>Realizado</th>
              <th style={{ textAlign: "right" }}>% consumido</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.stage}>
                <td style={{ fontWeight: 700, color: "var(--fr-navy)" }}>{r.stage}</td>
                <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                  {fmtUSD(r.budget)}
                </td>
                <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                  {fmtUSD(r.realizado)}
                </td>
                <td
                  style={{
                    textAlign: "right",
                    fontVariantNumeric: "tabular-nums",
                    fontWeight: 900,
                    fontFamily: "Roboto",
                    color: pctColor(r.pct),
                  }}
                >
                  {Math.round(r.pct)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
