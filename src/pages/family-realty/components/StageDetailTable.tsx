import { useMemo, useState, useEffect } from "react";
import { useI18n, fmtCurrency } from "../lib/i18n";
import type { BudgetLine } from "../data";
import { isOutOfBudget } from "../lib/phases";

function pctColor(pct: number, hasBudget: boolean) {
  if (!hasBudget) return "var(--fr-muted)";
  if (pct > 100) return "var(--fr-red)";
  if (pct >= 90) return "var(--fr-gold)";
  if (pct > 0) return "var(--fr-green)";
  return "var(--fr-muted)";
}

type PhaseGroup = {
  key: string;
  label: string;
  noBudgetLine: boolean; // phase is "(sem etapa)"
  budget: number;
  realizado: number;
  balance: number;
  pctConsumed: number;
  lines: BudgetLine[];
};

type ProjectGroup = {
  key: string;
  label: string;
  isUnassigned: boolean;
  budget: number;
  realizado: number;
  realizadoObra: number;
  balance: number;
  pctConsumed: number;
  phases: PhaseGroup[];
};



function buildGroups(budgetLines: BudgetLine[]): ProjectGroup[] {
  const phaseOrderByProject = new Map<string, Map<string, number>>();
  const byProject = new Map<string, BudgetLine[]>();
  budgetLines.forEach((l) => {
    const key = l.job || "";
    if (!byProject.has(key)) {
      byProject.set(key, []);
      phaseOrderByProject.set(key, new Map());
    }
    byProject.get(key)!.push(l);
    const po = phaseOrderByProject.get(key)!;
    const ph = l.phase || "__NO_BUDGET_LINE__";
    if (!po.has(ph)) po.set(ph, po.size);
  });

  const groups: ProjectGroup[] = [];
  for (const [key, lines] of byProject.entries()) {
    const po = phaseOrderByProject.get(key)!;
    const byPhase = new Map<string, BudgetLine[]>();
    for (const l of lines) {
      const ph = l.phase || "__NO_BUDGET_LINE__";
      if (!byPhase.has(ph)) byPhase.set(ph, []);
      byPhase.get(ph)!.push(l);
    }

    const phases: PhaseGroup[] = [];
    for (const [ph, phLines] of byPhase.entries()) {
      const budget = phLines.reduce((s, l) => s + l.budget, 0);
      const realizado = phLines.reduce((s, l) => s + l.realizado, 0);
      const isBankFee = isOutOfBudget(ph);
      const balance = isBankFee ? 0 : budget - realizado;
      const pct = isBankFee ? 0 : budget > 0 ? (realizado / budget) * 100 : 0;
      phases.push({
        key: ph,
        label: ph === "__NO_BUDGET_LINE__" ? "" : ph,
        noBudgetLine: ph === "__NO_BUDGET_LINE__" || phLines.every((l) => l.noBudgetLine),
        budget,
        realizado,
        balance,
        pctConsumed: pct,
        lines: phLines,
      });
    }
    phases.sort((a, b) => {
      if (a.noBudgetLine !== b.noBudgetLine) return a.noBudgetLine ? 1 : -1;
      return (po.get(a.key) ?? 999) - (po.get(b.key) ?? 999);
    });

    const budget = lines.reduce((s, l) => s + l.budget, 0);
    const realizado = lines.reduce((s, l) => s + l.realizado, 0);
    const realizadoObra = lines.filter((l) => !isOutOfBudget(l.phase)).reduce((s, l) => s + l.realizado, 0);
    const balance = budget - realizadoObra;
    const pct = budget > 0 ? (realizadoObra / budget) * 100 : 0;

    groups.push({
      key,
      label: key || "",
      isUnassigned: key === "",
      budget,
      realizado,
      realizadoObra,
      balance,
      pctConsumed: pct,
      phases,
    });
  }

  const assigned = groups.filter((g) => !g.isUnassigned).sort((a, b) => b.pctConsumed - a.pctConsumed);
  const unassigned = groups.filter((g) => g.isUnassigned);
  return [...assigned, ...unassigned];
}

