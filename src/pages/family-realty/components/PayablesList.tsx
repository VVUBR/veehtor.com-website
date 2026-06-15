import { payables, fmtUSD, fmtDayMonth, type CostItem } from "../data";

export default function PayablesList({ items }: { items: CostItem[] }) {
  const rows = payables(items).slice(0, 14);

  return (
    <div className="fr-card p-5">
      <h3 className="fr-heading" style={{ fontSize: 16, color: "var(--fr-navy)", marginBottom: 12 }}>
        A pagar
      </h3>

      <div style={{ maxHeight: 420, overflowY: "auto", border: "1px solid var(--fr-border)", borderRadius: 8 }}>
        <table className="fr-table">
          <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
            <tr>
              <th>Fornecedor</th>
              <th>Obra</th>
              <th style={{ textAlign: "right" }}>Valor</th>
              <th>Vencimento</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const overdue = r.daysDiff < 0;
              return (
                <tr key={r.id} className={overdue ? "fr-row-alert" : ""}>
                  <td>{r.supplier}</td>
                  <td>{r.job}</td>
                  <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    {fmtUSD(r.amount)}
                  </td>
                  <td style={{ fontVariantNumeric: "tabular-nums" }}>{fmtDayMonth(r.dueDate)}</td>
                  <td>
                    {overdue ? (
                      <span style={{ color: "var(--fr-red)", fontWeight: 700 }}>
                        <span className="fr-dot fr-dot-red" />
                        Em atraso há {Math.abs(r.daysDiff)} {Math.abs(r.daysDiff) === 1 ? "dia" : "dias"}
                      </span>
                    ) : (
                      <span style={{ color: "var(--fr-text)" }}>
                        <span className="fr-dot fr-dot-gray" />
                        Vence em {r.daysDiff} {r.daysDiff === 1 ? "dia" : "dias"}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="fr-muted" style={{ textAlign: "center", padding: 24 }}>
                  Nenhum pagamento em aberto para esta obra.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
