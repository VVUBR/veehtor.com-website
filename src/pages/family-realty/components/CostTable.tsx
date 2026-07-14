import { useMemo, useState } from "react";
import { useI18n, fmtCurrency, fmtDateLocale } from "../lib/i18n";
import SupplierSelect, { matchSupplier } from "./SupplierSelect";
import { today0, type HistoryItem } from "../data";

type SortKey = "date" | "job" | "supplier" | "type" | "stage" | "amount" | "status";
const PAGE = 50;

type PeriodKey = "all" | "last30" | "last90" | "year";

function periodStart(p: PeriodKey): number {
  if (p === "all") return -Infinity;
  const now = new Date();
  if (p === "year") return new Date(now.getFullYear(), 0, 1).getTime();
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - (p === "last30" ? 30 : 90));
  return d.getTime();
}

export default function CostTable({ items }: { items: HistoryItem[] }) {
  const { t, lang } = useI18n();
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "date", dir: "desc" });
  const [page, setPage] = useState(1);
  const [supplier, setSupplier] = useState<string>("");
  const [period, setPeriod] = useState<PeriodKey>("all");

  const filtered = useMemo(() => {
    const start = periodStart(period);
    return items.filter((i) => {
      if (!matchSupplier(i.supplier, i.supplierCanonical, supplier)) return false;
      if (period === "all") return true;
      if (!i.date) return false;
      return i.date.getTime() >= start;
    });
  }, [items, supplier, period]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const dir = sort.dir === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      const k = sort.key;
      if (k === "date") return ((a.date?.getTime() ?? 0) - (b.date?.getTime() ?? 0)) * dir;
      if (k === "amount") return (a.amount - b.amount) * dir;
      const av = String((a as unknown as Record<string, unknown>)[k] || "");
      const bv = String((b as unknown as Record<string, unknown>)[k] || "");
      return av.localeCompare(bv) * dir;
    });
    return arr;
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE));
  const clampedPage = Math.min(page, totalPages);
  const pageItems = sorted.slice((clampedPage - 1) * PAGE, clampedPage * PAGE);
  const today = today0().getTime();
  const total = sorted.reduce((s, r) => s + r.amount, 0);
  const supplierOptions = useMemo(() => items.map((i) => i.supplierCanonical || i.supplier), [items]);

  const toggle = (key: SortKey) => setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));
  const arrow = (key: SortKey) => (sort.key === key ? (sort.dir === "asc" ? " ▲" : " ▼") : "");

  const downloadCsv = () => {
    const header = ["Date", "Job", "Supplier", "Type", "Phase", "Amount", "Status", "DueDate"];
    const lines = sorted.map((r) => [
      r.date ? r.date.toISOString().slice(0, 10) : "",
      r.job || "Unassigned",
      r.supplier, r.type, r.stage, r.amount.toFixed(2), r.status,
      r.dueDate ? r.dueDate.toISOString().slice(0, 10) : "",
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
    const blob = new Blob([header.join(",") + "\n" + lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "family-realty-line-items.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fr-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h3 className="fr-heading" style={{ fontSize: 16, color: "var(--fr-navy)", margin: 0 }}>
          {t("sec_ledger")}{" "}
          <span className="fr-muted" style={{ fontSize: 12, fontWeight: 400 }}>
            ({t("filtered_meta", { n: sorted.length, v: fmtCurrency(total) })})
          </span>
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            className="fr-select"
            value={period}
            onChange={(e) => { setPeriod(e.target.value as PeriodKey); setPage(1); }}
            style={{ fontSize: 12, minWidth: 160 }}
            aria-label={t("ledger_period_label")}
          >
            <option value="all">{t("ledger_period_all")}</option>
            <option value="last30">{t("ledger_period_30d")}</option>
            <option value="last90">{t("ledger_period_90d")}</option>
            <option value="year">{t("ledger_period_year")}</option>
          </select>
          <SupplierSelect value={supplier} onChange={setSupplier} suppliers={supplierOptions} />
          <button className="fr-btn fr-print-hide" onClick={downloadCsv} style={{ color: "var(--fr-navy)", borderColor: "var(--fr-navy)" }}>
            {t("exportCsv")}
          </button>
        </div>
      </div>
      <div style={{ maxHeight: 520, overflowY: "auto", border: "1px solid var(--fr-border)", borderRadius: 8 }}>
        <table className="fr-table">
          <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
            <tr>
              <th onClick={() => toggle("date")}>{t("th_date")}{arrow("date")}</th>
              <th onClick={() => toggle("job")}>{t("th_job")}{arrow("job")}</th>
              <th onClick={() => toggle("supplier")}>{t("th_supplier")}{arrow("supplier")}</th>
              <th onClick={() => toggle("type")}>{t("th_type")}{arrow("type")}</th>
              <th onClick={() => toggle("stage")}>{t("th_phase")}{arrow("stage")}</th>
              <th onClick={() => toggle("amount")} style={{ textAlign: "right" }}>{t("th_value")}{arrow("amount")}</th>
              <th onClick={() => toggle("status")}>{t("th_status")}{arrow("status")}</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((it) => {
              const overdueBadge = it.status === "A pagar" && it.dueDate && it.dueDate.getTime() < today;
              const displayStatus = overdueBadge ? "Em atraso" : it.status;
              return (
                <tr key={it.id} className={overdueBadge || it.status === "Em atraso" ? "fr-row-alert" : ""}>
                  <td>
                    {it.date ? fmtDateLocale(it.date, lang) : "—"}
                    {it.future && <span style={{ marginLeft: 4, fontSize: 10, background: "rgba(234,170,0,0.15)", color: "var(--fr-gold)", padding: "1px 4px", borderRadius: 3 }}>{t("future_date")}</span>}
                  </td>
                  <td>{it.job || <span style={{ color: "var(--fr-gold)", fontSize: 11 }}>{t("unassigned")}</span>}</td>
                  <td>{it.supplier}</td>
                  <td>{it.type === "Material" ? t("type_supplier") : it.type === "Subcontractor" ? t("type_subcontractor") : "—"}</td>
                  <td>{it.stage}</td>
                  <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(it.amount)}</td>
                  <td>
                    <span className={
                      displayStatus === "Pago" ? "fr-dot fr-dot-green" :
                      displayStatus === "Em atraso" ? "fr-dot fr-dot-red" : "fr-dot fr-dot-gray"
                    } />
                    {displayStatus === "Pago" ? t("st_paid") : displayStatus === "Em atraso" ? t("st_overdue") : t("st_topay")}
                  </td>
                </tr>
              );
            })}
            {pageItems.length === 0 && (
              <tr><td colSpan={7} className="fr-muted" style={{ textAlign: "center", padding: 24 }}>{t("empty_none")}</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="fr-print-hide flex items-center justify-end gap-3 mt-3" style={{ fontSize: 12 }}>
        <button className="fr-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={clampedPage === 1} style={{ color: "var(--fr-navy)", borderColor: "var(--fr-border)" }}>{t("prev")}</button>
        <span>{t("page")} {clampedPage} {t("of")} {totalPages}</span>
        <button className="fr-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={clampedPage === totalPages} style={{ color: "var(--fr-navy)", borderColor: "var(--fr-border)" }}>{t("next")}</button>
      </div>
    </div>
  );
}
