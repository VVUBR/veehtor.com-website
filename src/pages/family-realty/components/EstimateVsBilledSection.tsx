import { useMemo } from "react";
import { useI18n, fmtCurrency } from "../lib/i18n";
import type { EstimateBilledRow } from "../data";

function diffColor(diff: number, billed: number) {
  if (billed === 0) return "var(--fr-muted)";
  if (Math.abs(diff) < 1) return "var(--fr-green)";
  if (diff < 0) return "var(--fr-red)"; // billed > estimate
  return "var(--fr-text)";
}

export default function EstimateVsBilledSection({ items, job }: { items: EstimateBilledRow[]; job: string }) {
  const { t } = useI18n();
  const rows = useMemo(() => {
    const arr = job === "__ALL__" ? items : items.filter((r) => r.project === job);
    return [...arr].sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference));
  }, [items, job]);

  return (
    <div className="fr-card p-5">
      <h3 className="fr-heading" style={{ fontSize: 16, color: "var(--fr-navy)", margin: 0, marginBottom: 4 }}>
        {t("sec_evb")}
      </h3>
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
                <td style={{ fontWeight: 700 }}>{r.vendor}</td>
                <td>{r.project || "—"}</td>
                <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(r.estimate)}</td>
                <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(r.billed)}</td>
                <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", color: diffColor(r.difference, r.billed), fontWeight: 700 }}>
                  {fmtCurrency(r.difference)}
                </td>
                <td style={{ textAlign: "right" }}>{Math.round(r.pctBilled)}%</td>
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
