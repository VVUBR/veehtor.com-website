import { Fragment, useMemo, useState } from "react";
import { useI18n, fmtCurrency, fmtDateLocale } from "../lib/i18n";
import SupplierSelect, { matchSupplier } from "./SupplierSelect";
import type { EstimateBilledRow, InvoicePaidRow, PaymentRow } from "../data";

function diffColor(diff: number, billed: number) {
  if (billed === 0) return "var(--fr-muted)";
  if (Math.abs(diff) < 1) return "var(--fr-green)";
  if (diff < 0) return "var(--fr-red)"; // billed > estimate
  return "var(--fr-text)";
}

const Badge = ({ label, tone = "muted", title }: { label: string; tone?: "muted" | "gold" | "green" | "red"; title?: string }) => {
  const toneMap: Record<string, { bg: string; fg: string }> = {
    muted: { bg: "rgba(128,128,128,0.15)", fg: "var(--fr-muted)" },
    gold: { bg: "rgba(234,170,0,0.15)", fg: "var(--fr-gold)" },
    green: { bg: "rgba(34,150,90,0.15)", fg: "var(--fr-green)" },
    red: { bg: "rgba(220,50,50,0.15)", fg: "var(--fr-red)" },
  };
  const s = toneMap[tone];
  return (
    <span title={title} style={{
      display: "inline-block", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
      marginLeft: 6, background: s.bg, color: s.fg,
    }}>{label}</span>
  );
};

function situacaoTone(s: string): "green" | "gold" | "muted" {
  const v = s.toLowerCase();
  if (v === "paga") return "green";
  if (v.startsWith("parcial") || v.startsWith("paga (marcar")) return "gold";
  return "muted";
}

