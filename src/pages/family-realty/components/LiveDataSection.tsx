import { useMemo, useState } from "react";
import { useFRTable } from "../hooks/useFRData";

const SOURCES: { id: string; label: string }[] = [
  { id: "v_budget_vs_actual_by_project", label: "Budget vs Actual (por obra)" },
  { id: "v_budget_vs_actual", label: "Budget vs Actual" },
  { id: "v_invoices_to_pay", label: "A pagar (invoices)" },
  { id: "v_unassigned_costs", label: "Custos sem obra atribuída" },
  { id: "v_estimate_vs_billed", label: "Estimate vs Billed" },
  { id: "v_contract_payment_summary", label: "Contratos — resumo de pagamento" },
  { id: "v_disbursement_schedule", label: "Cronograma de desembolso" },
  { id: "contracts", label: "Contracts" },
  { id: "history", label: "Histórico" },
];

function formatValue(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "number") {
    if (Math.abs(v) > 100 && Number.isInteger(v * 100)) {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);
    }
    return String(v);
  }
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v)) {
    const d = new Date(v);
    if (!isNaN(d.getTime())) return d.toLocaleDateString("pt-BR");
  }
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

export default function LiveDataSection() {
  const [active, setActive] = useState(SOURCES[0].id);
  const q = useFRTable(active);

  const columns = useMemo(() => {
    const rows = q.data ?? [];
    if (!rows.length) return [] as string[];
    return Object.keys(rows[0] as Record<string, unknown>);
  }, [q.data]);

  return (
    <div className="fr-card p-5">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <h3 className="fr-heading" style={{ fontSize: 16, color: "var(--fr-navy)", marginRight: 12 }}>
          Dados ao vivo
        </h3>
        {SOURCES.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            style={{
              padding: "6px 10px",
              borderRadius: 999,
              fontSize: 12,
              border: "1px solid var(--fr-border)",
              background: active === s.id ? "var(--fr-navy)" : "#fff",
              color: active === s.id ? "#EAAA00" : "var(--fr-navy)",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {q.isLoading && <p className="fr-muted" style={{ fontSize: 13 }}>Carregando…</p>}
      {q.isError && (
        <div style={{ background: "#FDECEC", color: "#B00020", padding: 12, borderRadius: 8, fontSize: 13 }}>
          Não foi possível carregar <b>{active}</b>: {(q.error as Error).message}
          <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>
            Verifique se o role <code>authenticated</code> tem <code>GRANT SELECT</code> nesta view/tabela.
          </div>
        </div>
      )}
      {q.data && q.data.length === 0 && !q.isLoading && !q.isError && (
        <p className="fr-muted" style={{ fontSize: 13 }}>Sem registros.</p>
      )}
      {q.data && q.data.length > 0 && (
        <div style={{ overflow: "auto", maxHeight: 480 }}>
          <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {columns.map((c) => (
                  <th
                    key={c}
                    style={{
                      textAlign: "left",
                      padding: "8px 10px",
                      borderBottom: "2px solid var(--fr-border)",
                      color: "var(--fr-navy)",
                      fontWeight: 700,
                      position: "sticky",
                      top: 0,
                      background: "#fff",
                    }}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {q.data.slice(0, 200).map((row, i) => (
                <tr key={i}>
                  {columns.map((c) => (
                    <td
                      key={c}
                      style={{
                        padding: "8px 10px",
                        borderBottom: "1px solid var(--fr-border)",
                        color: "#0f172a",
                      }}
                    >
                      {formatValue((row as Record<string, unknown>)[c])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {q.data.length > 200 && (
            <p className="fr-muted" style={{ fontSize: 12, marginTop: 8 }}>
              Mostrando 200 de {q.data.length} linhas.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
