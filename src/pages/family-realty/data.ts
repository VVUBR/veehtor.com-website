// Family Realty — pure helpers, types and date guards.

export const ALL_JOBS = "__ALL__" as const;
export const UNASSIGNED_JOB = "__UNASSIGNED__" as const;
export type JobFilter = string;

export type PaymentStatus = "Pago" | "A pagar" | "Em atraso";
export type SupplierType = "Material" | "Subcontractor" | "?";

// Line item — from history table ONLY.
export type HistoryItem = {
  id: string;
  date: Date | null;    // null = missing/out of range
  future: boolean;      // date > today
  job: string;          // '' means unassigned
  supplier: string;
  type: SupplierType;
  stage: string;
  amount: number;
  status: PaymentStatus;
  dueDate: Date | null;
  fileLink?: string | null;
};

export type PayableItem = {
  id: string;
  supplier: string;
  job: string;
  material: string;
  amount: number;
  invoiceDate: Date | null;
  dueDate: Date | null;
  status: PaymentStatus;
  overdue: boolean;
  documentType: string;
  fileLink?: string | null;
};

export type UnassignedItem = {
  id: string;
  date: Date | null;
  supplier: string;
  material: string;
  amount: number;
  documentType: string;
  suggestion: string | null;
  fileLink?: string | null;
};

export type JobMeta = {
  name: string;
  budget: number;
  realizado: number;
  balance: number;
  pctConsumed: number;
  dateStarted: Date | null;
  dateFinished: Date | null;
  active: boolean;
};

export type BudgetLine = {
  job: string;
  phase: string;
  description: string;
  budget: number;
  realizado: number;
  balance: number;
  pctConsumed: number;
  noBudgetLine: boolean;
};

export type StageRow = {
  phase: string;
  budget: number;
  realizado: number;
  balance: number;
  pctConsumed: number;
  noBudgetLine: boolean;
  lines: BudgetLine[];
};

export type EstimateBilledRow = {
  vendor: string;
  project: string;
  estimate: number;
  billed: number;
  difference: number;
  pctBilled: number;
};

export type Installment = {
  label: string;
  pct: number | null;
  amount: number | null;
};

export type ContractRow = {
  id: string;
  vendor: string;
  project: string;
  contactName: string | null;
  totalValue: number;
  contractDate: Date | null;
  reviewStatus: string | null;
  notes: string | null;
  documentLink: string | null;
  scheduleGap: number | null;
  installments: Installment[];
};

export type PeriodKey = "month" | "last30" | "last3m" | "year" | "all" | "custom";

// ---------- date helpers ----------
export const DATE_MIN = new Date("2020-01-01T00:00:00").getTime();
export const DATE_MAX = new Date("2027-12-31T23:59:59").getTime();

export function parseSafeDate(s: string | null | undefined): { date: Date | null; future: boolean } {
  if (!s) return { date: null, future: false };
  const iso = s.length === 10 ? s + "T00:00:00" : s;
  const d = new Date(iso);
  const t = d.getTime();
  if (isNaN(t) || t < DATE_MIN || t > DATE_MAX) return { date: null, future: false };
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return { date: d, future: d.getTime() > today.getTime() };
}

export function today0(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// ---------- period ----------
export function periodRange(
  period: PeriodKey,
  customFrom?: Date | null,
  customTo?: Date | null,
): { start: number; end: number } {
  const now = new Date();
  if (period === "all") return { start: -Infinity, end: Infinity };
  if (period === "custom") {
    const s = customFrom ? new Date(customFrom).setHours(0, 0, 0, 0) : -Infinity;
    const e = customTo ? new Date(customTo).setHours(23, 59, 59, 999) : Infinity;
    return { start: s, end: e };
  }
  if (period === "month") {
    const s = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const e = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).getTime();
    return { start: s, end: e };
  }
  if (period === "last30") {
    const e = new Date(); e.setHours(23, 59, 59, 999);
    const s = new Date(); s.setDate(s.getDate() - 30); s.setHours(0, 0, 0, 0);
    return { start: s.getTime(), end: e.getTime() };
  }
  if (period === "last3m") {
    const e = new Date(); e.setHours(23, 59, 59, 999);
    const s = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()).getTime();
    return { start: s, end: e.getTime() };
  }
  if (period === "year") {
    const s = new Date(now.getFullYear(), 0, 1).getTime();
    const e = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999).getTime();
    return { start: s, end: e };
  }
  return { start: -Infinity, end: Infinity };
}

export function inPeriod(d: Date | null, range: { start: number; end: number }): boolean {
  if (!d) return false;
  const t = d.getTime();
  return t >= range.start && t <= range.end;
}

// ---------- misc ----------
export function normalizeType(s: string | null | undefined): SupplierType {
  const v = (s || "").toLowerCase().trim();
  if (v.startsWith("sub")) return "Subcontractor";
  if (v.startsWith("supp") || v === "material") return "Material";
  return "?";
}

export function normalizeStatus(payment: string | null, due: Date | null): PaymentStatus {
  const v = (payment || "").toLowerCase().trim();
  if (v.startsWith("paid") || v.startsWith("pag")) return "Pago";
  if (due && due.getTime() < today0().getTime()) return "Em atraso";
  return "A pagar";
}

export type WeeklyCostRow = {
  weekStart: Date | null;
  weekEnd: Date | null;
  project: string;
  phase: string;
  supplier: string;
  costType: string;
  total: number;
  count: number;
};
