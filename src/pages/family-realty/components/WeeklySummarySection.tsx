import { useMemo, useState, useEffect } from "react";
import { useI18n, fmtCurrency, fmtDateLocale } from "../lib/i18n";
import { today0, type WeeklyCostRow } from "../data";

const DAY = 86400000;

function mondayOf(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const day = x.getDay(); // 0=Sun..6=Sat
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  return x;
}
function keyOf(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

type Group = {
  project: string;
  total: number;
  phases: {
    phase: string;
    total: number;
    suppliers: { supplier: string; total: number; count: number }[];
  }[];
};

function groupByProject(rows: WeeklyCostRow[]): Group[] {
  const byProj = new Map<string, Group>();
  for (const r of rows) {
    const pk = r.project || "(sem obra)";
    if (!byProj.has(pk)) byProj.set(pk, { project: pk, total: 0, phases: [] });
    const g = byProj.get(pk)!;
    g.total += r.total;
    const phk = r.phase || "(sem etapa)";
    let ph = g.phases.find((p) => p.phase === phk);
    if (!ph) { ph = { phase: phk, total: 0, suppliers: [] }; g.phases.push(ph); }
    ph.total += r.total;
    let sup = ph.suppliers.find((s) => s.supplier === r.supplier);
    if (!sup) { sup = { supplier: r.supplier, total: 0, count: 0 }; ph.suppliers.push(sup); }
    sup.total += r.total;
    sup.count += r.count;
  }
  const out = [...byProj.values()];
  out.sort((a, b) => b.total - a.total);
  for (const g of out) {
    g.phases.sort((a, b) => b.total - a.total);
    for (const p of g.phases) p.suppliers.sort((a, b) => b.total - a.total);
  }
  return out;
}

export default function WeeklySummarySection({ rows, job }: { rows: WeeklyCostRow[]; job: string }) {
  const { t, lang } = useI18n();

  // Available weeks (distinct week_start), sorted desc
  const weeks = useMemo(() => {
    const map = new Map<string, { start: Date; end: Date }>();
    for (const r of rows) {
      if (!r.weekStart) continue;
      const k = keyOf(r.weekStart);
      if (!map.has(k)) {
        const end = r.weekEnd || new Date(r.weekStart.getTime() + 6 * DAY);
        map.set(k, { start: r.weekStart, end });
      }
    }
    const arr = [...map.entries()].map(([k, v]) => ({ key: k, ...v }));
    arr.sort((a, b) => b.start.getTime() - a.start.getTime());
    return arr;
  }, [rows]);

  // Default = last complete week
  const [weekKey, setWeekKey] = useState<string | null>(null);
  useEffect(() => {
    if (weekKey || weeks.length === 0) return;
    const today = today0();
    const complete = weeks.find((w) => w.end.getTime() < today.getTime());
    setWeekKey((complete ?? weeks[0]).key);
  }, [weeks, weekKey]);

  const currentIdx = weeks.findIndex((w) => w.key === weekKey);
  const currentWeek = currentIdx >= 0 ? weeks[currentIdx] : null;

  const weekRows = useMemo(() => {
    if (!currentWeek) return [];
    let arr = rows.filter((r) => r.weekStart && keyOf(r.weekStart) === currentWeek.key);
    if (job !== "__ALL__") {
      if (job === "__UNASSIGNED__") arr = arr.filter((r) => !r.project);
      else arr = arr.filter((r) => r.project === job);
    }
    return arr;
  }, [rows, currentWeek, job]);

  const groups = useMemo(() => groupByProject(weekRows), [weekRows]);
  const grandTotal = groups.reduce((s, g) => s + g.total, 0);

  const weekLabel = (w: { start: Date; end: Date }) =>
    `${fmtDateLocale(w.start, lang)} – ${fmtDateLocale(w.end, lang)}`;

  const nav = (dir: -1 | 1) => {
    if (currentIdx < 0) return;
    // -1 = older (higher idx), +1 = newer (lower idx)
    const next = currentIdx + (dir === -1 ? 1 : -1);
    if (next >= 0 && next < weeks.length) setWeekKey(weeks[next].key);
  };

  const downloadCsv = () => {
    const lines: string[] = [];
    lines.push(["Job", "Phase", "Supplier", "Count", "Total"].join(","));
    for (const g of groups) for (const p of g.phases) for (const s of p.suppliers) {
      lines.push([g.project, p.phase, s.supplier, s.count, s.total.toFixed(2)]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
    }
    lines.push("");
    lines.push(["", "", "", "TOTAL", grandTotal.toFixed(2)].join(","));
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `weekly-summary-${currentWeek?.key ?? "week"}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const printPdf = () => {
    document.body.classList.add("fr-print-weekly-only");
    setTimeout(() => {
      window.print();
      setTimeout(() => document.body.classList.remove("fr-print-weekly-only"), 500);
    }, 50);
  };

  return (
    <div className="fr-card p-5 fr-weekly-wrap">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h3 className="fr-heading" style={{ fontSize: 16, color: "var(--fr-navy)", margin: 0 }}>
          {t("sec_weekly")}
        </h3>
        <div className="fr-print-hide flex items-center gap-2">
          <button className="fr-btn" onClick={downloadCsv} style={{ color: "var(--fr-navy)", borderColor: "var(--fr-border)" }}>
            {t("exportCsv")}
          </button>
          <button className="fr-btn" onClick={printPdf} style={{ color: "var(--fr-navy)", borderColor: "#EAAA00" }}>
            {t("weekly_export_pdf")}
          </button>
        </div>
      </div>

      <div className="fr-print-hide flex flex-wrap items-center gap-3 mb-3">
        <button className="fr-btn" onClick={() => nav(-1)} disabled={currentIdx < 0 || currentIdx >= weeks.length - 1}
          style={{ color: "var(--fr-navy)", borderColor: "var(--fr-border)" }}>◀</button>
        <select className="fr-select" value={weekKey ?? ""} onChange={(e) => setWeekKey(e.target.value)} style={{ minWidth: 260 }}>
          {weeks.slice(0, 12).map((w) => (
            <option key={w.key} value={w.key}>{weekLabel(w)}</option>
          ))}
        </select>
        <button className="fr-btn" onClick={() => nav(1)} disabled={currentIdx <= 0}
          style={{ color: "var(--fr-navy)", borderColor: "var(--fr-border)" }}>▶</button>
      </div>

      {currentWeek && (
        <div style={{ marginBottom: 12 }}>
          <div className="fr-muted" style={{ fontSize: 12 }}>{weekLabel(currentWeek)}</div>
          <div className="fr-heading" style={{ fontSize: 28, color: "var(--fr-navy)" }}>{fmtCurrency(grandTotal)}</div>
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table className="fr-table">
          <thead>
            <tr>
              <th>{t("th_job")}</th>
              <th>{t("th_phase")}</th>
              <th>{t("th_supplier")}</th>
              <th style={{ textAlign: "right" }}>#</th>
              <th style={{ textAlign: "right" }}>{t("th_value")}</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <FragmentWeekly key={g.project}>
                <tr style={{ background: "var(--fr-surface)" }}>
                  <td colSpan={4} style={{ fontWeight: 700, color: "var(--fr-navy)" }}>
                    {g.project === "(sem obra)" ? t("no_job_short") : g.project}
                  </td>
                  <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 700, color: "var(--fr-navy)" }}>
                    {fmtCurrency(g.total)}
                  </td>
                </tr>
                {g.phases.map((p) => (
                  <FragmentWeekly key={g.project + "|" + p.phase}>
                    <tr>
                      <td></td>
                      <td colSpan={3} style={{ fontWeight: 700, fontSize: 12, color: "var(--fr-text)" }}>
                        {p.phase === "(sem etapa)" ? t("no_phase") : p.phase}
                      </td>
                      <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 12, fontWeight: 700 }}>
                        {fmtCurrency(p.total)}
                      </td>
                    </tr>
                    {p.suppliers.map((s, i) => (
                      <tr key={i}>
                        <td></td>
                        <td></td>
                        <td style={{ fontSize: 12, paddingLeft: 20 }}>{s.supplier}</td>
                        <td style={{ textAlign: "right", fontSize: 12, color: "var(--fr-muted)" }}>{s.count}</td>
                        <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 12 }}>{fmtCurrency(s.total)}</td>
                      </tr>
                    ))}
                  </FragmentWeekly>
                ))}
              </FragmentWeekly>
            ))}
            {groups.length === 0 && (
              <tr><td colSpan={5} className="fr-muted" style={{ textAlign: "center", padding: 24 }}>{t("empty_none")}</td></tr>
            )}
            {groups.length > 0 && (
              <tr style={{ fontWeight: 900, background: "var(--fr-navy)", color: "#fff" }}>
                <td colSpan={4} style={{ color: "#fff" }}>{t("grand_total")}</td>
                <td style={{ textAlign: "right", color: "#EAAA00", fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(grandTotal)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FragmentWeekly({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
