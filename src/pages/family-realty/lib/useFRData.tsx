import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { frSupabase } from "./frSupabase";
import {
  parseSafeDate,
  normalizeType,
  normalizeStatus,
  type HistoryItem,
  type PayableItem,
  type PayableDoc,
  type PayableLine,
  type UnassignedItem,
  type JobMeta,
  type BudgetLine,
  type EstimateBilledRow,
  type ContractRow,
  type Installment,
  type WeeklyCostRow,
  type CommittedContracts,
  type SubComplianceRow,
  type InsuranceRow,
  type W9Row,
  type ProjectInfo,
  type ProjectStatus,
  type InvoicePaidRow,
  type PaymentRow,
  uniqueProjects,
} from "../data";


type WeeklyRow = {
  week_start?: string | null;
  week_end?: string | null;
  project?: string | null;
  phase?: string | null;
  supplier?: string | null;
  cost_type?: string | null;
  total?: number | string | null;
  n_lancamentos?: number | string | null;
  payment_method?: string | null;
  card_number?: string | null;
};

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
  quantity?: number | string | null;
  unit_price?: number | string | null;
  invoice_date?: string | null;
  due_date?: string | null;
  document_type?: string | null;
  payment_status?: string | null;
  overdue?: boolean | null;
  invoice_number?: string | null;
  doc_key?: string | null;
  doc_total?: number | string | null;
  doc_due_date?: string | null;
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
  project_name?: string | null;
  phase?: string | null;
  description?: string | null;
};
type EvbRow = {
  vendor?: string | null;
  project?: string | null;
  estimate?: number | string | null;
  billed?: number | string | null;
  paid?: number | string | null;
  open_amount?: number | string | null;
  difference?: number | string | null;
  pct_billed?: number | string | null;
  n_contracts?: number | string | null;
  status?: string | null;
};
type ProjectRow = {
  project?: string | null;
  address?: string | null;
  date_started?: string | null;
  date_finished?: string | null;
  status?: string | null;
  budget_total?: number | string | null;
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
  status?: string | null;
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
    weekly,
    subCompliance,
    insuranceRaw,
    w9Raw,
    projectsView,
    invoicePaidRaw,
    paymentsRaw,
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
    fetchAll<WeeklyRow>("v_weekly_costs").catch(() => []),
    fetchAll<Record<string, unknown>>("v_sub_compliance").catch(() => []),
    fetchAll<Record<string, unknown>>("insurance").catch(() => []),
    fetchAll<Record<string, unknown>>("w9").catch(() => []),
    fetchAll<ProjectRow>("v_projects").catch(() => []),
    fetchAll<Record<string, unknown>>("v_invoice_paid").catch(() => []),
    fetchAll<Record<string, unknown>>("payments").catch(() => []),
  ]);


  // eslint-disable-next-line no-console
  console.info("[FR] fetch counts", {
    subCompliance: subCompliance.length,
    insurance: insuranceRaw.length,
    w9: w9Raw.length,
  });

  // -- Jobs --
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

  // -- Budget lines --
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

  // -- Payables (line items, kept for legacy consumers) --
  const payables: PayableItem[] = invoices.map((r, i) => {
    const inv = parseSafeDate(r.invoice_date).date;
    const due = parseSafeDate(r.due_date ?? r.doc_due_date).date;
    const overdue = !!r.overdue;
    const status: "Em atraso" | "A pagar" = overdue ? "Em atraso" : "A pagar";
    const canonical = r.supplier_canonical || r.supplier || "";
    return {
      id: String(r.invoice_id ?? `inv-${i}`),
      supplier: canonical || "—",
      supplierCanonical: canonical,
      job: r.project_name || "",
      material: r.material || "—",
      amount: Math.abs(num(r.amount)),
      invoiceDate: inv,
      dueDate: due,
      status,
      overdue,
      documentType: r.document_type || "",
    };
  });

  // -- Payables grouped by document --
  const payableDocsMap = new Map<string, PayableDoc>();
  invoices.forEach((r, i) => {
    const canonical = r.supplier_canonical || r.supplier || "";
    const invoiceNumber = (r.invoice_number || "").trim();
    const docKey = String(r.doc_key ?? invoiceNumber ?? r.invoice_id ?? `doc-${i}`);
    const docDue = parseSafeDate(r.doc_due_date ?? r.due_date).date;
    const line: PayableLine = {
      id: String(r.invoice_id ?? `inv-${i}`),
      material: r.material || "—",
      quantity: r.quantity != null ? num(r.quantity) : null,
      unitPrice: r.unit_price != null ? num(r.unit_price) : null,
      amount: Math.abs(num(r.amount)),
    };
    const existing = payableDocsMap.get(docKey);
    if (existing) {
      existing.items.push(line);
      // Overdue truthy if any line is overdue.
      if (r.overdue) existing.overdue = true;
    } else {
      payableDocsMap.set(docKey, {
        id: docKey,
        invoiceNumber,
        supplier: canonical || "—",
        supplierCanonical: canonical,
        job: r.project_name || "",
        documentType: r.document_type || "",
        invoiceDate: parseSafeDate(r.invoice_date).date,
        dueDate: docDue,
        docTotal: Math.abs(num(r.doc_total ?? r.amount)),
        overdue: !!r.overdue,
        items: [line],
      });
    }
  });
  const payableDocs: PayableDoc[] = [...payableDocsMap.values()];


  // -- Unassigned --
  const unassignedItems: UnassignedItem[] = unassigned.map((r, i) => {
    const projectName = (r.project_name || "").trim();
    const phase = (r.phase || "").trim();
    const description = (r.description || "").trim();
    const canonical = r.supplier_canonical || r.supplier || "";
    return {
      id: String(r.invoice_id ?? `un-${i}`),
      date: parseSafeDate(r.invoice_date).date,
      supplier: canonical || "—",
      supplierCanonical: canonical,
      material: r.material || "—",
      amount: Math.abs(num(r.amount)),
      documentType: r.document_type || "",
      suggestion: r.address_pointer && r.address_pointer.startsWith("Sugestão IA:")
        ? r.address_pointer.replace(/^Sugestão IA:\s*/, "")
        : null,
      projectName,
      phase,
      description,
      missingProject: !projectName,
      missingPhase: !phase,
      missingDescription: !description,
    };
  });
  const unassignedTotal = unassignedItems.reduce((s, i) => s + i.amount, 0);

  // -- EvB --
  const evbRows: EstimateBilledRow[] = evb.map((r) => {
    const hasProject = !!(r.project && String(r.project).trim());
    const hasEstimate = r.estimate != null && String(r.estimate) !== "";
    const estimate = num(r.estimate);
    const billed = num(r.billed);
    const paid = num(r.paid);
    const openAmount = r.open_amount != null ? num(r.open_amount) : billed - paid;
    const rawStatus = (r.status || "").toString().trim();
    const status: "Ativo" | "Inativo" = rawStatus === "Ativo" ? "Ativo" : "Inativo";
    return {
      vendor: r.vendor || "—",
      project: hasProject ? String(r.project) : "",
      estimate,
      billed,
      paid,
      openAmount,
      difference: r.difference != null ? num(r.difference) : estimate - billed,
      pctBilled: r.pct_billed != null ? num(r.pct_billed) : estimate > 0 ? (billed / estimate) * 100 : 0,
      nContracts: r.n_contracts != null ? Number(r.n_contracts) : 1,
      hasProject,
      hasEstimate,
      status,
    };
  });


  // Committed contracts aggregation
  const committed: CommittedContracts = {
    total: 0,
    byProject: new Map(),
    unassignedAmount: 0,
    unassignedCount: 0,
  };
  for (const row of evbRows) {
    if (row.status !== "Ativo") continue;
    if (!row.hasEstimate) continue;
    const remain = Math.max(row.estimate - row.billed, 0);
    if (remain <= 0) continue;
    committed.total += remain;
    if (row.hasProject) {
      committed.byProject.set(row.project, (committed.byProject.get(row.project) || 0) + remain);
    } else {
      committed.unassignedAmount += remain;
      committed.unassignedCount += row.nContracts || 1;
    }
  }

  // -- History --
  const historyItems: HistoryItem[] = history.map((r, i) => {
    const p = parseSafeDate(r.invoice_date);
    const due = parseSafeDate(r.due_date).date;
    const canonical = r.supplier_canonical || r.supplier || "";
    return {
      id: String(r.invoice_id ?? `h-${i}`),
      date: p.date,
      future: p.future,
      job: r.project_name || "",
      supplier: canonical || "—",
      supplierCanonical: canonical,
      type: normalizeType(r.type),
      stage: r.phase || "—",
      amount: Math.abs(num(r.amount)),
      status: normalizeStatus(r.payment_status, due),
      dueDate: due,
      paymentStatusRaw: (r.payment_status || "").trim(),
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
      documentLink: c.document_link || null,
      scheduleGap: gapByContract.get(cid) ?? null,
      installments: instByContract.get(cid) || [],
      status: (c.status || "").toString().trim() || "Ativo",
    };
  });

  // -- Projects (v_projects) --
  const projects: ProjectInfo[] = projectsView
    .filter((p) => p.project)
    .map((p) => {
      const rawStatus = (p.status || "").toString().trim();
      const status: ProjectStatus =
        rawStatus.toLowerCase().startsWith("conclu") ? "Concluida" : "Em andamento";
      return {
        project: String(p.project),
        address: p.address || "",
        dateStarted: parseSafeDate(p.date_started).date,
        dateFinished: parseSafeDate(p.date_finished).date,
        status,
        budgetTotal: num(p.budget_total),
      };
    });
  const projectStatusMap = new Map<string, ProjectStatus>();
  for (const p of projects) projectStatusMap.set(p.project, p.status);


  const weeklyRows: WeeklyCostRow[] = weekly.map((r) => ({
    weekStart: parseSafeDate(r.week_start).date,
    weekEnd: parseSafeDate(r.week_end).date,
    project: r.project || "",
    phase: r.phase || "",
    supplier: r.supplier || "—",
    costType: r.cost_type || "",
    total: num(r.total),
    count: r.n_lancamentos != null ? Number(r.n_lancamentos) : 0,
    paymentMethod: r.payment_method || "",
    cardNumber: r.card_number || null,
  }));

  // -- Compliance --
  const str = (v: unknown): string => (v == null ? "" : String(v));
  const strOrNull = (v: unknown): string | null => {
    const s = v == null ? "" : String(v).trim();
    return s ? s : null;
  };

  const subCompliance_: SubComplianceRow[] = subCompliance.map((r) => {
    const raw = str(r.active_projects);
    return {
      subcontractor: str(r.subcontractor) || "—",
      subcontractorCanonical: str(r.subcontractor_canonical || r.subcontractor),
      activeProjects: uniqueProjects(raw),
      activeProjectsRaw: raw,
      severity: Number(r.severity ?? 0) || 0,
      w9Status: str(r.w9_status),
      glStatus: str(r.gl_status),
      wcStatus: str(r.wc_status),
      wcKind: strOrNull(r.wc_kind),
      w9FileLink: strOrNull(r.w9_file_link),
      glFileLink: strOrNull(r.gl_file_link),
      wcFileLink: strOrNull(r.wc_file_link),
      lastInvoiceDate: parseSafeDate(str(r.last_invoice_date)).date,
      hasRecentInvoice: r.has_recent_invoice === true || r.has_recent_invoice === "true",
      hasContract: r.has_contract === true || r.has_contract === "true",
      w9SignatureDate: parseSafeDate(str(r.w9_signature_date)).date,
      w9ReviewDue: parseSafeDate(str(r.w9_review_due)).date,
      glExpiration: parseSafeDate(str(r.gl_expiration)).date,
      wcExpiration: parseSafeDate(str(r.wc_expiration)).date,
      w9DocId: strOrNull(r.w9_doc_id),
      glPolicyKey: strOrNull(r.gl_policy_key),
      wcPolicyKey: strOrNull(r.wc_policy_key),
    };
  });

  const insuranceBySub = new Map<string, InsuranceRow[]>();
  for (const r of insuranceRaw) {
    const canon = str(r.subcontractor_canonical || r.subcontractor);
    if (!canon) continue;
    const row: InsuranceRow = {
      policyKey: str(r.policy_key || r.id),
      subcontractorCanonical: canon,
      policyType: str(r.policy_type),
      insurer: strOrNull(r.insurer),
      policyNumber: strOrNull(r.policy_number),
      effectiveDate: parseSafeDate(str(r.effective_date)).date,
      expirationDate: parseSafeDate(str(r.expiration_date)).date,
      limitOccurrence: r.limit_occurrence != null ? num(r.limit_occurrence) : null,
      limitAggregate: r.limit_aggregate != null ? num(r.limit_aggregate) : null,
      additionalInsured: strOrNull(r.additional_insured),
      certificateHolderOk: strOrNull(r.certificate_holder_ok),
      kind: strOrNull(r.kind),
    };
    const arr = insuranceBySub.get(canon) || [];
    arr.push(row);
    insuranceBySub.set(canon, arr);
  }
  for (const arr of insuranceBySub.values()) {
    arr.sort((a, b) => (b.expirationDate?.getTime() ?? 0) - (a.expirationDate?.getTime() ?? 0));
  }

  const w9BySub = new Map<string, W9Row[]>();
  for (const r of w9Raw) {
    const canon = str(r.subcontractor_canonical || r.subcontractor);
    if (!canon) continue;
    const row: W9Row = {
      docId: str(r.doc_id || r.id),
      subcontractorCanonical: canon,
      signatureDate: parseSafeDate(str(r.signature_date)).date,
      w9Revision: strOrNull(r.w9_revision),
      taxClassification: strOrNull(r.tax_classification),
      reviewDue: parseSafeDate(str(r.review_due)).date,
    };
    const arr = w9BySub.get(canon) || [];
    arr.push(row);
    w9BySub.set(canon, arr);
  }
  for (const arr of w9BySub.values()) {
    arr.sort((a, b) => (b.signatureDate?.getTime() ?? 0) - (a.signatureDate?.getTime() ?? 0));
  }

  // -- Invoice paid + payments (for EvB drill-down) --
  const invoicePaidBySub = new Map<string, InvoicePaidRow[]>();
  for (const r of invoicePaidRaw) {
    const canon = str(r.supplier_canonical);
    if (!canon) continue;
    const row: InvoicePaidRow = {
      supplierCanonical: canon,
      project: str(r.project),
      invoiceNumber: strOrNull(r.invoice_number),
      docDate: parseSafeDate(str(r.doc_date)).date,
      docTotal: num(r.doc_total),
      paymentStatus: str(r.payment_status),
      pagoManual: num(r.pago_manual),
      pago: num(r.pago),
      situacao: str(r.situacao),
    };
    const arr = invoicePaidBySub.get(canon) || [];
    arr.push(row);
    invoicePaidBySub.set(canon, arr);
  }

  const paymentsBySub = new Map<string, PaymentRow[]>();
  for (const r of paymentsRaw) {
    const canon = str(r.supplier_canonical);
    if (!canon) continue;
    const row: PaymentRow = {
      paymentId: str(r.payment_id),
      paymentDate: parseSafeDate(str(r.payment_date)).date,
      supplierCanonical: canon,
      invoiceNumber: strOrNull(r.invoice_number),
      projectName: str(r.project_name),
      amount: num(r.amount),
      paymentMethod: strOrNull(r.payment_method),
      cardNumber: strOrNull(r.card_number),
      notes: strOrNull(r.notes),
    };
    const arr = paymentsBySub.get(canon) || [];
    arr.push(row);
    paymentsBySub.set(canon, arr);
  }

  return {
    jobs,
    jobsMeta,
    budgetLines,
    payables,
    payableDocs,
    unassignedItems,
    unassignedTotal,
    evbRows,
    historyItems,
    contractRows,
    weeklyRows,
    committed,
    subCompliance: subCompliance_,
    insuranceBySub,
    w9BySub,
    projects,
    projectStatusMap,
    invoicePaidBySub,
    paymentsBySub,
  };
}

type FRData = Awaited<ReturnType<typeof loadAll>>;
type Ctx = { loading: boolean; error: Error | null; data: FRData };

const empty: FRData = {
  jobs: [], jobsMeta: [], budgetLines: [], payables: [], payableDocs: [], unassignedItems: [],
  unassignedTotal: 0, evbRows: [], historyItems: [], contractRows: [], weeklyRows: [],
  committed: { total: 0, byProject: new Map(), unassignedAmount: 0, unassignedCount: 0 },
  subCompliance: [], insuranceBySub: new Map(), w9BySub: new Map(),
  projects: [], projectStatusMap: new Map(),
  invoicePaidBySub: new Map(), paymentsBySub: new Map(),
};


const FRDataContext = createContext<Ctx | null>(null);

export function FRDataProvider({ children }: { children: ReactNode }) {
  const q = useQuery({
    queryKey: ["fr-real-data-v5"],
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