export default function StageDetailTable({ job, budgetLines }: { job: string; budgetLines: BudgetLine[] }) {
  const { t } = useI18n();
  const isAll = job === "__ALL__";

  const allGroups = useMemo(() => buildGroups(budgetLines), [budgetLines]);

  const visibleGroups = useMemo(() => {
    if (isAll) return allGroups;
    if (job === "__UNASSIGNED__") return allGroups.filter((g) => g.isUnassigned);
    return allGroups.filter((g) => g.key === job);
  }, [allGroups, isAll, job]);

  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});

  // Auto-expand when a specific project is selected.
  useEffect(() => {
    if (!isAll) {
      const next: Record<string, boolean> = {};
      for (const g of visibleGroups) next[g.key] = true;
      setExpandedProjects(next);
    } else {
      setExpandedProjects({});
      setExpandedPhases({});
    }
  }, [job]); // eslint-disable-line react-hooks/exhaustive-deps

  const expandableProjectKeys = visibleGroups.filter((g) => g.phases.length > 0).map((g) => g.key);
  const allExpanded =
    expandableProjectKeys.length > 0 && expandableProjectKeys.every((k) => expandedProjects[k]);

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedProjects({});
      setExpandedPhases({});
    } else {
      const nextP: Record<string, boolean> = {};
      const nextPh: Record<string, boolean> = {};
      for (const g of visibleGroups) {
        nextP[g.key] = true;
        for (const ph of g.phases) nextPh[`${g.key}::${ph.key}`] = true;
      }
      setExpandedProjects(nextP);
      setExpandedPhases(nextPh);
    }
  };

  const totalBudget = visibleGroups.reduce((s, g) => s + g.budget, 0);
  const totalReal = visibleGroups.reduce((s, g) => s + g.realizado, 0);
  const totalRealObra = visibleGroups.reduce((s, g) => s + g.realizadoObra, 0);
  const totalBal = totalBudget - totalRealObra;
  const nRows = visibleGroups.length;

  return (
    <div className="fr-card p-5">
      <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
        <h3 className="fr-heading" style={{ fontSize: 16, color: "var(--fr-navy)", margin: 0 }}>
          {t("sec_stage_detail")}{" "}
          <span className="fr-muted" style={{ fontSize: 12, fontWeight: 400 }}>
            ({t("filtered_meta", { n: nRows, v: fmtCurrency(totalReal) })})
          </span>
        </h3>
        {expandableProjectKeys.length > 0 && (
          <button
            type="button"
            className="fr-btn fr-print-hide"
            onClick={toggleAll}
            style={{ color: "var(--fr-navy)", borderColor: "var(--fr-border)", fontSize: 12 }}
          >
            {allExpanded ? t("collapse_all") : t("expand_all")}
          </button>
        )}
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="fr-table">
          <thead>
            <tr>
              <th style={{ width: 32 }}></th>
              <th>{t("th_job")}</th>
              <th style={{ textAlign: "right" }}>{t("th_budget")}</th>
              <th style={{ textAlign: "right" }}>{t("th_realizado")}</th>
              <th style={{ textAlign: "right" }}>{t("th_balance")}</th>
              <th style={{ textAlign: "right" }}>{t("th_pct")}</th>
            </tr>
          </thead>
          <tbody>
            {visibleGroups.map((g) => {
              const projOpen = !!expandedProjects[g.key];
              const canExpandProj = g.phases.length > 0;
              return (
                <FragmentRow key={g.key || "__sem_obra__"}>
                  {/* Level 1: Project */}
                  <tr
                    style={{ cursor: canExpandProj ? "pointer" : "default" }}
                    onClick={() =>
                      canExpandProj &&
                      setExpandedProjects((s) => ({ ...s, [g.key]: !s[g.key] }))
                    }
                  >
                    <td>{canExpandProj ? (projOpen ? "▾" : "▸") : ""}</td>
                    <td style={{ fontWeight: 700, color: g.isUnassigned ? "var(--fr-muted)" : "var(--fr-navy)" }}>
                      {g.isUnassigned ? `(${t("no_project")})` : g.label}
                    </td>
                    <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(g.budget)}</td>
                    <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(g.realizado)}</td>
                    <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", color: g.balance < 0 ? "var(--fr-red)" : "var(--fr-text)" }}>
                      {fmtCurrency(g.balance)}
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 700, color: pctColor(g.pctConsumed, g.budget > 0) }}>
                      {g.budget > 0 ? `${Math.round(g.pctConsumed)}%` : "—"}
                    </td>
                  </tr>

                  {/* Level 2: Phase */}
                  {projOpen &&
                    g.phases.map((ph) => {
                      const phKey = `${g.key}::${ph.key}`;
                      const phOpen = !!expandedPhases[phKey];
                      const canExpandPh = ph.lines.length > 0;
                      return (
                        <FragmentRow key={phKey}>
                          <tr
                            style={{ background: "var(--fr-surface)", cursor: canExpandPh ? "pointer" : "default" }}
                            onClick={() =>
                              canExpandPh && setExpandedPhases((s) => ({ ...s, [phKey]: !s[phKey] }))
                            }
                          >
                            <td style={{ paddingLeft: 24 }}>
                              {canExpandPh ? (phOpen ? "▾" : "▸") : ""}
                            </td>
                            <td style={{ paddingLeft: 32, fontSize: 12 }}>
                              {ph.noBudgetLine ? (
                                <span style={{ color: "var(--fr-muted)", fontStyle: "italic" }}>
                                  ({t("no_phase")})
                                </span>
                              ) : (
                                <span style={{ fontWeight: 700, color: "var(--fr-navy)" }}>{ph.label}</span>
                              )}
                            </td>
                            <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 12 }}>
                              {fmtCurrency(ph.budget)}
                            </td>
                            <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 12 }}>
                              {fmtCurrency(ph.realizado)}
                            </td>
                            <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 12, color: ph.balance < 0 ? "var(--fr-red)" : "var(--fr-text)" }}>
                              {fmtCurrency(ph.balance)}
                            </td>
                            <td style={{ textAlign: "right", fontSize: 12, fontWeight: 700, color: pctColor(ph.pctConsumed, ph.budget > 0) }}>
                              {ph.budget > 0 ? `${Math.round(ph.pctConsumed)}%` : "—"}
                            </td>
                          </tr>

                          {/* Level 3: Description */}
                          {phOpen &&
                            ph.lines.map((l, i) => {
                              const noLine = l.noBudgetLine || !l.description;
                              const isBankFee = l.phase === BANK_FEE;
                              return (
                                <tr key={`${phKey}-${i}`} style={{ background: "var(--fr-bg)" }}>
                                  <td></td>
                                  <td style={{ paddingLeft: 56, fontSize: 12 }}>
                                    {noLine ? (
                                      <span style={{ color: "var(--fr-muted)", fontStyle: "italic" }}>
                                        ({t("no_budget_line")})
                                      </span>
                                    ) : (
                                      <span style={{ color: "var(--fr-text)" }}>{l.description}</span>
                                    )}
                                  </td>
                                  <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 12 }}>{fmtCurrency(l.budget)}</td>
                                  <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 12 }}>{fmtCurrency(l.realizado)}</td>
                                  <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 12, color: (isBankFee ? 0 : l.balance) < 0 ? "var(--fr-red)" : "var(--fr-text)" }}>
                                    {isBankFee ? fmtCurrency(0) : fmtCurrency(l.balance)}
                                  </td>
                                  <td style={{ textAlign: "right", fontSize: 12, color: pctColor(l.pctConsumed, !isBankFee && l.budget > 0) }}>
                                    {isBankFee ? "—" : (l.budget > 0 ? `${Math.round(l.pctConsumed)}%` : "—")}
                                  </td>
                                </tr>
                              );
                            })}
                        </FragmentRow>
                      );
                    })}
                </FragmentRow>
              );
            })}

            {nRows === 0 && (
              <tr><td colSpan={6} className="fr-muted" style={{ textAlign: "center", padding: 24 }}>{t("empty_none")}</td></tr>
            )}
            {nRows > 0 && (
              <tr style={{ fontWeight: 700, background: "var(--fr-surface)" }}>
                <td></td>
                <td>Total</td>
                <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(totalBudget)}</td>
                <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(totalReal)}</td>
                <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", color: totalBal < 0 ? "var(--fr-red)" : "var(--fr-text)" }}>
                  {fmtCurrency(totalBal)}
                </td>
                <td></td>
              </tr>
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
