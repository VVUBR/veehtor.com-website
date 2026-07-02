import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, ReferenceArea } from "recharts";
import { useI18n, fmtCurrency, fmtCurrencyCompact } from "../lib/i18n";
import { today0, type HistoryItem, type JobMeta } from "../data";

function monthKey(d: Date) { return `${d.getFullYear()}-${d.getMonth()}`; }
const PT_MONTHS = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
const EN_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function MonthlySpendChart({ items, activeJob }: { items: HistoryItem[]; activeJob: JobMeta | null }) {
  const { t, lang } = useI18n();
  const months = lang === "pt" ? PT_MONTHS : EN_MONTHS;

  const data = useMemo(() => {
    const now = today0();
    const pastMonths = 10;
    const forecast = 2;
    const buckets: { key: string; label: string; date: Date; value: number; forecast: boolean }[] = [];
    for (let i = pastMonths - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({ key: monthKey(d), label: `${months[d.getMonth()]}/${String(d.getFullYear()).slice(-2)}`, date: d, value: 0, forecast: false });
    }
    for (let i = 1; i <= forecast; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      buckets.push({ key: monthKey(d), label: `${months[d.getMonth()]}/${String(d.getFullYear()).slice(-2)}`, date: d, value: 0, forecast: true });
    }
    const idx: Record<string, number> = {};
    buckets.forEach((b, i) => (idx[b.key] = i));
    for (const it of items) {
      if (!it.date || it.future) continue;
      const i = idx[monthKey(it.date)];
      if (i !== undefined && !buckets[i].forecast) buckets[i].value += it.amount;
    }
    const past = buckets.filter((b) => !b.forecast && b.value > 0);
    const avg = past.length ? past.slice(-3).reduce((s, b) => s + b.value, 0) / Math.min(3, past.length) : 0;
    for (const b of buckets) if (b.forecast) b.value = Math.round(avg);
    return buckets;
  }, [items, months]);

  // Active-period shading indexes
  let refStart: string | null = null, refEnd: string | null = null;
  if (activeJob?.dateStarted) {
    const s = activeJob.dateStarted;
    const e = activeJob.dateFinished || today0();
    refStart = data.find((b) => b.date.getFullYear() === s.getFullYear() && b.date.getMonth() === s.getMonth())?.label || null;
    refEnd = data.find((b) => b.date.getFullYear() === e.getFullYear() && b.date.getMonth() === e.getMonth())?.label || null;
  }

  return (
    <div className="fr-card p-5 h-full flex flex-col">
      <h3 className="fr-heading" style={{ fontSize: 16, color: "var(--fr-navy)", marginBottom: 4 }}>
        {t("sec_monthly")}
      </h3>
      <p className="fr-muted" style={{ fontSize: 12, marginBottom: 12 }}>
        {t("cap_monthly")} · <span style={{ fontStyle: "italic" }}>{t("chart_projected")}</span>
      </p>
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
            <CartesianGrid vertical={false} stroke="#e3e6ec" />
            <XAxis dataKey="label" stroke="#2c2c2c" fontSize={12} />
            <YAxis stroke="#2c2c2c" fontSize={12} tickFormatter={(v) => fmtCurrencyCompact(Number(v))} />
            <Tooltip
              formatter={(v: number) => fmtCurrency(Number(v))}
              contentStyle={{ background: "#041c2c", color: "#fff", border: "none", borderRadius: 8 }}
              labelStyle={{ color: "#EAAA00" }}
            />
            {refStart && refEnd && (
              <ReferenceArea x1={refStart} x2={refEnd} fill="#EAAA00" fillOpacity={0.08} />
            )}
            <Bar dataKey="value">
              {data.map((b, i) => (
                <Cell key={i} fill={b.forecast ? "#EAAA00" : "#041c2c"} fillOpacity={b.forecast ? 0.55 : 1} strokeDasharray={b.forecast ? "4 4" : undefined} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
