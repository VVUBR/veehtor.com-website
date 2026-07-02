import { useMemo } from "react";
import { useI18n, fmtCurrency, fmtDateLocale } from "../lib/i18n";
import { today0, type PayableItem } from "../data";

const DAY = 86400000;

export default function PayablesList({ items, job }: { items: PayableItem[]; job: string }) {
  const { t, lang } = useI18n();

  const rows = useMemo(() => {
    const scope = job === "__ALL__" ? items : items.filter((i) => i.job === job || (job === "__UNASSIGNED__" && !i.job));
    const now = today0().getTime();
    return [...scope].sort((a, b) => {
      if (a.overdue !== b.overdue) return a.overdue ? -1 : 1;
      const ad = a.dueDate?.getTime() ?? Infinity;
      const bd = b.dueDate?.getTime() ?? Infinity;
      return ad - bd;
    }).map((p) => {
      const days = p.dueDate ? Math.floor((p.dueDate.getTime() - now) / DAY) : null;
      let dueLabel: string;
      if (!p.dueDate) dueLabel = t("no_due");
      else if (p.overdue) dueLabel = t("overdue_by", { n: Math.abs(days!) });
      else if (days === 0) dueLabel = t("due_today");
      else dueLabel = t("due_in", { n: days! });
      return { ...p, days, dueLabel };
    });
  }, [items, job, t]);

  const total = rows.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="fr-card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="fr-heading" style={{ fontSize: 16, color: "var(--fr-navy)", margin: 0 }}>
          {t("sec_topay")}
        </h3>
        <div className="fr-muted" style={{ fontSize: 12 }}>
          {rows.length} {t("invoices")} · <strong style={{ color: "var(--fr-navy)" }}>{fmtCurrency(total)}</strong>
        </div>
      </div>
      <div style={{ maxHeight: 420, overflowY: "auto", border: "1px solid var(--fr-border)", borderRadius: 8 }}>
        <table className="fr-table">
          <thead style={{ position: "sticky", top: 0 }}>
            <tr>
              <th>{t("th_supplier")}</th>
              <th>{t("th_job")}</th>
              <th>{t("th_material")}</th>
              <th style={{ textAlign: "right" }}>{t("th_value")}</th>
              <th>{t("th_due")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className={r.overdue ? "fr-row-alert" : ""}>
                <td style={{ fontWeight: 700 }}>{r.supplier}</td>
                <td>{r.job || <span style={{ background: "rgba(234,170,0,0.15)", color: "var(--fr-gold)", fontSize: 11, padding: "2px 6px", borderRadius: 3 }}>{t("unassigned")}</span>}</td>
                <td>{r.material}</td>
                <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(r.amount)}</td>
                <td>
                  <div style={{ fontSize: 12 }}>{fmtDateLocale(r.dueDate, lang)}</div>
                  <div style={{ fontSize: 11, color: r.overdue ? "var(--fr-red)" : "var(--fr-muted)" }}>{r.dueLabel}</div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={6} className="fr-muted" style={{ textAlign: "center", padding: 24 }}>{t("empty_none")}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
