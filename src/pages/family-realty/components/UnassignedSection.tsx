import { useI18n, fmtCurrency, fmtDateLocale } from "../lib/i18n";
import type { UnassignedItem } from "../data";

export default function UnassignedSection({ items }: { items: UnassignedItem[] }) {
  const { t, lang } = useI18n();
  const total = items.reduce((s, i) => s + i.amount, 0);
  return (
    <div className="fr-card p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="fr-heading" style={{ fontSize: 16, color: "var(--fr-navy)", margin: 0 }}>
          {t("sec_unassigned")} <span className="fr-muted" style={{ fontSize: 12, fontWeight: 400 }}>({items.length} · {fmtCurrency(total)})</span>
        </h3>
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
              <th>{t("th_doc")}</th>
              <th>{t("th_suggestion")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id}>
                <td>{fmtDateLocale(i.date, lang)}</td>
                <td>{i.supplier}</td>
                <td>{i.material}</td>
                <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(i.amount)}</td>
                <td style={{ fontSize: 12 }}>{i.documentType}</td>
                <td style={{ fontSize: 12, color: "var(--fr-gold)", fontWeight: 700 }}>{i.suggestion || ""}</td>
                <td>{i.fileLink && <a href={i.fileLink} target="_blank" rel="noreferrer">📄</a>}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={7} className="fr-muted" style={{ textAlign: "center", padding: 24 }}>{t("empty_none")}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
