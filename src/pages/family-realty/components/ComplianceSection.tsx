import { Fragment, useMemo, useState } from "react";
import { useI18n, fmtDateLocale, fmtCurrency } from "../lib/i18n";
import {
  complianceSeverityBucket,
  complianceStatusTone,
  type SubComplianceRow,
  type InsuranceRow,
  type W9Row,
} from "../data";

type Props = {
  rows: SubComplianceRow[];
  insuranceBySub: Map<string, InsuranceRow[]>;
  w9BySub: Map<string, W9Row[]>;
  job: string; // "__ALL__" | "__UNASSIGNED__" | project name
  allowedProjects: Set<string> | null;
};

const TONE_STYLE: Record<string, { bg: string; fg: string; border: string }> = {
  red: { bg: "#fdecec", fg: "#b70200", border: "#f4c7c5" },
  amber: { bg: "#fff5db", fg: "#8a5a00", border: "#f3dfa5" },
  green: { bg: "#e6f4ec", fg: "#2e7d52", border: "#c6e2d1" },
  muted: { bg: "#eef0f4", fg: "#808080", border: "#e3e6ec" },
};

function fmtYesNo(v: string | null | undefined, lang: string): string {
  const s = (v || "").trim().toUpperCase();
  if (!s) return "—";
  if (["Y", "YES", "SIM", "S", "TRUE", "1"].includes(s)) return lang === "pt" ? "Sim" : "Yes";
  if (["N", "NO", "NAO", "NÃO", "FALSE", "0"].includes(s)) return lang === "pt" ? "Não" : "No";
  return v as string;
}

function StatusBadge({
  status,
  link,
  dim,
}: {
  status: string;
  link: string | null;
  dim?: boolean;
}) {
  const tone = complianceStatusTone(status);
  const s = TONE_STYLE[tone];
  const label = (status || "—").toUpperCase();
  const style: React.CSSProperties = {
    display: "inline-block",
    padding: "2px 8px",
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 999,
    background: s.bg,
    color: s.fg,
    border: `1px solid ${s.border}`,
    opacity: dim ? 0.55 : 1,
    textDecoration: "none",
    whiteSpace: "nowrap",
  };
  if (link) {
    return (
      <a href={link} target="_blank" rel="noreferrer" style={style} title={link}>
        {label}
      </a>
    );
  }
  return <span style={style}>{label}</span>;
}

function KpiChip({
  label,
  count,
  tone,
}: {
  label: string;
  count: number;
  tone: "red" | "amber" | "green";
}) {
  const s = TONE_STYLE[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 999,
        background: s.bg,
        color: s.fg,
        border: `1px solid ${s.border}`,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      <strong style={{ fontFamily: "Roboto", fontSize: 14 }}>{count}</strong>
      <span>{label}</span>
    </span>
  );
}

