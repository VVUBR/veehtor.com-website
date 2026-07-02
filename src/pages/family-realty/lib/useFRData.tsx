import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { frSupabase } from "./frSupabase";
import {
  parseSafeDate,
  normalizeType,
  normalizeStatus,
  type HistoryItem,
  type PayableItem,
  type UnassignedItem,
  type JobMeta,
  type BudgetLine,
  type EstimateBilledRow,
  type ContractRow,
  type Installment,
} from "../data";

const PAGE = 1000;

async function fetchAll<T = Record<string, unknown>>(table: string, select = "*"): Promise<T[]> {
  const out: T[] = [];
  let from = 0;
  while (true) {
    const { data, error } = await frSupabase.from(table).select(select).range(from, from + PAGE - 1);
    if (error) throw new Error(`${table}: ${error.message}`);
    const rows = (data ?? []) as unknown as T[];
    out.push(...rows);
    if (rows.length < PAGE) break;
    from += PAGE;
  }
  return out;
}

type BvaProjectRow = {
  project?: string | null;
  budget?: number | string | null;
  realizado?: number | string | null;
  balance?: number | string | null;
  pct_consumed?: number | string | null;
  date_started?: string | null;
  date_finished?: string | null;
};
type BvaLineRow = {
  project?: string | null;
  phase?: string | null;
  description?: string | null;
  budget?: number | string | null;
  realizado?: number | string | null;
  balance?: number | string | null;
  pct_consumed?: number | string | null;
};
type InvoiceRow = {
  invoice_id?: string;
  supplier?: string | null;
  supplier_canonical?: string | null;
  project_name?: string | null;
  material?: string | null;
  amount?: number | string | null;
  invoice_date?: string | null;
  due_date?: string | null;
  document_type?: string | null;
  payment_status?: string | null;
  overdue?: boolean | null;
  file_link?: string | null;
};
type UnassignedRow = {
  invoice_id?: string;
  supplier?: string | null;
  supplier_canonical?: string | null;
  material?: string | null;
  amount?: number | string | null;
  invoice_date?: string | null;
  document_type?: string | null;
  address_pointer?: string | null;
  file_link?: string | null;
};
type EvbRow = {
  vendor?: string | null;
  project?: string | null;
  estimate?: number | string | null;
  billed?: number | string | null;
  difference?: number | string | null;
  pct_billed?: number | string | null;
};
type HistoryRow = {
  invoice_id?: string | null;
  supplier?: string | null;
  supplier_canonical?: string | null;
  project_name?: string | null;
  phase?: string | null;
  amount?: number | string | null;
  invoice_date?: string | null;
  due_date?: string | null;
  payment_status?: string | null;
  document_type?: string | null;
  type?: string | null;
  file_link?: string | null;
};
type ContractRaw = {
  id?: string | number;
  contract_id?: string | number;
  vendor?: string | null;
  vendor_canonical?: string | null;
  subcontractor?: string | null;
  project_name?: string | null;
  contact_name?: string | null;
  total_value?: number | string | null;
  contract_date?: string | null;
  review_status?: string | null;
  notes?: string | null;
  document_link?: string | null;
  file_link?: string | null;
};
type ContractPaySumRow = {
  contract_id?: string | number;
  schedule_gap?: number | string | null;
};
type DisbursementRow = {
  contract_id?: string | number;
  label?: string | null;
  pct?: number | string | null;
  amount?: number | string | null;
  order?: number | null;
  seq?: number | null;
};

const num = (v: unknown): number => {
  if (v == null || v === "") return 0;
  const n = typeof v === "number" ? v : Number(v);
  return isNaN(n) ? 0 : n;
};

