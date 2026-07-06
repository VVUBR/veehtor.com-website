import { useMemo, useState } from "react";
import { useI18n, fmtCurrency } from "../lib/i18n";
import SupplierSelect, { matchSupplier } from "./SupplierSelect";
import type { EstimateBilledRow } from "../data";

function diffColor(diff: number, billed: number) {
  if (billed === 0) return "var(--fr-muted)";
  if (Math.abs(diff) < 1) return "var(--fr-green)";
  if (diff < 0) return "var(--fr-red)"; // billed > estimate
  return "var(--fr-text)";
}

const Badge = ({ label, tone = "muted" }: { label: string; tone?: "muted" | "gold" }) => (
  <span style={{
    display: "inline-block", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
    marginLeft: 6,
    background: tone === "gold" ? "rgba(234,170,0,0.15)" : "rgba(128,128,128,0.15)",
    color: tone === "gold" ? "var(--fr-gold)" : "var(--fr-muted)",
  }}>{label}</span>
);

export default function EstimateVsBilledSection({ items, job }: { items: EstimateBilledRow[]; job: string }) {
  const { t } = useI18n();
  const [supplier, setSupplier] = useState<string>("");

  const scoped = useMemo(() => {
    let arr = job === "__ALL__" ? items : items.filter((r) => r.project === job);
    if (supplier) arr = arr.filter((r) => matchSupplier(r.vendor, r.vendor, supplier));
    return arr;
  }, [items, job, supplier]);

  const rows = useMemo(() => {
    return [...scoped].sort((a, b) => {
      const aMiss = !a.hasProject || !a.hasEstimate;
      const bMiss = !b.hasProject || !b.hasEstimate;
      if (aMiss !== bMiss) return aMiss ? -1 : 1;
      return a.difference - b.difference;
    });
  }, [scoped]);

  const totalBilled = rows.reduce((s, r) => s + r.billed, 0);
  const supplierOptions = useMemo(() => items.map((r) => r.vendor), [items]);

  return (
    <div className="fr-card p-5">
      <div className="flex items-center justify-between mb-1 gap-3 flex-wrap">
        <h3 className="fr-heading" style={{ fontSize: 16, color: "var(--fr-navy)", margin: 0 }}>
          {t("sec_evb")}{" "}
          <span className="fr-muted" style={{ fontSize: 12, fontWeight: 400 }}>
            ({t("filtered_meta", { n: rows.length, v: fmtCurrency(totalBilled) })})
          </span>
        </h3>
        <SupplierSelect value={supplier} onChange={setSupplier} suppliers={supplierOptions} />
      </div>
      <p className="fr-muted" style={{ fontSize: 12, marginBottom: 12 }}>{t("cap_evb")}</p>
      <div style={{ maxHeight: 420, overflowY: "auto", border: "1px solid var(--fr-border)", borderRadius: 8 }}>
        <table className="fr-table">
          <thead style={{ position: "sticky", top: 0 }}>
            <tr>
              <th>{t("th_supplier")}</th>
              <th>{t("th_job")}</th>
              <th style={{ textAlign: "right" }}>{t("th_estimate")}</th>
              <th style={{ textAlign: "right" }}>{t("th_billed")}</th>
              <th style={{ textAlign: "right" }}>{t("th_diff")}</th>
              <th style={{ textAlign: "right" }}>{t("th_pct_billed")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>
                  <div style={{ fontWeight: 700 }}>{r.vendor}</div>
                  <div style={{ fontSize: 11, color: "var(--fr-muted)" }}>
                    {t("n_contracts", { n: r.nContracts || 1 })}
                  </div>
                </td>
                <td>
                  {r.hasProject ? r.project : <Badge label={t("badge_no_project")} tone="gold" />}
                </td>
                <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                  {r.hasEstimate ? fmtCurrency(r.estimate) : <Badge label={t("badge_no_estimate")} />}
                </td>
                <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(r.billed)}</td>
                <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", color: diffColor(r.difference, r.billed), fontWeight: 700 }}>
                  {r.hasEstimate ? fmtCurrency(r.difference) : "—"}
                </td>
                <td style={{ textAlign: "right" }}>{r.hasEstimate && r.estimate > 0 ? `${Math.round(r.pctBilled)}%` : "—"}</td>
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
