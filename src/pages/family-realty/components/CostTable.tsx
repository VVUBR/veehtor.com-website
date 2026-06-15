import { useMemo, useState } from "react";
import { fmtDate, fmtUSD, JOBS, type CostItem, type PaymentStatus } from "../data";

type SortKey = "date" | "job" | "supplier" | "type" | "stage" | "amount" | "status";

const STATUSES: ("Todos" | PaymentStatus)[] = ["Todos", "Pago", "A pagar", "Em alerta"];

export default function CostTable({ items }: { items: CostItem[] }) {
  const [jobFilter, setJobFilter] = useState<string>("Todas");
  const [statusFilter, setStatusFilter] = useState<string>("Todos");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "date",
    dir: "desc",
  });

  const filtered = useMemo(() => {
    return items.filter(
      (i) =>
        (jobFilter === "Todas" || i.job === jobFilter) &&
        (statusFilter === "Todos" || i.status === statusFilter)
    );
  }, [items, jobFilter, statusFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let av: any = (a as any)[sort.key];
      let bv: any = (b as any)[sort.key];
      if (sort.key === "date") {
        av = (a.date as Date).getTime();
        bv = (b.date as Date).getTime();
      }
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sort]);

  const toggle = (key: SortKey) => {
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    );
  };

  const arrow = (key: SortKey) =>
    sort.key === key ? (sort.dir === "asc" ? " ▲" : " ▼") : "";

  return (
    <div className="fr-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h3 className="fr-heading" style={{ fontSize: 16, color: "var(--fr-navy)", margin: 0 }}>
          Linha a linha de custos
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <label className="fr-muted" style={{ fontSize: 12 }}>
            Obra
            <select
              className="fr-select ml-2"
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
            >
              <option>Todas</option>
              {JOBS.map((j) => (
                <option key={j}>{j}</option>
              ))}
            </select>
          </label>
          <label className="fr-muted" style={{ fontSize: 12 }}>
            Status
            <select
              className="fr-select ml-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <button
            disabled
            className="fr-select"
            style={{ opacity: 0.5, cursor: "not-allowed" }}
            title="Disponível na versão final"
          >
            Exportar
          </button>
        </div>
      </div>

      <div style={{ maxHeight: 480, overflowY: "auto", border: "1px solid var(--fr-border)", borderRadius: 8 }}>
        <table className="fr-table">
          <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
            <tr>
              <th onClick={() => toggle("date")}>Data{arrow("date")}</th>
              <th onClick={() => toggle("job")}>Obra{arrow("job")}</th>
              <th onClick={() => toggle("supplier")}>Fornecedor{arrow("supplier")}</th>
              <th onClick={() => toggle("type")}>Tipo{arrow("type")}</th>
              <th onClick={() => toggle("stage")}>Etapa{arrow("stage")}</th>
              <th onClick={() => toggle("amount")} style={{ textAlign: "right" }}>Valor{arrow("amount")}</th>
              <th onClick={() => toggle("status")}>Status{arrow("status")}</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((it) => (
              <tr key={it.id} className={it.status === "Em alerta" ? "fr-row-alert" : ""}>
                <td>{fmtDate(it.date)}</td>
                <td>{it.job}</td>
                <td>{it.supplier}</td>
                <td>{it.type}</td>
                <td>{it.stage}</td>
                <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                  {fmtUSD(it.amount)}
                </td>
                <td>
                  <span
                    className={
                      it.status === "Pago"
                        ? "fr-dot fr-dot-green"
                        : it.status === "Em alerta"
                        ? "fr-dot fr-dot-red"
                        : "fr-dot fr-dot-gray"
                    }
                  />
                  {it.status}
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={7} className="fr-muted" style={{ textAlign: "center", padding: 24 }}>
                  Nenhum item no filtro atual.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