async function loadAll() {
  const [
    bvaProject,
    bvaLine,
    invoices,
    unassigned,
    evb,
    history,
    contracts,
    contractSum,
    disbursement,
  ] = await Promise.all([
    fetchAll<BvaProjectRow>("v_budget_vs_actual_by_project").catch(() => []),
    fetchAll<BvaLineRow>("v_budget_vs_actual").catch(() => []),
    fetchAll<InvoiceRow>("v_invoices_to_pay").catch(() => []),
    fetchAll<UnassignedRow>("v_unassigned_costs").catch(() => []),
    fetchAll<EvbRow>("v_estimate_vs_billed").catch(() => []),
    fetchAll<HistoryRow>("history").catch(() => []),
    fetchAll<ContractRaw>("contracts").catch(() => []),
    fetchAll<ContractPaySumRow>("v_contract_payment_summary").catch(() => []),
    fetchAll<DisbursementRow>("v_disbursement_schedule").catch(() => []),
  ]);

  // -- Jobs (from v_budget_vs_actual_by_project) --
  const jobsMeta: JobMeta[] = bvaProject
    .filter((r) => r.project)
    .map((r) => {
      const ds = parseSafeDate(r.date_started).date;
      const df = parseSafeDate(r.date_finished).date;
      const budget = num(r.budget);
      const realizado = num(r.realizado);
      return {
        name: String(r.project),
        budget,
        realizado,
        balance: r.balance != null ? num(r.balance) : budget - realizado,
        pctConsumed: r.pct_consumed != null ? num(r.pct_consumed) : budget > 0 ? (realizado / budget) * 100 : 0,
        dateStarted: ds,
        dateFinished: df,
        active: !df,
      };
    })
    .sort((a, b) => b.pctConsumed - a.pctConsumed);

  const jobs = jobsMeta.map((j) => j.name);

  // -- Budget lines by project (for stage detail) --
  const budgetLines: BudgetLine[] = bvaLine.map((r) => {
    const phase = (r.phase || "").trim();
    const description = (r.description || "").trim();
    const noBL = phase === "(sem etapa)" || description === "(sem linha de budget)" || !phase;
    return {
      job: String(r.project || ""),
      phase: noBL ? "__NO_BUDGET_LINE__" : phase,
      description: description || phase,
      budget: num(r.budget),
      realizado: num(r.realizado),
      balance: r.balance != null ? num(r.balance) : num(r.budget) - num(r.realizado),
      pctConsumed: r.pct_consumed != null ? num(r.pct_consumed) : num(r.budget) > 0 ? (num(r.realizado) / num(r.budget)) * 100 : 0,
      noBudgetLine: noBL,
    };
  });

  // -- Payables (v_invoices_to_pay) --
  const payables: PayableItem[] = invoices.map((r, i) => {
    const inv = parseSafeDate(r.invoice_date).date;
    const due = parseSafeDate(r.due_date).date;
    const overdue = !!r.overdue;
    const status: "Em atraso" | "A pagar" = overdue ? "Em atraso" : "A pagar";
    return {
      id: String(r.invoice_id ?? `inv-${i}`),
      supplier: r.supplier_canonical || r.supplier || "—",
      job: r.project_name || "",
      material: r.material || "—",
      amount: Math.abs(num(r.amount)),
      invoiceDate: inv,
      dueDate: due,
      status,
      overdue,
      documentType: r.document_type || "",
      fileLink: r.file_link ?? null,
    };
  });

  // -- Unassigned costs --
  const unassignedItems: UnassignedItem[] = unassigned.map((r, i) => ({
    id: String(r.invoice_id ?? `un-${i}`),
    date: parseSafeDate(r.invoice_date).date,
    supplier: r.supplier_canonical || r.supplier || "—",
    material: r.material || "—",
    amount: Math.abs(num(r.amount)),
    documentType: r.document_type || "",
    suggestion: r.address_pointer && r.address_pointer.startsWith("Sugestão IA:")
      ? r.address_pointer.replace(/^Sugestão IA:\s*/, "")
      : null,
    fileLink: r.file_link ?? null,
  }));
  const unassignedTotal = unassignedItems.reduce((s, i) => s + i.amount, 0);

  // -- Estimate vs billed --
  const evbRows: EstimateBilledRow[] = evb.map((r) => ({
    vendor: r.vendor || "—",
    project: r.project || "",
    estimate: num(r.estimate),
    billed: num(r.billed),
    difference: r.difference != null ? num(r.difference) : num(r.estimate) - num(r.billed),
    pctBilled: r.pct_billed != null ? num(r.pct_billed) : num(r.estimate) > 0 ? (num(r.billed) / num(r.estimate)) * 100 : 0,
  }));

  // -- History (line items only) --
  const historyItems: HistoryItem[] = history.map((r, i) => {
    const p = parseSafeDate(r.invoice_date);
    const due = parseSafeDate(r.due_date).date;
    return {
      id: String(r.invoice_id ?? `h-${i}`),
      date: p.date,
      future: p.future,
      job: r.project_name || "",
      supplier: r.supplier_canonical || r.supplier || "—",
      type: normalizeType(r.type),
      stage: r.phase || "—",
      amount: Math.abs(num(r.amount)),
      status: normalizeStatus(r.payment_status, due),
      dueDate: due,
      fileLink: r.file_link ?? null,
    };
  });

  // -- Contracts --
  const gapByContract = new Map<string, number>();
  for (const s of contractSum) {
    if (s.contract_id != null && s.schedule_gap != null)
      gapByContract.set(String(s.contract_id), num(s.schedule_gap));
  }
  const instByContract = new Map<string, Installment[]>();
  for (const d of disbursement) {
    if (d.contract_id == null) continue;
    const key = String(d.contract_id);
    const list = instByContract.get(key) || [];
    list.push({
      label: d.label || "—",
      pct: d.pct != null ? num(d.pct) : null,
      amount: d.amount != null ? num(d.amount) : null,
    });
    instByContract.set(key, list);
  }
  const contractRows: ContractRow[] = contracts.map((c, i) => {
    const cid = String(c.id ?? c.contract_id ?? `c-${i}`);
    return {
      id: cid,
      vendor: c.vendor_canonical || c.vendor || c.subcontractor || "—",
      project: c.project_name || "",
      contactName: c.contact_name || null,
      totalValue: num(c.total_value),
      contractDate: parseSafeDate(c.contract_date).date,
      reviewStatus: c.review_status || null,
      notes: c.notes || null,
      documentLink: c.document_link || c.file_link || null,
      scheduleGap: gapByContract.get(cid) ?? null,
      installments: instByContract.get(cid) || [],
    };
  });

  return {
    jobs,
    jobsMeta,
    budgetLines,
    payables,
    unassignedItems,
    unassignedTotal,
    evbRows,
    historyItems,
    contractRows,
  };
}

type FRData = Awaited<ReturnType<typeof loadAll>>;
type Ctx = { loading: boolean; error: Error | null; data: FRData };

const empty: FRData = {
  jobs: [], jobsMeta: [], budgetLines: [], payables: [], unassignedItems: [],
  unassignedTotal: 0, evbRows: [], historyItems: [], contractRows: [],
};

const FRDataContext = createContext<Ctx | null>(null);

export function FRDataProvider({ children }: { children: ReactNode }) {
  const q = useQuery({
    queryKey: ["fr-real-data-v2"],
    queryFn: loadAll,
    staleTime: 5 * 60_000,
    retry: 1,
  });
  return (
    <FRDataContext.Provider value={{ loading: q.isLoading, error: (q.error as Error) ?? null, data: q.data ?? empty }}>
      {children}
    </FRDataContext.Provider>
  );
}

export function useFRData() {
  const v = useContext(FRDataContext);
  if (!v) throw new Error("useFRData must be inside FRDataProvider");
  return v;
}
