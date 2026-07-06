import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ReferenceArea } from "recharts";
import { useI18n, fmtCurrency, fmtCurrencyCompact } from "../lib/i18n";
import { today0, type HistoryItem, type JobMeta } from "../data";

function monthKey(y: number, m: number) { return `${y}-${m}`; }
const PT_MONTHS = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
const EN_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

type Row = {
  key: string;
  label: string;
  date: Date;
  realizado: number;
  compromissos: number;
  previsto: number;
  isCurrent: boolean;
  isFuture: boolean;
};

const COLOR_REAL = "#041C2C";
const COLOR_COMP = "#EAAA00";
const COLOR_PREV = "#F7D97C";

function isUnpaid(status: string) {
  const v = status.toLowerCase().trim();
  if (!v) return true;
  return !(v.startsWith("paid") || v.startsWith("pag"));
}

export default function MonthlySpendChart({ items, activeJob }: { items: HistoryItem[]; activeJob: JobMeta | null }) {
  const { t, lang } = useI18n();
  const months = lang === "pt" ? PT_MONTHS : EN_MONTHS;

  const data = useMemo<Row[]>(() => {
    const now = today0();
    const curY = now.getFullYear();
    const curM = now.getMonth();
    const pastMonths = 10;
    const futureMonths = 2;

    const buckets: Row[] = [];
    for (let i = pastMonths - 1; i >= 0; i--) {
      const d = new Date(curY, curM - i, 1);
      buckets.push({
        key: monthKey(d.getFullYear(), d.getMonth()),
        label: `${months[d.getMonth()]}/${String(d.getFullYear()).slice(-2)}`,
        date: d,
        realizado: 0, compromissos: 0, previsto: 0,
        isCurrent: i === 0, isFuture: false,
      });
    }
    for (let i = 1; i <= futureMonths; i++) {
      const d = new Date(curY, curM + i, 1);
      buckets.push({
        key: monthKey(d.getFullYear(), d.getMonth()),
        label: `${months[d.getMonth()]}/${String(d.getFullYear()).slice(-2)}`,
        date: d,
        realizado: 0, compromissos: 0, previsto: 0,
        isCurrent: false, isFuture: true,
      });
    }
    const idx: Record<string, number> = {};
    buckets.forEach((b, i) => (idx[b.key] = i));

    const curMonthStart = new Date(curY, curM, 1).getTime();

    // Realizado: sum by invoice_date month (past + current)
    for (const it of items) {
      if (!it.date) continue;
      const k = monthKey(it.date.getFullYear(), it.date.getMonth());
      const i = idx[k];
      if (i === undefined) continue;
      if (buckets[i].isFuture) continue; // future invoice_date is not realizado
      buckets[i].realizado += it.amount;
    }

    // Compromissos: unpaid grouped by due_date month
    // Current month rule: due_date >= today AND invoice_date < curMonthStart
    // Future months: any unpaid due in that month
    for (const it of items) {
      if (!isUnpaid(it.paymentStatusRaw)) continue;
      if (!it.dueDate) continue;
      const k = monthKey(it.dueDate.getFullYear(), it.dueDate.getMonth());
      const i = idx[k];
      if (i === undefined) continue;
      const b = buckets[i];
      if (b.isFuture) {
        b.compromissos += it.amount;
      } else if (b.isCurrent) {
        if (it.dueDate.getTime() < now.getTime()) continue; // already past-due within current month
        if (!it.date || it.date.getTime() >= curMonthStart) continue; // avoid double-count with realizado
        b.compromissos += it.amount;
      }
      // past months: no compromissos concept
    }

    // Baseline: mean of last 3 COMPLETE months (past only, exclude current)
    const completePast = buckets.filter((b) => !b.isCurrent && !b.isFuture);
    const last3 = completePast.slice(-3);
    const baseline = last3.length
      ? last3.reduce((s, b) => s + b.realizado, 0) / last3.length
      : 0;

    for (const b of buckets) {
      if (b.isCurrent) {
        b.previsto = Math.max(baseline - b.realizado - b.compromissos, 0);
      } else if (b.isFuture) {
        b.previsto = Math.max(baseline - b.compromissos, 0);
      }
    }
    return buckets;
  }, [items, months]);

  // Active-period shading
  let refStart: string | null = null, refEnd: string | null = null;
  if (activeJob?.dateStarted) {
    const s = activeJob.dateStarted;
    const e = activeJob.dateFinished || today0();
    refStart = data.find((b) => b.date.getFullYear() === s.getFullYear() && b.date.getMonth() === s.getMonth())?.label || null;
    refEnd = data.find((b) => b.date.getFullYear() === e.getFullYear() && b.date.getMonth() === e.getMonth())?.label || null;
  }

  interface TooltipPayloadItem { value: number; dataKey: string; color: string; }
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }) => {
    if (!active || !payload || !payload.length) return null;
    const map: Record<string, number> = {};
    for (const p of payload) map[p.dataKey] = p.value || 0;
    const total = (map.realizado || 0) + (map.compromissos || 0) + (map.previsto || 0);
    const line = (color: string, name: string, v: number) => (
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, fontSize: 12, color: "#fff" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 8, height: 8, background: color, display: "inline-block", borderRadius: 2 }} />
          {name}
        </span>
        <span style={{ fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(v)}</span>
      </div>
    );
    return (
      <div style={{ background: "#041C2C", color: "#fff", padding: 10, borderRadius: 8, minWidth: 200, boxShadow: "0 6px 20px rgba(0,0,0,0.3)" }}>
        <div style={{ color: "#EAAA00", fontWeight: 700, fontSize: 12, marginBottom: 6 }}>{label}</div>
        {line(COLOR_REAL, t("seg_realizado"), map.realizado || 0)}
        {line(COLOR_COMP, t("seg_compromissos"), map.compromissos || 0)}
        {line(COLOR_PREV, t("seg_previsto"), map.previsto || 0)}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.2)", marginTop: 6, paddingTop: 6, display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 12 }}>
          <span>{t("seg_total")}</span>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(total)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="fr-card p-5 h-full flex flex-col">
      <h3 className="fr-heading" style={{ fontSize: 16, color: "var(--fr-navy)", marginBottom: 4 }}>
        {t("sec_monthly")}
      </h3>
      <p className="fr-muted" style={{ fontSize: 12, marginBottom: 12 }}>
        {t("cap_monthly")} · <span style={{ fontStyle: "italic" }}>{t("chart_baseline")}</span>
      </p>
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
            <CartesianGrid vertical={false} stroke="#e3e6ec" />
            <XAxis dataKey="label" stroke="#2c2c2c" fontSize={12} />
            <YAxis stroke="#2c2c2c" fontSize={12} tickFormatter={(v) => fmtCurrencyCompact(Number(v))} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(4,28,44,0.06)" }} />
            <Legend
              verticalAlign="top"
              height={30}
              wrapperStyle={{ fontSize: 12, color: "var(--fr-navy)" }}
              payload={[
                { value: t("seg_realizado"), type: "square", color: COLOR_REAL },
                { value: t("seg_compromissos"), type: "square", color: COLOR_COMP },
                { value: t("seg_previsto"), type: "square", color: COLOR_PREV },
              ]}
            />
            {refStart && refEnd && (
              <ReferenceArea x1={refStart} x2={refEnd} fill="#EAAA00" fillOpacity={0.06} />
            )}
            <Bar dataKey="realizado" stackId="m" fill={COLOR_REAL} name={t("seg_realizado")} />
            <Bar dataKey="compromissos" stackId="m" fill={COLOR_COMP} name={t("seg_compromissos")} />
            <Bar dataKey="previsto" stackId="m" fill={COLOR_PREV} name={t("seg_previsto")} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
