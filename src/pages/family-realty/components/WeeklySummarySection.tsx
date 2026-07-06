import { useMemo, useState, useEffect, useRef } from "react";
import { useI18n, fmtCurrency, fmtDateLocale } from "../lib/i18n";
import SupplierSelect, { matchSupplier } from "./SupplierSelect";
import { today0, fmtCardNumber, type WeeklyCostRow } from "../data";

const DAY = 86400000;

function mondayOf(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const day = x.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  return x;
}
function keyOf(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

type SupplierAgg = { supplier: string; total: number; count: number; paymentMethod: string; cardNumber: string | null };
type PhaseAgg = { phase: string; total: number; suppliers: SupplierAgg[] };
type Group = { project: string; total: number; phases: PhaseAgg[] };

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
    if (!sup) {
      sup = { supplier: r.supplier, total: 0, count: 0, paymentMethod: r.paymentMethod, cardNumber: r.cardNumber };
      ph.suppliers.push(sup);
    }
    sup.total += r.total;
    sup.count += r.count;
    if (!sup.paymentMethod && r.paymentMethod) sup.paymentMethod = r.paymentMethod;
    if (!sup.cardNumber && r.cardNumber) sup.cardNumber = r.cardNumber;
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
  const pdfRootRef = useRef<HTMLDivElement | null>(null);
  const [supplier, setSupplier] = useState<string>("");

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
    if (supplier) arr = arr.filter((r) => matchSupplier(r.supplier, r.supplier, supplier));
    return arr;
  }, [rows, currentWeek, job, supplier]);

  const groups = useMemo(() => groupByProject(weekRows), [weekRows]);
  const grandTotal = groups.reduce((s, g) => s + g.total, 0);
  const nLancamentos = weekRows.reduce((s, r) => s + r.count, 0);
  const supplierOptions = useMemo(() => rows.map((r) => r.supplier), [rows]);

  const weekLabel = (w: { start: Date; end: Date }) =>
    `${fmtDateLocale(w.start, lang)} – ${fmtDateLocale(w.end, lang)}`;

  const nav = (dir: -1 | 1) => {
    if (currentIdx < 0) return;
    const next = currentIdx + (dir === -1 ? 1 : -1);
    if (next >= 0 && next < weeks.length) setWeekKey(weeks[next].key);
  };

  const downloadCsv = () => {
    const lines: string[] = [];
    lines.push(["Job", "Phase", "Supplier", "Count", "Payment Method", "Card", "Total"].join(","));
    for (const g of groups) for (const p of g.phases) for (const s of p.suppliers) {
      lines.push([g.project, p.phase, s.supplier, s.count, s.paymentMethod || "", fmtCardNumber(s.cardNumber), s.total.toFixed(2)]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
    }
    lines.push("");
    lines.push(["", "", "", "", "", "TOTAL", grandTotal.toFixed(2)].join(","));
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `weekly-summary-${currentWeek?.key ?? "week"}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const printPdf = async () => {
    if (!currentWeek) return;
    const html2canvas = (await import("html2canvas")).default;
    const jsPDFmod = await import("jspdf");
    const JsPDF = jsPDFmod.jsPDF;

    // Off-viewport (NOT opacity:0) render target so html2canvas gets real pixels.
    const wrap = document.createElement("div");
    wrap.setAttribute("data-fr-pdf-render", "1");
    Object.assign(wrap.style, {
      position: "absolute",
      left: "-9999px",
      top: "0",
      width: "1024px",
      background: "#ffffff",
      color: "#0b1e30",
      padding: "24px",
      fontFamily: "Roboto, system-ui, sans-serif",
      zIndex: "0",
    } as CSSStyleDeclaration);

    const esc = (s: unknown) =>
      String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const money = (n: number) => fmtCurrency(n);

    let body = "";
    for (const g of groups) {
      body += `<tr style="background:#f2f4f7;font-weight:700;">
        <td colspan="5" style="padding:8px 6px;color:#041C2C;">${esc(g.project === "(sem obra)" ? t("no_job_short") : g.project)}</td>
        <td style="padding:8px 6px;text-align:right;color:#041C2C;">${money(g.total)}</td>
      </tr>`;
      for (const p of g.phases) {
        body += `<tr>
          <td></td>
          <td colspan="4" style="padding:6px;font-weight:700;font-size:12px;">${esc(p.phase === "(sem etapa)" ? t("no_phase") : p.phase)}</td>
          <td style="padding:6px;text-align:right;font-weight:700;font-size:12px;">${money(p.total)}</td>
        </tr>`;
        for (const s of p.suppliers) {
          body += `<tr>
            <td></td>
            <td></td>
            <td style="padding:6px;font-size:12px;">${esc(s.supplier)}</td>
            <td style="padding:6px;font-size:12px;text-align:right;color:#666;">${s.count}</td>
            <td style="padding:6px;font-size:12px;">${esc(s.paymentMethod || "")}${s.cardNumber ? ` · ${esc(fmtCardNumber(s.cardNumber))}` : ""}</td>
            <td style="padding:6px;font-size:12px;text-align:right;">${money(s.total)}</td>
          </tr>`;
        }
      }
    }

    wrap.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:10px;">
        <div>
          <div style="font-size:11px;letter-spacing:.08em;color:#6b7280;text-transform:uppercase;">FAMILY REALTY</div>
          <div style="font-size:20px;font-weight:800;color:#041C2C;">${esc(t("sec_weekly"))}</div>
          <div style="font-size:12px;color:#374151;margin-top:4px;">${esc(weekLabel(currentWeek))}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:11px;color:#6b7280;">${esc(t("grand_total"))}</div>
          <div style="font-size:22px;font-weight:900;color:#041C2C;">${money(grandTotal)}</div>
        </div>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:12px;">
        <thead>
          <tr style="background:#041C2C;color:#fff;">
            <th style="text-align:left;padding:8px;">${esc(t("th_job"))}</th>
            <th style="text-align:left;padding:8px;">${esc(t("th_phase"))}</th>
            <th style="text-align:left;padding:8px;">${esc(t("th_supplier"))}</th>
            <th style="text-align:right;padding:8px;">#</th>
            <th style="text-align:left;padding:8px;">${esc(t("th_payment_method"))}</th>
            <th style="text-align:right;padding:8px;">${esc(t("th_value"))}</th>
          </tr>
        </thead>
        <tbody>
          ${body || `<tr><td colspan="6" style="text-align:center;padding:20px;color:#6b7280;">${esc(t("empty_none"))}</td></tr>`}
          <tr style="background:#041C2C;color:#fff;font-weight:900;">
            <td colspan="5" style="padding:10px;">${esc(t("grand_total"))}</td>
            <td style="padding:10px;text-align:right;color:#EAAA00;">${money(grandTotal)}</td>
          </tr>
        </tbody>
      </table>
      <div style="margin-top:14px;font-size:10px;color:#6b7280;">Generated ${new Date().toLocaleString(lang === "pt" ? "pt-BR" : "en-US")}</div>
    `;

    document.body.appendChild(wrap);
    pdfRootRef.current = wrap;
    // Wait for layout / paint.
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    await new Promise((r) => requestAnimationFrame(() => r(null)));

    try {
      const canvas = await html2canvas(wrap, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new JsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 24;
      const imgW = pageW - margin * 2;
      const imgH = (canvas.height * imgW) / canvas.width;

      if (imgH <= pageH - margin * 2) {
        pdf.addImage(imgData, "PNG", margin, margin, imgW, imgH);
      } else {
        // Slice the canvas into page-height chunks so nothing is cut.
        const pxPerPage = ((pageH - margin * 2) * canvas.width) / imgW;
        let y = 0;
        let first = true;
        while (y < canvas.height) {
          const h = Math.min(pxPerPage, canvas.height - y);
          const slice = document.createElement("canvas");
          slice.width = canvas.width;
          slice.height = h;
          const ctx = slice.getContext("2d");
          if (!ctx) break;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, slice.width, slice.height);
          ctx.drawImage(canvas, 0, y, canvas.width, h, 0, 0, canvas.width, h);
          const sliceData = slice.toDataURL("image/png");
          const sliceH = (h * imgW) / canvas.width;
          if (!first) pdf.addPage();
          pdf.addImage(sliceData, "PNG", margin, margin, imgW, sliceH);
          first = false;
          y += h;
        }
      }
      pdf.save(`family-realty-weekly-${currentWeek.key}.pdf`);
    } finally {
      if (pdfRootRef.current && pdfRootRef.current.parentNode) {
        pdfRootRef.current.parentNode.removeChild(pdfRootRef.current);
      }
      pdfRootRef.current = null;
    }
  };

  return (
    <div className="fr-card p-5 fr-weekly-wrap">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h3 className="fr-heading" style={{ fontSize: 16, color: "var(--fr-navy)", margin: 0 }}>
          {t("sec_weekly")}{" "}
          <span className="fr-muted" style={{ fontSize: 12, fontWeight: 400 }}>
            ({t("filtered_meta", { n: nLancamentos, v: fmtCurrency(grandTotal) })})
          </span>
        </h3>
        <div className="fr-print-hide flex items-center gap-2 flex-wrap">
          <SupplierSelect value={supplier} onChange={setSupplier} suppliers={supplierOptions} />
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
              <th>{t("th_payment_method")}</th>
              <th style={{ textAlign: "right" }}>{t("th_value")}</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <FragmentWeekly key={g.project}>
                <tr style={{ background: "var(--fr-surface)" }}>
                  <td colSpan={5} style={{ fontWeight: 700, color: "var(--fr-navy)" }}>
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
                      <td colSpan={4} style={{ fontWeight: 700, fontSize: 12, color: "var(--fr-text)" }}>
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
                        <td style={{ fontSize: 12 }}>
                          {s.paymentMethod || ""}
                          {s.cardNumber && (
                            <span style={{ marginLeft: 6, color: "var(--fr-muted)" }}>{fmtCardNumber(s.cardNumber)}</span>
                          )}
                        </td>
                        <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 12 }}>{fmtCurrency(s.total)}</td>
                      </tr>
                    ))}
                  </FragmentWeekly>
                ))}
              </FragmentWeekly>
            ))}
            {groups.length === 0 && (
              <tr><td colSpan={6} className="fr-muted" style={{ textAlign: "center", padding: 24 }}>{t("empty_none")}</td></tr>
            )}
            {groups.length > 0 && (
              <tr style={{ fontWeight: 900, background: "var(--fr-navy)", color: "#fff" }}>
                <td colSpan={5} style={{ color: "#fff" }}>{t("grand_total")}</td>
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
