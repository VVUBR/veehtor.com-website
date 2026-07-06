import { useMemo } from "react";
import { useI18n } from "../lib/i18n";

/** Compact supplier filter. Options are pre-computed unique names. */
export default function SupplierSelect({
  value,
  onChange,
  suppliers,
}: {
  value: string;
  onChange: (v: string) => void;
  suppliers: string[];
}) {
  const { t } = useI18n();
  const options = useMemo(() => {
    const set = new Set<string>();
    for (const s of suppliers) {
      const v = (s || "").trim();
      if (v) set.add(v);
    }
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [suppliers]);

  return (
    <select
      className="fr-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ minWidth: 180, fontSize: 12 }}
      aria-label={t("supplier_filter")}
    >
      <option value="">{t("all_suppliers")}</option>
      {options.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}

export function matchSupplier(rowSupplier: string, rowCanonical: string, filter: string): boolean {
  if (!filter) return true;
  const key = (rowCanonical || rowSupplier || "").trim();
  return key === filter;
}
