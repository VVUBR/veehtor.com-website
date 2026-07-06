import { useMemo, useState, useEffect } from "react";
import { useI18n, fmtCurrency } from "../lib/i18n";
import type { BudgetLine, StageRow } from "../data";

function pctColor(pct: number) {
  if (pct > 100) return "var(--fr-red)";
  if (pct >= 90) return "var(--fr-gold)";
  if (pct > 0) return "var(--fr-green)";
  return "var(--fr-muted)";
}

/** Per-job breakdown row (for aggregated view). */
type ProjectBreak = { project: string; budget: number; realizado: number; balance: number; pct: number };

type AggregatedRow = {
  key: string;
  phase: string;
  description: string;
  budget: number;
  realizado: number;
  balance: number;
  pctConsumed: number;
  noBudgetLine: boolean;
  projects: ProjectBreak[];
};

function aggregateByPhaseDescription(lines: BudgetLine[]): AggregatedRow[] {
  const map = new Map<string, AggregatedRow>();
  for (const l of lines) {
    const key = `${l.phase}||${l.description}`;
    let row = map.get(key);
    if (!row) {
      row = {
        key,
        phase: l.phase,
        description: l.description,
        budget: 0, realizado: 0, balance: 0, pctConsumed: 0,
        noBudgetLine: l.noBudgetLine, projects: [],
      };
      map.set(key, row);
    }
    row.budget += l.budget;
    row.realizado += l.realizado;
    row.balance += l.balance;
    row.projects.push({
      project: l.job || "(sem obra)",
      budget: l.budget, realizado: l.realizado, balance: l.balance,
      pct: l.budget > 0 ? (l.realizado / l.budget) * 100 : 0,
    });
  }
  for (const r of map.values()) {
    r.pctConsumed = r.budget > 0 ? (r.realizado / r.budget) * 100 : 0;
    r.projects.sort((a, b) => b.realizado - a.realizado);
  }
  return [...map.values()].sort((a, b) => {
    if (a.noBudgetLine !== b.noBudgetLine) return a.noBudgetLine ? 1 : -1;
    return b.realizado - a.realizado;
  });
}

function groupByPhase(lines: BudgetLine[]): StageRow[] {
  const map = new Map<string, StageRow>();
  for (const l of lines) {
    const key = l.phase;
    if (!map.has(key)) {
      map.set(key, { phase: key, budget: 0, realizado: 0, balance: 0, pctConsumed: 0, noBudgetLine: l.noBudgetLine, lines: [] });
    }
    const g = map.get(key)!;
    g.budget += l.budget;
    g.realizado += l.realizado;
    g.balance += l.balance;
    g.lines.push(l);
    g.noBudgetLine = g.noBudgetLine || l.noBudgetLine;
  }
  for (const g of map.values()) g.pctConsumed = g.budget > 0 ? (g.realizado / g.budget) * 100 : 0;
  return [...map.values()].sort((a, b) => {
    if (a.noBudgetLine !== b.noBudgetLine) return a.noBudgetLine ? 1 : -1;
    return b.realizado - a.realizado;
  });
}

