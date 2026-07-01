import { ALL_JOBS, fmtUSD, stageBreakdown, type CostItem, type JobFilter } from "../data";

export default function StageDetailTable({
  job,
  items,
}: {
  job: JobFilter;
  items: CostItem[];
}) {
  const paid = items.filter((i) => i.status === "Pago");
  const rows = stageBreakdown(paid);
  const total = rows.reduce((s, r) => s + r.realizado, 0);

  return (
    <div className="fr-card p-5">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="fr-heading" style={{ fontSize: 16, color: "var(--fr-navy)", margin: 0 }}>
          Detalhe por etapa
        </h3>
        <span className="fr-muted" style={{ fontSize: 12 }}>
          {job === ALL_JOBS ? "Consolidado de todas as obras" : `Obra: ${job}`} · Realizado pago
        </span>
      </div>

      <div style={{ border: "1px solid var(--fr-border)", borderRadius: 8, overflow: "hidden" }}>
        <table className="fr-table">
          <thead>
            <tr>
              <th>Etapa</th>
              <th style={{ textAlign: "right" }}>Realizado</th>
              <th style={{ textAlign: "right" }}>% do total</th>
              <th style={{ textAlign: "right" }}>Nº de lançamentos</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.stage}>
                <td style={{ fontWeight: 700, color: "var(--fr-navy)" }}>{r.stage}</td>
                <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                  {fmtUSD(r.realizado)}
                </td>
                <td
                  style={{
                    textAlign: "right",
                    fontVariantNumeric: "tabular-nums",
                    fontWeight: 700,
                    color: "var(--fr-navy)",
                  }}
                >
                  {Math.round(r.share * 100)}%
                </td>
                <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                  {r.count}
                </td>
              </tr>
            ))}
            {rows.length > 0 && (
              <tr style={{ background: "var(--fr-surface)" }}>
                <td style={{ fontWeight: 900, color: "var(--fr-navy)" }}>Total</td>
                <td style={{ textAlign: "right", fontWeight: 900, fontVariantNumeric: "tabular-nums", color: "var(--fr-navy)" }}>
                  {fmtUSD(total)}
                </td>
                <td style={{ textAlign: "right" }}>—</td>
                <td style={{ textAlign: "right", fontWeight: 900, fontVariantNumeric: "tabular-nums" }}>
                  {rows.reduce((s, r) => s + r.count, 0)}
                </td>
              </tr>
            )}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="fr-muted" style={{ textAlign: "center", padding: 24 }}>
                  Sem lançamentos pagos no filtro atual.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