function InsuranceCard({
  title,
  row,
  wcKindTag,
}: {
  title: string;
  row: InsuranceRow | null;
  wcKindTag?: string | null;
}) {
  const { t, lang } = useI18n();
  return (
    <div
      style={{
        border: "1px solid var(--fr-border)",
        borderRadius: 8,
        padding: 10,
        background: "var(--fr-bg)",
        fontSize: 12,
      }}
    >
      <div style={{ fontWeight: 700, color: "var(--fr-navy)", marginBottom: 6, fontSize: 12 }}>
        {title}
        {wcKindTag && (
          <span
            title={t("compliance_isencao_tooltip")}
            style={{
              marginLeft: 6,
              fontSize: 10,
              fontWeight: 700,
              padding: "1px 6px",
              borderRadius: 4,
              background: TONE_STYLE.amber.bg,
              color: TONE_STYLE.amber.fg,
              border: `1px solid ${TONE_STYLE.amber.border}`,
            }}
          >
            {wcKindTag}
          </span>
        )}
      </div>
      {!row ? (
        <div className="fr-muted" style={{ fontSize: 11 }}>
          {t("compliance_no_vigente")}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 12px" }}>
          <Field label={t("ins_policy_type")} v={row.policyType || "—"} />
          <Field label={t("ins_insurer")} v={row.insurer || "—"} />
          <Field label={t("ins_policy_number")} v={row.policyNumber || "—"} />
          <Field label={t("ins_effective")} v={fmtDateLocale(row.effectiveDate, lang)} />
          <Field label={t("ins_expiration")} v={fmtDateLocale(row.expirationDate, lang)} />
          <Field
            label={t("ins_limit_occ")}
            v={row.limitOccurrence != null ? fmtCurrency(row.limitOccurrence) : "—"}
          />
          <Field
            label={t("ins_limit_agg")}
            v={row.limitAggregate != null ? fmtCurrency(row.limitAggregate) : "—"}
          />
          <Field label={t("ins_additional_insured")} v={fmtYesNo(row.additionalInsured, lang)} />
          <Field label={t("ins_cert_holder_ok")} v={fmtYesNo(row.certificateHolderOk, lang)} />

          {(row.certificateHolderOk || "").toUpperCase() === "NAO" && (
            <div
              style={{
                gridColumn: "1 / -1",
                color: "var(--fr-red)",
                fontSize: 11,
                fontWeight: 700,
                marginTop: 2,
              }}
            >
              {t("compliance_cert_holder_warn")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function W9Card({ title, row }: { title: string; row: W9Row | null }) {
  const { t, lang } = useI18n();
  return (
    <div
      style={{
        border: "1px solid var(--fr-border)",
        borderRadius: 8,
        padding: 10,
        background: "var(--fr-bg)",
        fontSize: 12,
      }}
    >
      <div style={{ fontWeight: 700, color: "var(--fr-navy)", marginBottom: 6, fontSize: 12 }}>
        {title}
      </div>
      {!row ? (
        <div className="fr-muted" style={{ fontSize: 11 }}>
          {t("compliance_no_vigente")}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 12px" }}>
          <Field label={t("w9_signature")} v={fmtDateLocale(row.signatureDate, lang)} />
          <Field label={t("w9_revision")} v={row.w9Revision || "—"} />
          <Field label={t("w9_tax_class")} v={row.taxClassification || "—"} />
          <Field label={t("w9_review_due")} v={fmtDateLocale(row.reviewDue, lang)} />
        </div>
      )}
    </div>
  );
}

function Field({ label, v }: { label: string; v: string }) {
  return (
    <div>
      <div className="fr-muted" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </div>
      <div style={{ color: "var(--fr-text)", fontSize: 12 }}>{v}</div>
    </div>
  );
}

export default function ComplianceSection({ rows, insuranceBySub, w9BySub, job, allowedProjects }: Props) {
  const { t, lang } = useI18n();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "critical" | "attention" | "ok">("");
  const [recentOnly, setRecentOnly] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [historyOpen, setHistoryOpen] = useState<Record<string, boolean>>({});

  // Scope by global job selector + project-status filter. Subcontractors with no active projects
  // are always kept (unassigned rows must never be hidden by the status filter).
  const jobScoped = useMemo(() => {
    let arr = rows;
    if (allowedProjects) {
      arr = arr.filter((r) =>
        r.activeProjects.length === 0 || r.activeProjects.some((p) => allowedProjects.has(p))
      );
    }
    if (job === "__ALL__") return arr;
    if (job === "__UNASSIGNED__") return arr.filter((r) => r.activeProjects.length === 0);
    return arr.filter((r) => r.activeProjects.includes(job));
  }, [rows, job, allowedProjects]);

  const counts = useMemo(() => {
    let critical = 0, attention = 0, ok = 0;
    for (const r of jobScoped) {
      const b = complianceSeverityBucket(r.severity);
      if (b === "critical") critical++;
      else if (b === "attention") attention++;
      else ok++;
    }
    return { critical, attention, ok };
  }, [jobScoped]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let arr = jobScoped;
    if (q) arr = arr.filter((r) => r.subcontractor.toLowerCase().includes(q));
    if (statusFilter) arr = arr.filter((r) => complianceSeverityBucket(r.severity) === statusFilter);
    if (recentOnly) arr = arr.filter((r) => r.hasRecentInvoice);
    return [...arr].sort((a, b) => {
      if (b.severity !== a.severity) return b.severity - a.severity;
      return a.subcontractor.localeCompare(b.subcontractor);
    });
  }, [jobScoped, search, statusFilter, recentOnly]);

  return (
    <div className="fr-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
        <div>
          <h3 className="fr-heading" style={{ fontSize: 16, color: "var(--fr-navy)", margin: 0 }}>
            {t("sec_compliance")}{" "}
            <span className="fr-muted" style={{ fontSize: 12, fontWeight: 400 }}>
              · {t("compliance_n_subs", { n: jobScoped.length })}
            </span>
          </h3>
          <div className="fr-muted" style={{ fontSize: 12, marginTop: 2 }}>
            {t("compliance_subtitle")}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <KpiChip label={t("compliance_critical")} count={counts.critical} tone="red" />
          <KpiChip label={t("compliance_attention")} count={counts.attention} tone="amber" />
          <KpiChip label={t("compliance_ok")} count={counts.ok} tone="green" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3 fr-print-hide">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("compliance_search")}
          className="fr-select"
          style={{ minWidth: 220, fontSize: 12 }}
        />
        <select
          className="fr-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          style={{ fontSize: 12 }}
        >
          <option value="">{t("compliance_status_all")}</option>
          <option value="critical">{t("compliance_critical")}</option>
          <option value="attention">{t("compliance_attention")}</option>
          <option value="ok">{t("compliance_ok")}</option>
        </select>
        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: "var(--fr-text)",
          }}
        >
          <input
            type="checkbox"
            checked={recentOnly}
            onChange={(e) => setRecentOnly(e.target.checked)}
          />
          {t("compliance_recent_only")}
        </label>
        <span className="fr-muted" style={{ fontSize: 11, marginLeft: "auto" }}>
          {t("compliance_filtered_of", { n: filtered.length, total: jobScoped.length })}
        </span>
      </div>

      <div style={{ maxHeight: 520, overflowY: "auto", border: "1px solid var(--fr-border)", borderRadius: 8 }}>
        <table className="fr-table" style={{ fontSize: 12 }}>
          <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>

            <tr>
              <th style={{ cursor: "default" }}>Subcontractor</th>
              <th style={{ cursor: "default" }}>{t("compliance_active_projects")}</th>
              <th style={{ cursor: "default" }}>{t("compliance_w9")}</th>
              <th style={{ cursor: "default" }}>{t("compliance_gl")}</th>
              <th style={{ cursor: "default" }}>{t("compliance_wc")}</th>
              <th style={{ cursor: "default" }}>{t("compliance_last_invoice")}</th>
              <th style={{ cursor: "default", textAlign: "center" }}>{t("compliance_contract")}</th>
              <th style={{ cursor: "default", width: 32 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const key = r.subcontractorCanonical || r.subcontractor;
              const isOpen = !!expanded[key];
              const insAll =
                insuranceBySub.get(r.subcontractorCanonical) ||
                insuranceBySub.get(r.subcontractor) ||
                [];
              const w9All =
                w9BySub.get(r.subcontractorCanonical) ||
                w9BySub.get(r.subcontractor) ||
                [];

              // Pick the most recent GL / WC row from the tables when available;
              // otherwise fall back to a synthesized row from v_sub_compliance so
              // the Vigente cards always reflect what the main-row badges show.
              const glFromTable =
                (r.glPolicyKey && insAll.find((x) => x.policyKey === r.glPolicyKey)) ||
                insAll.find((x) => /general/i.test(x.policyType)) ||
                null;
              const wcFromTable =
                (r.wcPolicyKey && insAll.find((x) => x.policyKey === r.wcPolicyKey)) ||
                insAll.find((x) => /workers|exemption|isen/i.test(x.policyType)) ||
                null;
              const w9FromTable =
                (r.w9DocId && w9All.find((x) => x.docId === r.w9DocId)) ||
                w9All[0] ||
                null;

              const glVigente: InsuranceRow | null =
                glFromTable ||
                (r.glExpiration || r.glFileLink
                  ? {
                      policyKey: "view:gl",
                      subcontractorCanonical: r.subcontractorCanonical,
                      policyType: "General Liability",
                      insurer: null,
                      policyNumber: null,
                      effectiveDate: null,
                      expirationDate: r.glExpiration,
                      limitOccurrence: null,
                      limitAggregate: null,
                      additionalInsured: null,
                      certificateHolderOk: null,
                      kind: null,
                    }
                  : null);
              const wcVigente: InsuranceRow | null =
                wcFromTable ||
                (r.wcExpiration || r.wcFileLink
                  ? {
                      policyKey: "view:wc",
                      subcontractorCanonical: r.subcontractorCanonical,
                      policyType: "Workers Comp",
                      insurer: null,
                      policyNumber: null,
                      effectiveDate: null,
                      expirationDate: r.wcExpiration,
                      limitOccurrence: null,
                      limitAggregate: null,
                      additionalInsured: null,
                      certificateHolderOk: null,
                      kind: r.wcKind,
                    }
                  : null);
              const w9Vigente: W9Row | null =
                w9FromTable ||
                (r.w9SignatureDate || r.w9FileLink
                  ? {
                      docId: "view:w9",
                      subcontractorCanonical: r.subcontractorCanonical,
                      signatureDate: r.w9SignatureDate,
                      w9Revision: null,
                      taxClassification: null,
                      reviewDue: r.w9ReviewDue,
                    }
                  : null);

              const vigenteKeys = new Set<string>(
                [glVigente?.policyKey, wcVigente?.policyKey].filter(Boolean) as string[],
              );
              const vigenteW9Ids = new Set<string>(
                [w9Vigente?.docId].filter(Boolean) as string[],
              );
              const historyIns = insAll.filter((x) => !vigenteKeys.has(x.policyKey));
              const historyW9 = w9All.filter((x) => !vigenteW9Ids.has(x.docId));
              const historyCount = historyIns.length + historyW9.length;
              const wcIsencao =
                (r.wcKind || "").toLowerCase() === "isencao fl" ||
                (r.wcKind || "").toLowerCase() === "isenção fl";
              const projectsText = r.activeProjects.length
                ? r.activeProjects.join(", ")
                : "—";
              const historyKey = key + "::hist";
              const isHistOpen = !!historyOpen[historyKey];
              return (
                <Fragment key={key}>
                  <tr key={key}>
                    <td style={{ fontWeight: 700, color: "var(--fr-navy)" }}>{r.subcontractor}</td>
                    <td style={{ fontSize: 11 }}>{projectsText}</td>
                    <td>
                      <StatusBadge status={r.w9Status} link={r.w9FileLink} />
                    </td>
                    <td>
                      <StatusBadge status={r.glStatus} link={r.glFileLink} />
                    </td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <StatusBadge status={r.wcStatus} link={r.wcFileLink} />
                        {wcIsencao && (
                          <span
                            title={t("compliance_isencao_tooltip")}
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              padding: "1px 6px",
                              borderRadius: 4,
                              background: TONE_STYLE.amber.bg,
                              color: TONE_STYLE.amber.fg,
                              border: `1px solid ${TONE_STYLE.amber.border}`,
                            }}
                          >
                            {t("compliance_isencao_tag")}
                          </span>
                        )}
                      </span>
                    </td>
                    <td
                      style={{
                        color: r.hasRecentInvoice ? "var(--fr-text)" : "var(--fr-muted)",
                        opacity: r.hasRecentInvoice ? 1 : 0.7,
                      }}
                    >
                      {fmtDateLocale(r.lastInvoiceDate, lang)}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {r.hasContract ? (
                        <span style={{ color: "var(--fr-green)", fontWeight: 700 }}>✓</span>
                      ) : (
                        <span className="fr-muted">—</span>
                      )}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="fr-btn fr-print-hide"
                        onClick={() =>
                          setExpanded((s) => ({ ...s, [key]: !s[key] }))
                        }
                        style={{
                          color: "var(--fr-navy)",
                          borderColor: "var(--fr-border)",
                          fontSize: 11,
                          padding: "2px 6px",
                        }}
                        aria-label={isOpen ? "collapse" : "expand"}
                      >
                        {isOpen ? "▾" : "▸"}
                      </button>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr>
                      <td colSpan={8} style={{ background: "var(--fr-surface)" }}>
                        <div style={{ padding: 8 }}>
                          <div
                            style={{
                              fontSize: 11,
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                              color: "var(--fr-navy)",
                              fontWeight: 700,
                              marginBottom: 6,
                            }}
                          >
                            {t("compliance_vigente")}
                          </div>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                              gap: 8,
                            }}
                          >
                            <W9Card title={t("compliance_w9")} row={w9Vigente} />
                            <InsuranceCard title={t("compliance_gl")} row={glVigente} />
                            <InsuranceCard
                              title={t("compliance_wc")}
                              row={wcVigente}
                              wcKindTag={wcIsencao ? t("compliance_isencao_tag") : null}
                            />
                          </div>

                          {historyCount > 0 && (
                            <div style={{ marginTop: 10 }}>
                              <button
                                className="fr-btn fr-print-hide"
                                onClick={() =>
                                  setHistoryOpen((s) => ({
                                    ...s,
                                    [historyKey]: !s[historyKey],
                                  }))
                                }
                                style={{
                                  color: "var(--fr-navy)",
                                  borderColor: "var(--fr-border)",
                                  fontSize: 11,
                                  padding: "3px 8px",
                                }}
                              >
                                {isHistOpen ? "▾ " : "▸ "}
                                {t("compliance_history_toggle", { n: historyCount })}
                              </button>
                              {isHistOpen && (
                                <div
                                  style={{
                                    marginTop: 8,
                                    display: "grid",
                                    gap: 4,
                                    fontSize: 11,
                                    opacity: 0.75,
                                  }}
                                >
                                  {historyIns.map((x) => (
                                    <div
                                      key={"i-" + x.policyKey}
                                      style={{
                                        display: "flex",
                                        gap: 8,
                                        padding: "4px 8px",
                                        background: "var(--fr-bg)",
                                        border: "1px solid var(--fr-border)",
                                        borderRadius: 6,
                                        color: "var(--fr-muted)",
                                      }}
                                    >
                                      <span style={{ fontWeight: 700 }}>
                                        {x.policyType || "—"}
                                      </span>
                                      <span>{x.insurer || "—"}</span>
                                      <span>{x.policyNumber || "—"}</span>
                                      <span style={{ marginLeft: "auto" }}>
                                        {fmtDateLocale(x.expirationDate, lang)}
                                      </span>
                                      <span
                                        style={{
                                          fontSize: 9,
                                          fontWeight: 700,
                                          padding: "1px 6px",
                                          borderRadius: 4,
                                          background: "var(--fr-surface)",
                                          border: "1px solid var(--fr-border)",
                                          textTransform: "uppercase",
                                        }}
                                      >
                                        {t("compliance_replaced")}
                                      </span>
                                    </div>
                                  ))}
                                  {historyW9.map((x) => (
                                    <div
                                      key={"w-" + x.docId}
                                      style={{
                                        display: "flex",
                                        gap: 8,
                                        padding: "4px 8px",
                                        background: "var(--fr-bg)",
                                        border: "1px solid var(--fr-border)",
                                        borderRadius: 6,
                                        color: "var(--fr-muted)",
                                      }}
                                    >
                                      <span style={{ fontWeight: 700 }}>W-9</span>
                                      <span>{x.taxClassification || "—"}</span>
                                      <span>{x.w9Revision || "—"}</span>
                                      <span style={{ marginLeft: "auto" }}>
                                        {fmtDateLocale(x.signatureDate, lang)}
                                      </span>
                                      <span
                                        style={{
                                          fontSize: 9,
                                          fontWeight: 700,
                                          padding: "1px 6px",
                                          borderRadius: 4,
                                          background: "var(--fr-surface)",
                                          border: "1px solid var(--fr-border)",
                                          textTransform: "uppercase",
                                        }}
                                      >
                                        {t("compliance_replaced")}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="fr-muted" style={{ padding: 12, fontSize: 12 }}>
                  {t("empty_none")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
