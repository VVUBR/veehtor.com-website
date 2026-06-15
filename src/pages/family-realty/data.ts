// Deterministic fictitious data for Family Realty Holdings dashboard preview.

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260615);
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
const between = (a: number, b: number) => a + rand() * (b - a);

export type JobName =
  | "Melrose"
  | "Barrington NH"
  | "Merrimack"
  | "Putnam Triplex"
  | "Brighton"
  | "Westford MA"
  | "Lexington MA"
  | "Carlisle MA";

export const JOBS: JobName[] = [
  "Melrose",
  "Barrington NH",
  "Merrimack",
  "Putnam Triplex",
  "Brighton",
  "Westford MA",
  "Lexington MA",
  "Carlisle MA",
];

export const STAGES = [
  "Fundação",
  "Estrutura",
  "Elétrica",
  "Hidráulica",
  "Drywall",
  "Acabamento",
] as const;
export type Stage = (typeof STAGES)[number];

export const MATERIAL_SUPPLIERS = [
  "Home Depot",
  "Lowe's",
  "Lansing Building Products",
  "84 Lumber",
];

export const SUB_SUPPLIERS = [
  "Rivera Electric LLC",
  "Coastal Plumbing Co",
  "Granite State Framing",
  "BayState Drywall",
];

export type Job = {
  name: JobName;
  budget: number;
  realizado: number;
};

// Budgets 280k–1.2M, realizado 35%–110% (two jobs intentionally > 100%).
const overBudgetIdx = new Set([2, 6]);
export const JOBS_META: Job[] = JOBS.map((name, i) => {
  const budget = Math.round(between(280_000, 1_200_000) / 1000) * 1000;
  const ratio = overBudgetIdx.has(i)
    ? between(1.01, 1.1)
    : between(0.35, 0.95);
  return { name, budget, realizado: Math.round(budget * ratio) };
});

export type PaymentStatus = "Pago" | "A pagar" | "Em alerta";
export type SupplierType = "Material" | "Subcontractor";

export type CostItem = {
  id: string;
  date: Date;
  job: JobName;
  supplier: string;
  type: SupplierType;
  stage: Stage;
  amount: number;
  status: PaymentStatus;
};

const today = new Date();
today.setHours(0, 0, 0, 0);

function daysAgo(d: number) {
  const dt = new Date(today);
  dt.setDate(dt.getDate() - d);
  return dt;
}
function daysAhead(d: number) {
  const dt = new Date(today);
  dt.setDate(dt.getDate() + d);
  return dt;
}

const items: CostItem[] = [];

// ~150 past line items over last 90 days
for (let i = 0; i < 150; i++) {
  const isMaterial = rand() < 0.55;
  const supplier = isMaterial ? pick(MATERIAL_SUPPLIERS) : pick(SUB_SUPPLIERS);
  // Heavy-tailed amounts; subs heavier than materials
  const base = isMaterial ? between(180, 9500) : between(2500, 38000);
  const heavy = rand() < 0.08 ? between(1.5, 3.2) : 1;
  const status: PaymentStatus = rand() < 0.04 ? "Em alerta" : "Pago";
  items.push({
    id: `p${i}`,
    date: daysAgo(Math.floor(rand() * 90)),
    job: pick(JOBS),
    supplier,
    type: isMaterial ? "Material" : "Subcontractor",
    stage: pick(STAGES as unknown as Stage[]),
    amount: Math.round(base * heavy),
    status,
  });
}

// ~40 future scheduled payments over next 12 weeks, with variability
const weekBias = [1.4, 0.5, 1.0, 1.8, 0.3, 1.1, 0.7, 1.6, 0.4, 1.2, 0.9, 1.0];
for (let i = 0; i < 42; i++) {
  const week = Math.floor(rand() * 12);
  const dayInWeek = Math.floor(rand() * 7);
  const isMaterial = rand() < 0.4;
  const supplier = isMaterial ? pick(MATERIAL_SUPPLIERS) : pick(SUB_SUPPLIERS);
  const base = isMaterial ? between(400, 8000) : between(3500, 42000);
  const amount = Math.round(base * weekBias[week]);
  const status: PaymentStatus = rand() < 0.08 ? "Em alerta" : "A pagar";
  items.push({
    id: `f${i}`,
    date: daysAhead(week * 7 + dayInWeek + 1),
    job: pick(JOBS),
    supplier,
    type: isMaterial ? "Material" : "Subcontractor",
    stage: pick(STAGES as unknown as Stage[]),
    amount,
    status,
  });
}

export const COST_ITEMS: CostItem[] = items.sort(
  (a, b) => b.date.getTime() - a.date.getTime()
);

export type ComplianceItem = {
  supplier: string;
  kind: "Insurance" | "W-9";
  expiresAt: Date;
};

export const COMPLIANCE: ComplianceItem[] = [
  { supplier: "Rivera Electric LLC", kind: "Insurance", expiresAt: daysAhead(11) },
  { supplier: "Coastal Plumbing Co", kind: "W-9", expiresAt: daysAhead(22) },
  { supplier: "Granite State Framing", kind: "Insurance", expiresAt: daysAhead(28) },
];

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

export type PeriodKey = "week" | "month" | "next12w" | "all";

export function filterByPeriod(items: CostItem[], period: PeriodKey): CostItem[] {
  const now = today.getTime();
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
    case "all":
    default:
      return items;
  }
}

// Helpers for charts

export function disbursementByWeek(items: CostItem[]) {
  // Next 12 weeks, by job
  const buckets: { week: string; weekIdx: number; [job: string]: number | string }[] = [];
  for (let w = 0; w < 12; w++) {
    const row: any = { weekIdx: w, week: `S${w + 1}` };
    for (const j of JOBS) row[j] = 0;
    buckets.push(row);
  }
  const now = today.getTime();
  for (const it of items) {
    if (it.status === "Pago") continue;
    const diffDays = Math.floor((it.date.getTime() - now) / (1000 * 60 * 60 * 24));
    if (diffDays < 0 || diffDays >= 84) continue;
    const w = Math.floor(diffDays / 7);
    (buckets[w] as any)[it.job] = ((buckets[w] as any)[it.job] as number) + it.amount;
  }
  return buckets;
}

export function realizadoByStage(items: CostItem[]) {
  const totals: Record<string, number> = {};
  for (const s of STAGES) totals[s] = 0;
  for (const it of items) {
    if (it.status === "Pago") totals[it.stage] += it.amount;
  }
  return STAGES.map((s) => ({ name: s, value: totals[s] }));
}

export function sumUpcoming30d(items: CostItem[]) {
  const now = today.getTime();
  const end = daysAhead(30).getTime();
  return items
    .filter(
      (i) =>
        i.status !== "Pago" &&
        i.date.getTime() >= now &&
        i.date.getTime() <= end
    )
    .reduce((s, i) => s + i.amount, 0);
}

export function countAlerts(items: CostItem[]) {
  return items.filter((i) => i.status === "Em alerta").length;
}

export function expiringCompliance(days = 30) {
  const end = daysAhead(days).getTime();
  return COMPLIANCE.filter((c) => c.expiresAt.getTime() <= end).length;
}
