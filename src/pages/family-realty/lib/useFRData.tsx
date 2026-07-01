import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { frSupabase } from "./frSupabase";
import type { CostItem, JobMeta } from "../data";

type HistoryRow = {
  invoice_id: string | null;
  supplier: string | null;
  supplier_canonical: string | null;
  project_name: string | null;
  phase: string | null;
  amount: number | null;
  invoice_date: string | null;
  due_date: string | null;
  payment_status: string | null;
  document_type: string | null;
};

type InvoiceToPay = {
  invoice_id: string;
  supplier: string | null;
  supplier_canonical: string | null;
  project_name: string | null;
  material: string | null;
  amount: number | null;
  invoice_date: string | null;
  due_date: string | null;
  document_type: string | null;
  payment_status: string | null;
  overdue: boolean | null;
};

type EstimateRow = {
  vendor: string | null;
  project: string | null;
  estimate: number | null;
  billed: number | null;
  difference: number | null;
  pct_billed: number | null;
};

const PAGE_SIZE = 1000;

async function fetchAll<T>(table: string, select = "*"): Promise<T[]> {
  const out: T[] = [];
  let from = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data, error } = await frSupabase
      .from(table)
      .select(select)
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    const rows = (data ?? []) as unknown as T[];
    out.push(...rows);
    if (rows.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }
  return out;
}

function toDate(s: string | null | undefined): Date | null {
  if (!s) return null;
  const d = new Date(s + (s.length === 10 ? "T00:00:00" : ""));
  return isNaN(d.getTime()) ? null : d;
}

async function loadAll() {
  const [history, invoices, estimates] = await Promise.all([
    fetchAll<HistoryRow>("history"),
    fetchAll<InvoiceToPay>("v_invoices_to_pay"),
    fetchAll<EstimateRow>("v_estimate_vs_billed"),
  ]);

  // --- Cost items from history ---
  const historyItems: CostItem[] = [];
  history.forEach((r, i) => {
    const d = toDate(r.invoice_date);
    if (!d) return;
    if (!r.project_name || r.amount == null) return;
    historyItems.push({
      id: r.invoice_id ? `h-${r.invoice_id}` : `h-${i}`,
      date: d,
      job: r.project_name,
      supplier: r.supplier_canonical || r.supplier || "—",
      type: r.document_type === "Invoice" ? "Subcontractor" : "Material",
      stage: r.phase || "Sem etapa",
      amount: Math.abs(Number(r.amount)),
      status: "Pago",
    });
  });

  // --- Open payables from v_invoices_to_pay ---
  const payableItems: CostItem[] = [];
  invoices.forEach((r, i) => {
    if (!r.project_name || r.amount == null) return;
    const due = toDate(r.due_date) ?? toDate(r.invoice_date);
    const inv = toDate(r.invoice_date);
    if (!inv) return;
    payableItems.push({
      id: `p-${r.invoice_id ?? i}`,
      date: inv,
      dueDate: due ?? inv,
      job: r.project_name,
      supplier: r.supplier_canonical || r.supplier || "—",
      type: r.document_type === "Invoice" ? "Subcontractor" : "Material",
      stage: "—",
      amount: Math.abs(Number(r.amount)),
      status: r.overdue ? "Em atraso" : "A pagar",
    });
  });

  const costItems = [...historyItems, ...payableItems].sort((a, b) => b.date.getTime() - a.date.getTime());

  // --- Job budgets ---
  const budgetByProject: Record<string, number> = {};
  for (const e of estimates) {
    if (!e.project) continue;
    budgetByProject[e.project] = (budgetByProject[e.project] ?? 0) + (Number(e.estimate) || 0);
  }

  const projectsFromEstimates = Object.keys(budgetByProject);
  const projectsFromHistory = Array.from(new Set(historyItems.map((i) => i.job)));
  const allProjects = Array.from(new Set([...projectsFromEstimates, ...projectsFromHistory])).sort();

  const realizadoByProject: Record<string, number> = {};
  for (const it of historyItems) {
    realizadoByProject[it.job] = (realizadoByProject[it.job] ?? 0) + it.amount;
  }

  const jobsMeta: JobMeta[] = allProjects.map((name) => ({
    name,
    budget: budgetByProject[name] ?? 0,
    realizado: realizadoByProject[name] ?? 0,
  }));

  return {
    costItems,
    payableItems,
    jobs: allProjects,
    jobsMeta,
  };
}

type FRDataValue = {
  loading: boolean;
  error: Error | null;
  jobs: string[];
  jobsMeta: JobMeta[];
  costItems: CostItem[];
  payableItems: CostItem[];
};

const FRDataContext = createContext<FRDataValue | null>(null);

export function FRDataProvider({ children }: { children: ReactNode }) {
  const q = useQuery({
    queryKey: ["fr-real-data"],
    queryFn: loadAll,
    staleTime: 5 * 60_000,
    retry: 1,
  });

  const value: FRDataValue = {
    loading: q.isLoading,
    error: (q.error as Error) ?? null,
    jobs: q.data?.jobs ?? [],
    jobsMeta: q.data?.jobsMeta ?? [],
    costItems: q.data?.costItems ?? [],
    payableItems: q.data?.payableItems ?? [],
  };

  return <FRDataContext.Provider value={value}>{children}</FRDataContext.Provider>;
}

export function useFRData() {
  const v = useContext(FRDataContext);
  if (!v) throw new Error("useFRData must be used inside FRDataProvider");
  return v;
}
