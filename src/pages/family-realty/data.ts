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

export const ALL_JOBS = "Todas as obras" as const;
export type JobFilter = typeof ALL_JOBS | JobName;

export const STAGES = [
  "Fundação",
  "Estrutura",
  "Elétrica",
  "Hidráulica",
  "Drywall",
  "Acabamento",
] as const;
export type Stage = (typeof STAGES)[number];

// Stage proportions of total budget (sum = 1)
const STAGE_BUDGET_PROP: Record<Stage, number> = {
  "Fundação": 0.12,
  "Estrutura": 0.25,
  "Elétrica": 0.13,
  "Hidráulica": 0.12,
  "Drywall": 0.13,
  "Acabamento": 0.25,
};

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

// Base budgets per job (fixed sequence using rand)
const _budgets: number[] = JOBS.map(() =>
  Math.round(between(280_000, 1_200_000) / 1000) * 1000
);

// Jobs flagged as over-budget, with the stage that drove the overrun
const OVER_BUDGET_DRIVERS: Record<string, { stage: Stage; consumed: number }> = {
  "Merrimack": { stage: "Estrutura", consumed: 1.55 },
  "Lexington MA": { stage: "Hidráulica", consumed: 1.72 },
};

export type StageRow = {
  job: JobName;
  stage: Stage;
  budget: number;
  realizado: number;
};

// Build deterministic stage-level data
export const STAGE_DATA: StageRow[] = [];
JOBS.forEach((job, jIdx) => {
  const totalBudget = _budgets[jIdx];
  const driver = OVER_BUDGET_DRIVERS[job];
  STAGES.forEach((stage) => {
    const stageBudget = Math.round(totalBudget * STAGE_BUDGET_PROP[stage]);
    let consumed: number;
    if (driver && driver.stage === stage) {
      consumed = driver.consumed;
    } else if (driver) {
      // other stages of an over-budget job: moderate
      consumed = between(0.55, 0.92);
    } else {
      consumed = between(0.35, 0.95);
    }
    STAGE_DATA.push({
      job,
      stage,
      budget: stageBudget,
      realizado: Math.round(stageBudget * consumed),
    });
  });
});

export type Job = { name: JobName; budget: number; realizado: number };

// Aggregate per-job from stage data so totals are consistent
export const JOBS_META: Job[] = JOBS.map((name) => {
  const rows = STAGE_DATA.filter((r) => r.job === name);
  return {
    name,
    budget: rows.reduce((s, r) => s + r.budget, 0),
    realizado: rows.reduce((s, r) => s + r.realizado, 0),
  };
});

export type PaymentStatus = "Pago" | "A pagar" | "Em alerta" | "Em atraso";
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
  dueDate?: Date;
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

// ~220 past line items over last 300 days (so monthly spend has ~10 months)
for (let i = 0; i < 220; i++) {
  const isMaterial = rand() < 0.55;
  const supplier = isMaterial ? pick(MATERIAL_SUPPLIERS) : pick(SUB_SUPPLIERS);
  const base = isMaterial ? between(180, 9500) : between(2500, 38000);
  const heavy = rand() < 0.08 ? between(1.5, 3.2) : 1;
  items.push({
    id: `p${i}`,
    date: daysAgo(Math.floor(rand() * 300)),
    job: pick(JOBS),
    supplier,
    type: isMaterial ? "Material" : "Subcontractor",
    stage: pick(STAGES as unknown as Stage[]),
    amount: Math.round(base * heavy),
    status: "Pago",
  });
}

// Upcoming payables over next 90 days
for (let i = 0; i < 36; i++) {
  const isMaterial = rand() < 0.4;
  const supplier = isMaterial ? pick(MATERIAL_SUPPLIERS) : pick(SUB_SUPPLIERS);
  const base = isMaterial ? between(400, 8000) : between(3500, 42000);
  const due = daysAhead(Math.floor(rand() * 75) + 1);
  const status: PaymentStatus = rand() < 0.08 ? "Em alerta" : "A pagar";
  items.push({
    id: `f${i}`,
    date: due,
    dueDate: due,
    job: pick(JOBS),
    supplier,
    type: isMaterial ? "Material" : "Subcontractor",
    stage: pick(STAGES as unknown as Stage[]),
    amount: Math.round(base),
    status,
  });
}