export default function EstimateVsBilledSection({
  items, job, allowedProjects, invoicePaidBySub, paymentsBySub,
}: {
  items: EstimateBilledRow[];
  job: string;
  allowedProjects: Set<string> | null;
  invoicePaidBySub: Map<string, InvoicePaidRow[]>;
  paymentsBySub: Map<string, PaymentRow[]>;
}) {
  const { t, lang } = useI18n();
  const [supplier, setSupplier] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "all">("active");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  type SortKey = "estimate" | "billed" | "paid" | "openAmount" | "difference" | "pctBilled";
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "openAmount", dir: "desc" });

  const scoped = useMemo(() => {
    let arr = job === "__ALL__" ? items : items.filter((r) => r.project === job);
    if (allowedProjects) arr = arr.filter((r) => !r.project || allowedProjects.has(r.project));
    if (supplier) arr = arr.filter((r) => matchSupplier(r.vendor, r.vendor, supplier));
    if (statusFilter !== "all") {
      arr = arr.filter((r) => (statusFilter === "active" ? r.status === "Ativo" : r.status !== "Ativo"));
    }
    return arr;
  }, [items, job, supplier, statusFilter, allowedProjects]);

  const rows = useMemo(() => {
    const dir = sort.dir === "asc" ? 1 : -1;
    const getVal = (r: EstimateBilledRow): number => {
      if (sort.key === "estimate") return r.hasEstimate ? r.estimate : -Infinity;
      return r[sort.key] as number;
    };
    return [...scoped].sort((a, b) => (getVal(a) - getVal(b)) * dir);
  }, [scoped, sort]);

  const totalBilled = rows.reduce((s, r) => s + r.billed, 0);
  const supplierOptions = useMemo(() => items.map((r) => r.vendor), [items]);

  const toggle = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const onSort = (key: SortKey) => {
    setSort((prev) => prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" });
  };
  const sortIndicator = (key: SortKey) => sort.key === key ? (sort.dir === "asc" ? " ▲" : " ▼") : "";
  const sortableTh = (key: SortKey, label: string) => (
    <th
      style={{ textAlign: "right", cursor: "pointer", userSelect: "none" }}
      onClick={() => onSort(key)}
    >
      {label}{sortIndicator(key)}
    </th>
  );

  return (
    <div className="fr-card p-5">
      <div className="flex items-center justify-between mb-1 gap-3 flex-wrap">
        <h3 className="fr-heading" style={{ fontSize: 16, color: "var(--fr-navy)", margin: 0 }}>
          {t("sec_evb")}{" "}
          <span className="fr-muted" style={{ fontSize: 12, fontWeight: 400 }}>
            ({t("filtered_meta", { n: rows.length, v: fmtCurrency(totalBilled) })})
          </span>
        </h3>
        <div className="flex items-center gap-2">
          <select
            className="fr-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "active" | "inactive" | "all")}
            style={{ fontSize: 12, minWidth: 130 }}
            aria-label={t("contract_status_filter")}
          >
            <option value="active">{t("contract_status_active")}</option>
            <option value="inactive">{t("contract_status_inactive")}</option>
            <option value="all">{t("contract_status_all")}</option>
          </select>
          <SupplierSelect value={supplier} onChange={setSupplier} suppliers={supplierOptions} />
        </div>
      </div>
      <p className="fr-muted" style={{ fontSize: 12, marginBottom: 12 }}>{t("cap_evb")}</p>
      <div style={{ maxHeight: 460, overflowY: "auto", border: "1px solid var(--fr-border)", borderRadius: 8 }}>
        <table className="fr-table">
          <thead style={{ position: "sticky", top: 0 }}>
            <tr>
              <th style={{ width: 28 }}></th>
              <th>{t("th_supplier")}</th>
              <th>{t("th_job")}</th>
              {sortableTh("estimate", t("th_estimate"))}
              {sortableTh("billed", t("th_billed"))}
              {sortableTh("paid", t("th_paid"))}
              {sortableTh("openAmount", t("th_open"))}
              {sortableTh("difference", t("th_diff"))}
              {sortableTh("pctBilled", t("th_pct_billed"))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const key = `${r.vendor}::${r.project}::${i}`;
              const isOpen = expanded.has(key);
              const invoices = (invoicePaidBySub.get(r.vendor) || []);
              const payments = (paymentsBySub.get(r.vendor) || []).filter(
                (p) => !r.hasProject || !p.projectName || p.projectName === r.project,
              );
              const paidByStatus = invoices.filter((iv) => iv.situacao.toLowerCase() === "paga");
              const paymentsWithInv = payments.filter((p) => p.invoiceNumber);
              const paymentsNoInv = payments.filter((p) => !p.invoiceNumber);
              const unlinkedSum = paymentsNoInv.reduce((s, p) => s + p.amount, 0);

              return (
                <Fragment key={key}>
                  <tr
                    onClick={() => toggle(key)}
                    style={{ cursor: "pointer" }}
                  >
                    <td style={{ color: "var(--fr-muted)", fontSize: 11 }}>{isOpen ? "▾" : "▸"}</td>
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
                    <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(r.paid)}</td>
                    <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", color: "var(--fr-muted)" }}>
                      {fmtCurrency(r.openAmount)}
                    </td>
                    <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", color: diffColor(r.difference, r.billed), fontWeight: 700 }}>
                      {r.hasEstimate ? fmtCurrency(r.difference) : "—"}
                    </td>
                    <td style={{ textAlign: "right" }}>{r.hasEstimate && r.estimate > 0 ? `${Math.round(r.pctBilled)}%` : "—"}</td>
                  </tr>
                  {isOpen && (
                    <tr>
                      <td colSpan={9} style={{ background: "rgba(0,0,0,0.02)", padding: 12 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                          {/* Faturas */}
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 6, color: "var(--fr-navy)" }}>
                              {t("evb_faturas")}
                            </div>
                            {invoices.length === 0 && (
                              <div className="fr-muted" style={{ fontSize: 12 }}>{t("empty_none")}</div>
                            )}
                            {invoices.map((iv, idx) => {
                              const tone = situacaoTone(iv.situacao);
                              const missing = Math.max(iv.docTotal - iv.pagoManual, 0);
                              const isParcial = iv.situacao.toLowerCase().startsWith("parcial");
                              const isMarcar = iv.situacao.toLowerCase().startsWith("paga (marcar");
                              return (
                                <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "3px 0", borderBottom: "1px solid var(--fr-border)" }}>
                                  <span>{iv.invoiceNumber || <span className="fr-muted">{t("no_invoice_number")}</span>}</span>
                                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{ fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(iv.docTotal)}</span>
                                    <Badge
                                      label={iv.situacao}
                                      tone={tone}
                                      title={isMarcar ? t("evb_marcar_status_tip") : undefined}
                                    />
                                    {isParcial && (
                                      <span className="fr-muted" style={{ fontSize: 11 }}>
                                        ({t("evb_faltam", { v: fmtCurrency(missing) })})
                                      </span>
                                    )}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Pagamentos */}
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 6, color: "var(--fr-navy)" }}>
                              {t("evb_pagamentos")}
                            </div>
                            {paidByStatus.length === 0 && payments.length === 0 && (
                              <div className="fr-muted" style={{ fontSize: 12 }}>{t("empty_none")}</div>
                            )}
                            {paidByStatus.map((iv, idx) => (
                              <div key={`s${idx}`} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "3px 0", borderBottom: "1px solid var(--fr-border)" }}>
                                <span>
                                  {iv.invoiceNumber || <span className="fr-muted">{t("no_invoice_number")}</span>}
                                  <Badge label={t("evb_recibo_auto")} tone="muted" />
                                </span>
                                <span style={{ fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(iv.docTotal)}</span>
                              </div>
                            ))}
                            {paymentsWithInv.map((p) => (
                              <div key={p.paymentId} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "3px 0", borderBottom: "1px solid var(--fr-border)" }}>
                                <span>
                                  {p.invoiceNumber}
                                  <Badge label={t("evb_pag_manual")} tone="muted" />
                                  <span className="fr-muted" style={{ marginLeft: 6 }}>
                                    {fmtDateLocale(p.paymentDate, lang)}{p.paymentMethod ? ` · ${p.paymentMethod}` : ""}
                                  </span>
                                </span>
                                <span style={{ fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(p.amount)}</span>
                              </div>
                            ))}
                            {paymentsNoInv.map((p) => (
                              <div key={p.paymentId} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "3px 0", borderBottom: "1px solid var(--fr-border)" }}>
                                <span>
                                  <Badge label={t("evb_pag_manual_sf")} tone="gold" />
                                  <span className="fr-muted" style={{ marginLeft: 6 }}>
                                    {fmtDateLocale(p.paymentDate, lang)}{p.paymentMethod ? ` · ${p.paymentMethod}` : ""}
                                  </span>
                                </span>
                                <span style={{ fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(p.amount)}</span>
                              </div>
                            ))}
                            <div style={{ marginTop: 6, fontSize: 12, fontWeight: 700, display: "flex", justifyContent: "space-between" }}>
                              <span>{t("evb_pago_total")}</span>
                              <span style={{ fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(r.paid)}</span>
                            </div>
                            {unlinkedSum > 0 && (
                              <div className="fr-muted" style={{ fontSize: 11, marginTop: 4 }}>
                                {t("evb_unlinked_note", { v: fmtCurrency(unlinkedSum) })}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {rows.length === 0 && (
              <tr><td colSpan={9} className="fr-muted" style={{ textAlign: "center", padding: 24 }}>{t("empty_none")}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
