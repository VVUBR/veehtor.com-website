import { useMemo, useState } from "react";
import { useI18n, fmtCurrency, fmtDateLocale } from "../lib/i18n";
import SupplierSelect, { matchSupplier } from "./SupplierSelect";
import { today0, type PayableDoc } from "../data";

const DAY = 86400000;

export default function PayablesList({ docs, job }: { docs: PayableDoc[]; job: string }) {
  const { t, lang } = useI18n();
  const [supplier, setSupplier] = useState<string>("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const rows = useMemo(() => {
    let scope = docs;
    // Job is scoped upstream, but still support __UNASSIGNED__ meta.
    if (job === "__UNASSIGNED__") scope = scope.filter((d) => !d.job);
    scope = scope.filter((d) => matchSupplier(d.supplier, d.supplierCanonical, supplier));
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
  }, [docs, job, t, supplier]);

  const total = rows.reduce((s, r) => s + r.docTotal, 0);
  const supplierOptions = useMemo(() => docs.map((d) => d.supplierCanonical || d.supplier), [docs]);

  return (
    <div className="fr-card p-5">
      <div className="flex flex-wrap items-center justify-between mb-3 gap-3">
        <h3 className="fr-heading" style={{ fontSize: 16, color: "var(--fr-navy)", margin: 0 }}>
          {t("sec_topay")}{" "}
          <span className="fr-muted" style={{ fontSize: 12, fontWeight: 400 }}>
            ({t("filtered_meta", { n: rows.length, v: fmtCurrency(total) })})
          </span>
        </h3>
        <SupplierSelect value={supplier} onChange={setSupplier} suppliers={supplierOptions} />
      </div>
      <div style={{ maxHeight: 460, overflowY: "auto", border: "1px solid var(--fr-border)", borderRadius: 8 }}>
        <table className="fr-table">
          <thead style={{ position: "sticky", top: 0 }}>
            <tr>
              <th style={{ width: 32 }}></th>
              <th>{t("th_supplier")}</th>
              <th>{t("th_invoice_number")}</th>
              <th>{t("th_job")}</th>
              <th>{t("th_doc")}</th>
              <th>{t("th_due")}</th>
              <th style={{ textAlign: "right" }}>{t("th_value")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const open = !!expanded[r.id];
              const canExpand = r.items.length > 0;
              return (
                <FragmentRow key={r.id}>
                  <tr
                    className={r.overdue ? "fr-row-alert" : ""}
                    style={{ cursor: canExpand ? "pointer" : "default" }}
                    onClick={() => canExpand && setExpanded((s) => ({ ...s, [r.id]: !s[r.id] }))}
                  >
                    <td>{canExpand ? (open ? "▾" : "▸") : ""}</td>
                    <td style={{ fontWeight: 700 }}>{r.supplier}</td>
                    <td style={{ fontSize: 12 }}>
                      {r.invoiceNumber || (
                        <span className="fr-muted" style={{ fontStyle: "italic" }}>{t("no_invoice_number")}</span>
                      )}
                    </td>
                    <td>{r.job || <span style={{ background: "rgba(234,170,0,0.15)", color: "var(--fr-gold)", fontSize: 11, padding: "2px 6px", borderRadius: 3 }}>{t("unassigned")}</span>}</td>
                    <td style={{ fontSize: 12 }}>{r.documentType || "—"}</td>
                    <td>
                      <div style={{ fontSize: 12 }}>{fmtDateLocale(r.dueDate, lang)}</div>
                      <div style={{ fontSize: 11, color: r.overdue ? "var(--fr-red)" : "var(--fr-muted)" }}>{r.dueLabel}</div>
                    </td>
                    <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 700 }}>{fmtCurrency(r.docTotal)}</td>
                  </tr>
                  {open && r.items.map((it) => (
                    <tr key={it.id} style={{ background: "var(--fr-surface)", fontSize: 12 }}>
                      <td></td>
                      <td colSpan={2} style={{ paddingLeft: 24 }}>{it.material}</td>
                      <td style={{ textAlign: "right" }}>{it.quantity != null ? it.quantity : ""}</td>
                      <td style={{ textAlign: "right", color: "var(--fr-muted)" }}>
                        {it.unitPrice != null ? fmtCurrency(it.unitPrice) : ""}
                      </td>
                      <td></td>
                      <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(it.amount)}</td>
                    </tr>
                  ))}
                </FragmentRow>
              );
            })}
            {rows.length === 0 && (
              <tr><td colSpan={7} className="fr-muted" style={{ textAlign: "center", padding: 24 }}>{t("empty_none")}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FragmentRow({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
