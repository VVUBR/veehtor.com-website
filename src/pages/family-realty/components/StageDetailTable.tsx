import { useMemo, useState } from "react";
import { useI18n, fmtCurrency } from "../lib/i18n";
import type { BudgetLine, StageRow } from "../data";

function pctColor(pct: number) {
  if (pct > 100) return "var(--fr-red)";
  if (pct >= 90) return "var(--fr-gold)";
  if (pct > 0) return "var(--fr-green)";
  return "var(--fr-muted)";
}

function group(lines: BudgetLine[]): StageRow[] {
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

  const rows = useMemo(() => {
    const scoped = job === "__ALL__" ? budgetLines : budgetLines.filter((l) => l.job === job);
    return group(scoped);
  }, [budgetLines, job]);

  const totals = rows.reduce(
    (acc, r) => ({ budget: acc.budget + r.budget, realizado: acc.realizado + r.realizado, balance: acc.balance + r.balance }),
    { budget: 0, realizado: 0, balance: 0 },
  );

  return (
    <div className="fr-card p-5">
      <h3 className="fr-heading" style={{ fontSize: 16, color: "var(--fr-navy)", margin: 0, marginBottom: 12 }}>
        {t("sec_stage_detail")}
      </h3>
      <div style={{ overflowX: "auto" }}>
        <table className="fr-table">
          <thead>
            <tr>
              <th style={{ width: 32 }}></th>
              <th>{t("th_phase")}</th>
              <th style={{ textAlign: "right" }}>{t("th_budget")}</th>
              <th style={{ textAlign: "right" }}>{t("th_realizado")}</th>
              <th style={{ textAlign: "right" }}>{t("th_balance")}</th>
              <th style={{ textAlign: "right" }}>{t("th_pct")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
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
            {rows.length === 0 && (
              <tr><td colSpan={6} className="fr-muted" style={{ textAlign: "center", padding: 24 }}>{t("empty_none")}</td></tr>
            )}
            {rows.length > 0 && (
              <tr style={{ fontWeight: 700, background: "var(--fr-surface)" }}>
                <td></td>
                <td>Total</td>
                <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(totals.budget)}</td>
                <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(totals.realizado)}</td>
                <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", color: totals.balance < 0 ? "var(--fr-red)" : "var(--fr-text)" }}>
                  {fmtCurrency(totals.balance)}
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
