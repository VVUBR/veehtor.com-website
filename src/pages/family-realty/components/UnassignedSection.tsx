import { useMemo, useState } from "react";
import { useI18n, fmtCurrency, fmtDateLocale } from "../lib/i18n";
import SupplierSelect, { matchSupplier } from "./SupplierSelect";
import type { UnassignedItem } from "../data";

const Chip = ({ label }: { label: string }) => (
  <span style={{
    display: "inline-block", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
    marginRight: 4, marginBottom: 2,
    background: "rgba(234,170,0,0.15)", color: "var(--fr-gold)",
  }}>{label}</span>
);

export default function UnassignedSection({ items }: { items: UnassignedItem[] }) {
  const { t, lang } = useI18n();
  const [supplier, setSupplier] = useState<string>("");

  const rows = useMemo(
    () => items.filter((i) => matchSupplier(i.supplier, i.supplierCanonical, supplier)),
    [items, supplier],
  );
  const total = rows.reduce((s, i) => s + i.amount, 0);
  const supplierOptions = useMemo(() => items.map((i) => i.supplierCanonical || i.supplier), [items]);

  return (
    <div className="fr-card p-5">
      <div className="flex items-center justify-between mb-1 gap-3 flex-wrap">
        <h3 className="fr-heading" style={{ fontSize: 16, color: "var(--fr-navy)", margin: 0 }}>
          {t("sec_unassigned")}{" "}
          <span className="fr-muted" style={{ fontSize: 12, fontWeight: 400 }}>
            ({t("filtered_meta", { n: rows.length, v: fmtCurrency(total) })})
          </span>
        </h3>
        <SupplierSelect value={supplier} onChange={setSupplier} suppliers={supplierOptions} />
      </div>
      <p className="fr-muted" style={{ fontSize: 12, marginBottom: 12 }}>{t("cap_unassigned")}</p>
      <div style={{ maxHeight: 420, overflowY: "auto", border: "1px solid var(--fr-border)", borderRadius: 8 }}>
        <table className="fr-table">
          <thead style={{ position: "sticky", top: 0 }}>
            <tr>
              <th>{t("th_date")}</th>
              <th>{t("th_supplier")}</th>
              <th>{t("th_material")}</th>
              <th style={{ textAlign: "right" }}>{t("th_value")}</th>
              <th>Faltando</th>
              <th>{t("th_suggestion")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((i) => (
              <tr key={i.id}>
                <td>{fmtDateLocale(i.date, lang)}</td>
                <td>{i.supplier}</td>
                <td>{i.material}</td>
                <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(i.amount)}</td>
                <td style={{ fontSize: 12 }}>
                  {i.missingProject && <Chip label={t("chip_missing_project")} />}
                  {i.missingPhase && <Chip label={t("chip_missing_phase")} />}
                  {i.missingDescription && <Chip label={t("chip_missing_description")} />}
                </td>
                <td style={{ fontSize: 12, color: "var(--fr-gold)", fontWeight: 700 }}>{i.suggestion || ""}</td>
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
