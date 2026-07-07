import { useMemo, useState, useEffect } from "react";
import { useI18n, fmtCurrency } from "../lib/i18n";
import type { BudgetLine } from "../data";

function pctColor(pct: number) {
  if (pct > 100) return "var(--fr-red)";
  if (pct >= 90) return "var(--fr-gold)";
  if (pct > 0) return "var(--fr-green)";
  return "var(--fr-muted)";
}

type DisplayLine = {
  phase: string;
  description: string;
  budget: number;
  realizado: number;
  balance: number;
  pctConsumed: number;
  noBudgetLine: boolean;
};

type ProjectGroup = {
  key: string;           // job name or "" for sem-obra
  label: string;         // display label
  isUnassigned: boolean; // no job
  budget: number;
  realizado: number;
  balance: number;
  pctConsumed: number;
  lines: DisplayLine[];
};

function buildProjectGroups(budgetLines: BudgetLine[]): ProjectGroup[] {
  // Preserve first-seen phase order per project.
  const phaseOrder = new Map<string, Map<string, number>>();
  const byProject = new Map<string, BudgetLine[]>();
  budgetLines.forEach((l) => {
    const key = l.job || "";
    if (!byProject.has(key)) {
      byProject.set(key, []);
      phaseOrder.set(key, new Map());
    }
    byProject.get(key)!.push(l);
    const po = phaseOrder.get(key)!;
    if (!po.has(l.phase)) po.set(l.phase, po.size);
  });

  const groups: ProjectGroup[] = [];
  for (const [key, lines] of byProject.entries()) {
    const po = phaseOrder.get(key)!;
    const regular = lines.filter((l) => !l.noBudgetLine);
    const noBL = lines.filter((l) => l.noBudgetLine);

    regular.sort((a, b) => {
      const ap = po.get(a.phase) ?? 999;
      const bp = po.get(b.phase) ?? 999;
      if (ap !== bp) return ap - bp;
      return 0;
    });

    const display: DisplayLine[] = regular.map((l) => ({
      phase: l.phase,
      description: l.description,
      budget: l.budget,
      realizado: l.realizado,
      balance: l.balance,
      pctConsumed: l.pctConsumed,
      noBudgetLine: false,
    }));

    if (noBL.length > 0) {
      const rSum = noBL.reduce((s, l) => s + l.realizado, 0);
      display.push({
        phase: "",
        description: "",
        budget: 0,
        realizado: rSum,
        balance: -rSum,
        pctConsumed: 0,
        noBudgetLine: true,
      });
    }

    const budget = lines.reduce((s, l) => s + l.budget, 0);
    const realizado = lines.reduce((s, l) => s + l.realizado, 0);
    const balance = budget - realizado;
    const pct = budget > 0 ? (realizado / budget) * 100 : 0;

    groups.push({
      key,
      label: key || "",
      isUnassigned: key === "",
      budget,
      realizado,
      balance,
      pctConsumed: pct,
      lines: display,
    });
  }

  const assigned = groups.filter((g) => !g.isUnassigned).sort((a, b) => b.pctConsumed - a.pctConsumed);
  const unassigned = groups.filter((g) => g.isUnassigned);
  return [...assigned, ...unassigned];
}

export default function StageDetailTable({ job, budgetLines }: { job: string; budgetLines: BudgetLine[] }) {
  const { t } = useI18n();
  const isAll = job === "__ALL__";

  const allGroups = useMemo(() => buildProjectGroups(budgetLines), [budgetLines]);

  const visibleGroups = useMemo(() => {
    if (isAll) return allGroups;
    if (job === "__UNASSIGNED__") return allGroups.filter((g) => g.isUnassigned);
    return allGroups.filter((g) => g.key === job);
  }, [allGroups, isAll, job]);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Auto-expand when a specific project is selected.
  useEffect(() => {
    if (!isAll) {
      const next: Record<string, boolean> = {};
      for (const g of visibleGroups) next[g.key] = true;
      setExpanded(next);
    } else {
      setExpanded({});
    }
  }, [job]); // eslint-disable-line react-hooks/exhaustive-deps

  const expandableKeys = visibleGroups.filter((g) => g.lines.length > 0).map((g) => g.key);
  const allExpanded = expandableKeys.length > 0 && expandableKeys.every((k) => expanded[k]);

  const toggleAll = () => {
    if (allExpanded) setExpanded({});
    else {
      const next: Record<string, boolean> = {};
      for (const k of expandableKeys) next[k] = true;
      setExpanded(next);
    }
  };

  const totalBudget = visibleGroups.reduce((s, g) => s + g.budget, 0);
  const totalReal = visibleGroups.reduce((s, g) => s + g.realizado, 0);
  const totalBal = totalBudget - totalReal;
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
        {expandableKeys.length > 0 && (
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
              const opened = !!expanded[g.key];
              const canExpand = g.lines.length > 0;
              return (
                <FragmentRow key={g.key || "__sem_obra__"}>
                  <tr
                    style={{ cursor: canExpand ? "pointer" : "default" }}
                    onClick={() => canExpand && setExpanded((s) => ({ ...s, [g.key]: !s[g.key] }))}
                  >
                    <td>{canExpand ? (opened ? "▾" : "▸") : ""}</td>
                    <td style={{ fontWeight: 700, color: g.isUnassigned ? "var(--fr-muted)" : "var(--fr-navy)" }}>
                      {g.isUnassigned ? `(${t("no_project")})` : g.label}
                    </td>
                    <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(g.budget)}</td>
                    <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(g.realizado)}</td>
                    <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", color: g.balance < 0 ? "var(--fr-red)" : "var(--fr-text)" }}>
                      {fmtCurrency(g.balance)}
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 700, color: pctColor(g.pctConsumed) }}>
                      {g.budget > 0 ? `${Math.round(g.pctConsumed)}%` : "—"}
                    </td>
                  </tr>
                  {opened && g.lines.map((l, i) => (
                    <tr key={`${g.key}-${i}`} style={{ background: "var(--fr-surface)" }}>
                      <td></td>
                      <td style={{ paddingLeft: 24, fontSize: 12 }}>
                        {l.noBudgetLine ? (
                          <span style={{ color: "var(--fr-muted)", fontStyle: "italic" }}>
                            ({t("no_budget_line")})
                          </span>
                        ) : (
                          <>
                            <span style={{ fontWeight: 700, color: "var(--fr-navy)" }}>{l.phase}</span>
                            {l.description && l.description !== l.phase && (
                              <span style={{ color: "var(--fr-muted)" }}> · {l.description}</span>
                            )}
                          </>
                        )}
                      </td>
                      <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 12 }}>{fmtCurrency(l.budget)}</td>
                      <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 12 }}>{fmtCurrency(l.realizado)}</td>
                      <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 12, color: l.balance < 0 ? "var(--fr-red)" : "var(--fr-text)" }}>
                        {fmtCurrency(l.balance)}
                      </td>
                      <td style={{ textAlign: "right", fontSize: 12, color: pctColor(l.pctConsumed) }}>
                        {l.budget > 0 ? `${Math.round(l.pctConsumed)}%` : "—"}
                      </td>
                    </tr>
                  ))}
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