export default function StageDetailTable({ job, budgetLines }: { job: string; budgetLines: BudgetLine[] }) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const isAll = job === "__ALL__";

  const aggregated = useMemo(() => (isAll ? aggregateByPhaseDescription(budgetLines) : []), [budgetLines, isAll]);
  const phaseRows = useMemo(
    () => (!isAll ? groupByPhase(budgetLines.filter((l) => l.job === job)) : []),
    [budgetLines, job, isAll],
  );

  const currentKeys = useMemo(
    () => (isAll ? aggregated.filter((r) => r.projects.length > 1).map((r) => r.key)
                 : phaseRows.filter((r) => r.lines.length > 1).map((r) => r.phase)),
    [isAll, aggregated, phaseRows],
  );

  const allExpanded = currentKeys.length > 0 && currentKeys.every((k) => expanded[k]);

  useEffect(() => { setExpanded({}); }, [job]);

  const toggleAll = () => {
    if (allExpanded) setExpanded({});
    else {
      const next: Record<string, boolean> = {};
      for (const k of currentKeys) next[k] = true;
      setExpanded(next);
    }
  };

  const totalBudget = (isAll ? aggregated : phaseRows).reduce((s, r) => s + r.budget, 0);
  const totalReal = (isAll ? aggregated : phaseRows).reduce((s, r) => s + r.realizado, 0);
  const totalBal = (isAll ? aggregated : phaseRows).reduce((s, r) => s + r.balance, 0);
  const nRows = isAll ? aggregated.length : phaseRows.length;

  return (
    <div className="fr-card p-5">
      <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
        <h3 className="fr-heading" style={{ fontSize: 16, color: "var(--fr-navy)", margin: 0 }}>
          {t("sec_stage_detail")}{" "}
          <span className="fr-muted" style={{ fontSize: 12, fontWeight: 400 }}>
            ({t("filtered_meta", { n: nRows, v: fmtCurrency(totalReal) })})
          </span>
        </h3>
        {currentKeys.length > 0 && (
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
              <th>{isAll ? t("th_phase") + " / " + t("no_budget_line") : t("th_phase")}</th>
              <th style={{ textAlign: "right" }}>{t("th_budget")}</th>
              <th style={{ textAlign: "right" }}>{t("th_realizado")}</th>
              <th style={{ textAlign: "right" }}>{t("th_balance")}</th>
              <th style={{ textAlign: "right" }}>{t("th_pct")}</th>
            </tr>
          </thead>
          <tbody>
            {isAll && aggregated.map((r) => {
              const opened = !!expanded[r.key];
              const canExpand = r.projects.length > 1;
              return (
                <FragmentRow key={r.key}>
                  <tr
                    style={{ cursor: canExpand ? "pointer" : "default" }}
                    onClick={() => canExpand && setExpanded((s) => ({ ...s, [r.key]: !s[r.key] }))}
                  >
                    <td>{canExpand ? (opened ? "▾" : "▸") : ""}</td>
                    <td style={{ fontWeight: 700, color: r.noBudgetLine ? "var(--fr-muted)" : "var(--fr-navy)" }}>
                      {r.noBudgetLine ? t("no_budget_line") : (
                        <>
                          <span>{r.phase}</span>
                          {r.description && r.description !== r.phase && (
                            <span style={{ fontWeight: 400, color: "var(--fr-muted)", fontSize: 12 }}> · {r.description}</span>
                          )}
                        </>
                      )}
                    </td>
                    <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(r.budget)}</td>
                    <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(r.realizado)}</td>
                    <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", color: r.balance < 0 ? "var(--fr-red)" : "var(--fr-text)" }}>
                      {fmtCurrency(r.balance)}
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 700, color: pctColor(r.pctConsumed) }}>
                      {r.budget > 0 ? `${Math.round(r.pctConsumed)}%` : "—"}
                    </td>
                  </tr>
                  {opened && r.projects.map((p, i) => (
                    <tr key={`${r.key}-${i}`} style={{ background: "var(--fr-surface)" }}>
                      <td></td>
                      <td style={{ paddingLeft: 24, fontSize: 12 }}>{p.project}</td>
                      <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 12 }}>{fmtCurrency(p.budget)}</td>
                      <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 12 }}>{fmtCurrency(p.realizado)}</td>
                      <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 12, color: p.balance < 0 ? "var(--fr-red)" : "var(--fr-text)" }}>
                        {fmtCurrency(p.balance)}
                      </td>
                      <td style={{ textAlign: "right", fontSize: 12, color: pctColor(p.pct) }}>
                        {p.budget > 0 ? `${Math.round(p.pct)}%` : "—"}
                      </td>
                    </tr>
                  ))}
                </FragmentRow>
              );
            })}

            {!isAll && phaseRows.map((r) => {
              const opened = !!expanded[r.phase];
              return (
                <FragmentRow key={r.phase}>
                  <tr
                    style={{ cursor: r.lines.length > 1 ? "pointer" : "default" }}
                    onClick={() => setExpanded((s) => ({ ...s, [r.phase]: !s[r.phase] }))}>
                    <td>{r.lines.length > 1 ? (opened ? "▾" : "▸") : ""}</td>
                    <td style={{ fontWeight: 700, color: r.noBudgetLine ? "var(--fr-muted)" : "var(--fr-navy)" }}>
                      {r.noBudgetLine ? t("no_budget_line") : r.phase}
                    </td>
                    <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(r.budget)}</td>
                    <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(r.realizado)}</td>
                    <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", color: r.balance < 0 ? "var(--fr-red)" : "var(--fr-text)" }}>
                      {fmtCurrency(r.balance)}
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 700, color: pctColor(r.pctConsumed) }}>
                      {r.budget > 0 ? `${Math.round(r.pctConsumed)}%` : "—"}
                    </td>
                  </tr>
                  {opened && r.lines.map((l, i) => (
                    <tr key={`${r.phase}-${i}`} style={{ background: "var(--fr-surface)" }}>
                      <td></td>
                      <td style={{ paddingLeft: 24, fontSize: 12 }}>{l.description}</td>
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
