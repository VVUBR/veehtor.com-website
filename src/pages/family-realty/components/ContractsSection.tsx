import { useMemo, useState, useEffect } from "react";
import { useI18n, fmtCurrency, fmtDateLocale } from "../lib/i18n";
import type { ContractRow } from "../data";

const PER_PAGE = 10;

export default function ContractsSection({ items, job }: { items: ContractRow[]; job: string }) {
  const { t, lang } = useI18n();
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);


  const rows = useMemo(() => {
    let arr = items;
    if (job !== "__ALL__") arr = arr.filter((c) => c.project === job || (job === "__UNASSIGNED__" && !c.project));
    if (query.trim()) {
      const q = query.toLowerCase();
      arr = arr.filter((c) => c.vendor.toLowerCase().includes(q));
    }
    return arr;
  }, [items, job, query]);

  const totalValue = rows.reduce((s, r) => s + r.totalValue, 0);
  const totalInstallments = rows.reduce((s, r) => s + r.installments.length, 0);
  const totalPages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
  useEffect(() => { setPage(1); }, [job, query]);
  const clampedPage = Math.min(page, totalPages);
  const pageRows = rows.slice((clampedPage - 1) * PER_PAGE, clampedPage * PER_PAGE);


  return (
    <div className="fr-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h3 className="fr-heading" style={{ fontSize: 16, color: "var(--fr-navy)", margin: 0 }}>
          {t("sec_contracts")} <span className="fr-muted" style={{ fontSize: 12, fontWeight: 400 }}>({rows.length} · {totalInstallments} {t("th_installments").toLowerCase()})</span>
        </h3>
        <input
          className="fr-select fr-print-hide"
          placeholder={t("th_supplier")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ minWidth: 200 }}
        />
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        {rows.map((c) => {
          const open = !!expanded[c.id];
          const gapWarn = c.scheduleGap != null && Math.abs(c.scheduleGap) > 1;
      <div style={{ maxHeight: 520, overflowY: "auto", border: "1px solid var(--fr-border)", borderRadius: 8 }}>
        <div style={{ display: "grid", gap: 8, padding: 8 }}>
          {pageRows.map((c) => {
            const open = !!expanded[c.id];
            const gapWarn = c.scheduleGap != null && Math.abs(c.scheduleGap) > 1;
            return (
              <div key={c.id} style={{ border: "1px solid var(--fr-border)", borderRadius: 8, padding: 12 }}>
                <div className="flex flex-wrap items-center gap-3">
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontWeight: 700, color: "var(--fr-navy)", fontSize: 13 }}>
                      {c.vendor}
                      {gapWarn && <span title={`Schedule gap: ${c.scheduleGap}`} style={{ marginLeft: 6, color: "var(--fr-red)" }}>⚠️</span>}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--fr-muted)" }}>
                      {c.project || t("no_project")}{c.contactName ? ` · ${c.contactName}` : ""}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 900, fontFamily: "Roboto", fontSize: 14 }}>{fmtCurrency(c.totalValue)}</div>
                    <div style={{ fontSize: 11, color: "var(--fr-muted)" }}>{fmtDateLocale(c.contractDate, lang)}</div>
                  </div>
                  {c.reviewStatus && (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: "var(--fr-surface)", color: "var(--fr-navy)" }}>
                      {c.reviewStatus}
                    </span>
                  )}
                  {c.documentLink && <a href={c.documentLink} target="_blank" rel="noreferrer">📄</a>}
                  {(c.notes || c.installments.length > 0) && (
                    <button
                      className="fr-btn fr-print-hide"
                      onClick={() => setExpanded((s) => ({ ...s, [c.id]: !s[c.id] }))}
                      style={{ color: "var(--fr-navy)", borderColor: "var(--fr-border)", fontSize: 11, padding: "3px 8px" }}
                    >
                      {open ? t("hide_terms") : t("view_terms")}
                    </button>
                  )}
                </div>

                {open && c.installments.length > 0 && (
                  <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: `repeat(${Math.min(c.installments.length, 5)}, 1fr)`, gap: 6 }}>
                    {c.installments.map((i, idx) => (
                      <div key={idx} style={{ background: "var(--fr-surface)", padding: 8, borderRadius: 6, fontSize: 11 }}>
                        <div style={{ fontWeight: 700, color: "var(--fr-navy)" }}>{i.label}</div>
                        <div style={{ color: "var(--fr-muted)" }}>
                          {i.pct != null ? `${Math.round(i.pct)}%` : ""} {i.amount != null ? fmtCurrency(i.amount) : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {open && c.notes && (
                  <div style={{ marginTop: 8, fontSize: 12, color: "var(--fr-text)", whiteSpace: "pre-wrap", background: "var(--fr-surface)", padding: 8, borderRadius: 6 }}>
                    {c.notes}
                  </div>
                )}
              </div>
            );
          })}
          {rows.length === 0 && <div className="fr-muted" style={{ fontSize: 13, padding: 12 }}>{t("empty_none")}</div>}
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 mt-3" style={{ fontSize: 12 }}>
        <span className="fr-muted">{t("th_total")}: <strong style={{ color: "var(--fr-navy)" }}>{fmtCurrency(totalValue)}</strong></span>
        <div className="fr-print-hide flex items-center gap-3">
          <button className="fr-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={clampedPage === 1} style={{ color: "var(--fr-navy)", borderColor: "var(--fr-border)" }}>{t("prev")}</button>
          <span>{t("page")} {clampedPage} {t("of")} {totalPages}</span>
          <button className="fr-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={clampedPage === totalPages} style={{ color: "var(--fr-navy)", borderColor: "var(--fr-border)" }}>{t("next")}</button>
        </div>
      </div>
    </div>
  );
}
