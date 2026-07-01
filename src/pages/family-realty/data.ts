// Family Realty dashboard — types + pure helpers.
// All data comes from Supabase views/tables (see useFRData).

export const ALL_JOBS = "Todas as obras" as const;
export type JobFilter = typeof ALL_JOBS | string;

export type PaymentStatus = "Pago" | "A pagar" | "Em alerta" | "Em atraso";
export type SupplierType = "Material" | "Subcontractor";

export type CostItem = {
  id: string;
  date: Date;
  job: string;
  supplier: string;
  type: SupplierType;
  stage: string;
  amount: number;
  status: PaymentStatus;
  dueDate?: Date;
};

export type JobMeta = {
  name: string;
  budget: number;      // sum(estimate) from v_estimate_vs_billed
  realizado: number;   // sum(history.amount) for that project
};

export type StageRow = {
  stage: string;
  realizado: number;
  count: number;
  share: number; // share of total realizado for the current scope (0..1)
};

export type PeriodKey = "week" | "month" | "next12w" | "all" | "custom";

// ---------- formatting ----------

export const fmtUSD = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export const fmtUSDCompact = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);

export const fmtDate = (d: Date) =>
  new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" }).format(d);

const PT_MONTHS_SHORT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export const fmtDayMonth = (d: Date) =>
  `${String(d.getDate()).padStart(2, "0")} ${PT_MONTHS_SHORT[d.getMonth()]}`;

export const fmtMonthYY = (d: Date) => {
  const m = PT_MONTHS_SHORT[d.getMonth()];
  return `${m.charAt(0).toUpperCase() + m.slice(1)}/${String(d.getFullYear()).slice(-2)}`;
};

// ---------- date helpers ----------

const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};
const daysAgo = (n: number) => {
  const d = today();
  d.setDate(d.getDate() - n);
  return d;
};
const daysAhead = (n: number) => {
  const d = today();
  d.setDate(d.getDate() + n);
  return d;
};

// ---------- filters ----------

export function filterByJob(items: CostItem[], job: JobFilter): CostItem[] {
  return job === ALL_JOBS ? items : items.filter((i) => i.job === job);
}

export function filterByPeriod(
  items: CostItem[],
  period: PeriodKey,
  customFrom?: Date | null,
  customTo?: Date | null,
): CostItem[] {
  const now = today().getTime();
  switch (period) {
    case "week": {
      const start = daysAgo(7).getTime();
      const end = daysAhead(7).getTime();
      return items.filter((i) => i.date.getTime() >= start && i.date.getTime() <= end);
    }
    case "month": {
      const start = daysAgo(30).getTime();
      const end = daysAhead(30).getTime();
      return items.filter((i) => i.date.getTime() >= start && i.date.getTime() <= end);
    }
    case "next12w": {
      const end = daysAhead(84).getTime();
      return items.filter((i) => i.date.getTime() >= now && i.date.getTime() <= end);
    }
    case "custom": {
      const start = customFrom ? new Date(customFrom).setHours(0, 0, 0, 0) : -Infinity;
      const end = customTo ? new Date(customTo).setHours(23, 59, 59, 999) : Infinity;
      return items.filter((i) => {
        const t = i.date.getTime();
        return t >= start && t <= end;
      });
    }
    case "all":
    default:
      return items;
  }
}

// ---------- aggregations ----------

export function stageBreakdown(items: CostItem[]): StageRow[] {
  const buckets: Record<string, { realizado: number; count: number }> = {};
  for (const it of items) {
    const key = it.stage || "Sem etapa";
    if (!buckets[key]) buckets[key] = { realizado: 0, count: 0 };
    buckets[key].realizado += it.amount;
    buckets[key].count += 1;
  }
  const total = Object.values(buckets).reduce((s, b) => s + b.realizado, 0) || 1;
  return Object.entries(buckets)
    .map(([stage, b]) => ({
      stage,
      realizado: b.realizado,
      count: b.count,
      share: b.realizado / total,
    }))
    .sort((a, b) => b.realizado - a.realizado);
}

export function monthlySpend(items: CostItem[], pastMonths = 10, forecastMonths = 3) {
  const now = today();
  const buckets: { key: string; date: Date; label: string; value: number; forecast: boolean }[] = [];
  for (let i = pastMonths - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, date: d, label: fmtMonthYY(d), value: 0, forecast: false });
  }
  for (let i = 1; i <= forecastMonths; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, date: d, label: fmtMonthYY(d), value: 0, forecast: true });
  }
  const idx: Record<string, number> = {};
  buckets.forEach((b, i) => (idx[b.key] = i));

  // Trailing average for forecast
  for (const it of items) {
    const key = `${it.date.getFullYear()}-${it.date.getMonth()}`;
    const i = idx[key];
    if (i !== undefined && !buckets[i].forecast) buckets[i].value += it.amount;
  }

  const past = buckets.filter((b) => !b.forecast && b.value > 0);
  const avg = past.length ? past.slice(-3).reduce((s, b) => s + b.value, 0) / Math.min(3, past.length) : 0;
  for (const b of buckets) if (b.forecast) b.value = Math.round(avg);

  return buckets;
}

export function payables(items: CostItem[]) {
  const t = today().getTime();
  const list = items
    .filter((i) => i.status !== "Pago")
    .map((i) => {
      const due = i.dueDate ?? i.date;
      const diff = Math.floor((due.getTime() - t) / (1000 * 60 * 60 * 24));
      return { ...i, dueDate: due, daysDiff: diff };
    });
  list.sort((a, b) => a.daysDiff - b.daysDiff);
  return list;
}

export function sumUpcoming30d(items: CostItem[]) {
  const now = today().getTime();
  const end = daysAhead(30).getTime();
  return items
    .filter((i) => {
      if (i.status === "Pago") return false;
      const d = (i.dueDate ?? i.date).getTime();
      return d >= now && d <= end;
    })
    .reduce((s, i) => s + i.amount, 0);
}

export function countAlerts(items: CostItem[]) {
  return items.filter((i) => i.status === "Em alerta" || i.status === "Em atraso").length;
}
