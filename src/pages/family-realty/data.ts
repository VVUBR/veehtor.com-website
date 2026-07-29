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
  supplierCanonical: string;
  type: SupplierType;
  stage: string;
  amount: number;
  status: PaymentStatus;
  dueDate: Date | null;
  paymentStatusRaw: string; // for chart classification ('Paid' etc.)
};

export type PayableItem = {
  id: string;
  supplier: string;
  supplierCanonical: string;
  job: string;
  material: string;
  amount: number;
  invoiceDate: Date | null;
  dueDate: Date | null;
  status: PaymentStatus;
  overdue: boolean;
  documentType: string;
};

export type PayableLine = {
  id: string;
  material: string;
  quantity: number | null;
  unitPrice: number | null;
  amount: number;
};

export type PayableDoc = {
  id: string;              // doc_key
  invoiceNumber: string;
  supplier: string;
  supplierCanonical: string;
  job: string;
  documentType: string;
  invoiceDate: Date | null;
  dueDate: Date | null;    // doc_due_date
  docTotal: number;
  overdue: boolean;
  items: PayableLine[];
};

export type ProjectStatus = "Em andamento" | "Concluida";
export type ProjectStatusFilter = "active" | "finished" | "all";
export type ContractStatusFilter = "active" | "inactive" | "all";

export type ProjectInfo = {
  project: string;
  address: string;
  dateStarted: Date | null;
  dateFinished: Date | null;
  status: ProjectStatus;
  budgetTotal: number;
};


export type UnassignedItem = {
  id: string;
  date: Date | null;
  supplier: string;
  supplierCanonical: string;
  material: string;
  amount: number;
  documentType: string;
  suggestion: string | null;
  projectName: string;
  phase: string;
  description: string;
  missingProject: boolean;
  missingPhase: boolean;
  missingDescription: boolean;
};

export type JobMeta = {
  name: string;
  budget: number;
  realizado: number;
  balance: number;
  pctConsumed: number;
  bankFee: number;
  postSale: number;
  realizadoObra: number;
  balanceObra: number;
  pctConsumedObra: number;
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
  paid: number;
  openAmount: number;
  difference: number;
  pctBilled: number;
  nContracts: number;
  hasProject: boolean;
  hasEstimate: boolean;
  status: "Ativo" | "Inativo";
};

export type InvoicePaidRow = {
  supplierCanonical: string;
  project: string;
  invoiceNumber: string | null;
  docDate: Date | null;
  docTotal: number;
  paymentStatus: string;
  pagoManual: number;
  pago: number;
  situacao: string;
};

export type PaymentRow = {
  paymentId: string;
  paymentDate: Date | null;
  supplierCanonical: string;
  invoiceNumber: string | null;
  projectName: string;
  amount: number;
  paymentMethod: string | null;
  cardNumber: string | null;
  notes: string | null;
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
  status: string; // Ativo | Concluído | Cancelado | ...
};


export type CommittedContracts = {
  total: number;
  byProject: Map<string, number>;
  unassignedAmount: number;
  unassignedCount: number;
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
  paymentMethod: string;
  cardNumber: string | null;
};

export function fmtCardNumber(v: string | null | undefined): string {
  if (!v) return "";
  const digits = String(v).replace(/\D/g, "");
  if (!digits) return String(v);
  return `**** ${digits.slice(-4)}`;
}

// ---------- Compliance ----------
export type ComplianceStatus = string; // 'VIGENTE' | 'VENCE...' | 'VENCIDO' | 'SEM' | 'REVISAR' | 'REVISAO EM BREVE' | 'OK' | etc.

export type SubComplianceRow = {
  subcontractor: string;
  subcontractorCanonical: string;
  activeProjects: string[];
  activeProjectsRaw: string;
  severity: number; // 0..3
  w9Status: ComplianceStatus;
  glStatus: ComplianceStatus;
  wcStatus: ComplianceStatus;
  wcKind: string | null;
  w9FileLink: string | null;
  glFileLink: string | null;
  wcFileLink: string | null;
  lastInvoiceDate: Date | null;
  hasRecentInvoice: boolean;
  hasContract: boolean;
  // Vigente snapshot straight from the view (source of truth for the drill-down).
  w9SignatureDate: Date | null;
  w9ReviewDue: Date | null;
  glExpiration: Date | null;
  wcExpiration: Date | null;
  // Optional identifiers if the view exposes them (used to separate vigente vs histórico).
  w9DocId: string | null;
  glPolicyKey: string | null;
  wcPolicyKey: string | null;
};

export type InsuranceRow = {
  policyKey: string;
  subcontractorCanonical: string;
  policyType: string; // GL / WC / Auto / Umbrella / ...
  insurer: string | null;
  policyNumber: string | null;
  effectiveDate: Date | null;
  expirationDate: Date | null;
  limitOccurrence: number | null;
  limitAggregate: number | null;
  additionalInsured: string | null;
  certificateHolderOk: string | null; // 'SIM' | 'NAO' | null
  kind: string | null;
};

export type W9Row = {
  docId: string;
  subcontractorCanonical: string;
  signatureDate: Date | null;
  w9Revision: string | null;
  taxClassification: string | null;
  reviewDue: Date | null;
};

export function uniqueProjects(raw: string | null | undefined): string[] {
  if (!raw) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of String(raw).split(",")) {
    const v = p.trim();
    if (!v || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

export function complianceSeverityBucket(sev: number): "critical" | "attention" | "ok" {
  if (sev >= 3) return "critical";
  if (sev === 2) return "attention";
  return "ok"; // 0 and 1
}

export function complianceStatusTone(status: string | null | undefined): "red" | "amber" | "green" | "muted" {
  const v = (status || "").toUpperCase().trim();
  if (!v) return "muted";
  if (v === "SEM" || v === "VENCIDO" || v === "REVISAR") return "red";
  if (v.startsWith("VENCE") || v.startsWith("REVISAO") || v.startsWith("REVISÃO")) return "amber";
  if (v === "VIGENTE" || v === "OK") return "green";
  return "muted";
}