// A handful of overdue items
const OVERDUE_SEED: { supplier: string; type: SupplierType; job: JobName; stage: Stage; amount: number; daysLate: number }[] = [
  { supplier: "Rivera Electric LLC", type: "Subcontractor", job: "Merrimack", stage: "Elétrica", amount: 18450, daysLate: 12 },
  { supplier: "Home Depot", type: "Material", job: "Lexington MA", stage: "Acabamento", amount: 4280, daysLate: 7 },
  { supplier: "Coastal Plumbing Co", type: "Subcontractor", job: "Lexington MA", stage: "Hidráulica", amount: 26900, daysLate: 21 },
  { supplier: "84 Lumber", type: "Material", job: "Brighton", stage: "Estrutura", amount: 9120, daysLate: 3 },
  { supplier: "BayState Drywall", type: "Subcontractor", job: "Putnam Triplex", stage: "Drywall", amount: 14750, daysLate: 5 },
];
OVERDUE_SEED.forEach((o, i) => {
  const due = daysAgo(o.daysLate);
  items.push({
    id: `o${i}`,
    date: due,
    dueDate: due,
    job: o.job,
    supplier: o.supplier,
    type: o.type,
    stage: o.stage,
    amount: o.amount,
    status: "Em atraso",
  });
});

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

const PT_MONTHS_SHORT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export const fmtDayMonth = (d: Date) =>
  `${String(d.getDate()).padStart(2, "0")} ${PT_MONTHS_SHORT[d.getMonth()]}`;

export const fmtMonthYY = (d: Date) => {
  const m = PT_MONTHS_SHORT[d.getMonth()];
  return `${m.charAt(0).toUpperCase() + m.slice(1)}/${String(d.getFullYear()).slice(-2)}`;
};

export type PeriodKey = "week" | "month" | "next12w" | "all" | "custom";

export function filterByPeriod(
  items: CostItem[],
  period: PeriodKey,
  customFrom?: Date | null,
  customTo?: Date | null,
): CostItem[] {
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

export function filterByJob(items: CostItem[], job: JobFilter): CostItem[] {
  return job === ALL_JOBS ? items : items.filter((i) => i.job === job);
}

export function jobsMetaFor(job: JobFilter): Job[] {
  return job === ALL_JOBS ? JOBS_META : JOBS_META.filter((j) => j.name === job);
}

export function stageBreakdown(job: JobFilter): { stage: Stage; budget: number; realizado: number; pct: number }[] {
  const rows = job === ALL_JOBS ? STAGE_DATA : STAGE_DATA.filter((r) => r.job === job);
  return STAGES.map((s) => {
    const stageRows = rows.filter((r) => r.stage === s);
    const budget = stageRows.reduce((acc, r) => acc + r.budget, 0);
    const realizado = stageRows.reduce((acc, r) => acc + r.realizado, 0);
    const pct = budget > 0 ? (realizado / budget) * 100 : 0;
    return { stage: s, budget, realizado, pct };
  });
}

// Monthly spend for the trailing N months, plus forecast months
export function monthlySpend(items: CostItem[], pastMonths = 10, forecastMonths = 3) {
  const now = new Date(today);
  const buckets: { key: string; date: Date; label: string; value: number; forecast: boolean }[] = [];

  for (let i = pastMonths - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      date: d,
      label: fmtMonthYY(d),
      value: 0,
      forecast: false,
    });
  }
  for (let i = 1; i <= forecastMonths; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    buckets.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      date: d,
      label: fmtMonthYY(d),
      value: 0,
      forecast: true,
    });
  }
  const idx: Record<string, number> = {};
  buckets.forEach((b, i) => (idx[b.key] = i));

  for (const it of items) {
    const key = `${it.date.getFullYear()}-${it.date.getMonth()}`;
    const i = idx[key];
    if (i === undefined) continue;
    buckets[i].value += it.amount;
  }
  return buckets;
}

export function payables(items: CostItem[]) {
  // non-Pago, sorted by due date with overdue first
  const list = items
    .filter((i) => i.status !== "Pago")
    .map((i) => {
      const due = i.dueDate ?? i.date;
      const diff = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return { ...i, dueDate: due, daysDiff: diff };
    });
  list.sort((a, b) => a.daysDiff - b.daysDiff);
  return list;
}

export function sumUpcoming30d(items: CostItem[]) {
  const now = today.getTime();
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

export function expiringCompliance(days = 30) {
  const end = daysAhead(days).getTime();
  return COMPLIANCE.filter((c) => c.expiresAt.getTime() <= end).length;
}
