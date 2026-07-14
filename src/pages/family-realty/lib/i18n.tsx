import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "pt" | "en";

const DICT: Record<string, { pt: string; en: string }> = {
  // header
  brand: { pt: "FAMILY REALTY", en: "FAMILY REALTY" },
  title: { pt: "Controle de Custos por Obra", en: "Cost Control by Job" },
  job: { pt: "Obra", en: "Job" },
  allJobs: { pt: "Todas as obras", en: "All jobs" },
  unassigned: { pt: "A classificar", en: "Unassigned" },
  job_status_filter: { pt: "Obras", en: "Jobs" },
  job_status_active: { pt: "Em andamento", en: "In progress" },
  job_status_finished: { pt: "Concluídas", en: "Finished" },
  job_status_all: { pt: "Todas", en: "All" },
  contract_status_filter: { pt: "Status", en: "Status" },
  contract_status_active: { pt: "Ativos", en: "Active" },
  contract_status_inactive: { pt: "Inativos", en: "Inactive" },
  contract_status_all: { pt: "Todos", en: "All" },
  th_invoice_number: { pt: "Nº do documento", en: "Invoice #" },
  th_quantity: { pt: "Qtd", en: "Qty" },
  th_unit_price: { pt: "Preço unit.", en: "Unit price" },
  no_invoice_number: { pt: "sem número", en: "no number" },

  period_month: { pt: "Este mês", en: "This month" },
  period_30d: { pt: "Últimos 30 dias", en: "Last 30 days" },
  period_3m: { pt: "Últimos 3 meses", en: "Last 3 months" },
  period_year: { pt: "Este ano", en: "This year" },
  period_all: { pt: "Tudo", en: "All time" },
  period_custom: { pt: "Personalizado", en: "Custom" },
  from: { pt: "De", en: "From" },
  to: { pt: "Até", en: "To" },
  clear: { pt: "Limpar", en: "Clear" },
  ledger_period_label: { pt: "Período", en: "Period" },
  ledger_period_all: { pt: "Todo o período", en: "All time" },
  ledger_period_30d: { pt: "Últimos 30 dias", en: "Last 30 days" },
  ledger_period_90d: { pt: "Últimos 90 dias", en: "Last 90 days" },
  ledger_period_year: { pt: "Este ano", en: "This year" },
  exportPdf: { pt: "Exportar PDF", en: "Export PDF" },
  exportCsv: { pt: "Exportar CSV", en: "Export CSV" },
  signOut: { pt: "Sair", en: "Sign out" },

  // tabs
  tab_overview: { pt: "Visão geral", en: "Overview" },
  tab_weekly: { pt: "Semanal (contabilidade)", en: "Weekly (accounting)" },
  tab_payables: { pt: "Pagamentos e contratos", en: "Payments & contracts" },
  tab_ledger: { pt: "Lançamentos", en: "Entries" },

  // supplier types
  type_supplier: { pt: "Fornecedor", en: "Supplier" },
  type_subcontractor: { pt: "Subcontratada", en: "Subcontractor" },

  loading: { pt: "Carregando dados do banco…", en: "Loading data…" },
  loadFail: { pt: "Falha ao carregar dados", en: "Failed to load data" },

  // KPIs
  kpi_budget_total: { pt: "Budget total", en: "Total budget" },
  kpi_budget_job: { pt: "Budget da obra", en: "Job budget" },
  kpi_realizado: { pt: "Realizado", en: "Incurred" },
  kpi_topay: { pt: "A pagar (em aberto)", en: "To pay (open)" },
  kpi_overdue: { pt: "Em atraso", en: "Overdue" },
  kpi_unassigned: { pt: "A classificar", en: "Unassigned" },
  n_jobs: { pt: "obras", en: "jobs" },
  n_active: { pt: "ativas", en: "active" },
  of_budget: { pt: "do budget", en: "of budget" },
  includes_unassigned: { pt: "inclui {v} ainda sem obra", en: "includes {v} not yet assigned" },
  invoices: { pt: "faturas", en: "invoices" },
  overdue_invoices: { pt: "faturas vencidas em aberto", en: "overdue invoices" },
  no_job_costs: { pt: "custos ainda sem obra", en: "costs not yet assigned" },

  // sections
  sec_budget_status: { pt: "Status de budget por obra", en: "Budget status by job" },
  sec_stage_detail: { pt: "Detalhe por etapa", en: "Detail by phase" },
  sec_monthly: { pt: "Gastos por mês", en: "Monthly spend" },
  sec_topay: { pt: "A pagar", en: "To pay" },
  sec_contracts: { pt: "Contratos", en: "Contracts" },
  sec_evb: { pt: "Estimate vs Billed", en: "Estimate vs Billed" },
  sec_unassigned: { pt: "A classificar", en: "Unassigned costs" },
  sec_ledger: { pt: "Linha a linha", en: "Line items" },
  sec_weekly: { pt: "Resumo semanal (contabilidade)", en: "Weekly summary (accounting)" },
  weekly_export_pdf: { pt: "PDF para contabilidade", en: "PDF for accounting" },
  no_phase: { pt: "Sem etapa", en: "No phase" },
  no_job_short: { pt: "Sem obra", en: "No job" },
  grand_total: { pt: "Total geral", en: "Grand total" },

  // badges
  within_budget: { pt: "Dentro do budget", en: "Within budget" },
  near_limit: { pt: "Perto do limite", en: "Near limit" },
  over_budget: { pt: "Acima do budget", en: "Over budget" },
  active: { pt: "Ativa", en: "Active" },
  completed: { pt: "Concluída", en: "Completed" },
  since: { pt: "desde", en: "since" },
  monthly_avg: { pt: "média mensal", en: "monthly avg" },
  period_unknown: { pt: "período não informado", en: "period not set" },

  // stage
  th_phase: { pt: "Etapa", en: "Phase" },
  th_budget: { pt: "Budget", en: "Budget" },
  th_realizado: { pt: "Realizado", en: "Incurred" },
  th_balance: { pt: "Saldo", en: "Balance" },
  th_pct: { pt: "% consumido", en: "% used" },
  no_budget_line: { pt: "Sem linha de budget", en: "No budget line" },

  // chart
  chart_projected: { pt: "previsto (média dos últimos 3 meses)", en: "projected (avg of last 3 months)" },

  // payables
  th_supplier: { pt: "Fornecedor", en: "Supplier" },
  th_job: { pt: "Obra", en: "Job" },
  th_material: { pt: "Material", en: "Material" },
  th_value: { pt: "Valor", en: "Amount" },
  th_due: { pt: "Vencimento", en: "Due" },
  th_status: { pt: "Status", en: "Status" },
  th_date: { pt: "Data", en: "Date" },
  th_type: { pt: "Tipo", en: "Type" },
  th_doc: { pt: "Documento", en: "Document" },
  th_suggestion: { pt: "Sugestão", en: "Suggestion" },
  th_estimate: { pt: "Estimate", en: "Estimate" },
  th_billed: { pt: "Billed", en: "Billed" },
  th_diff: { pt: "Diferença", en: "Difference" },
  th_pct_billed: { pt: "% billed", en: "% billed" },
  th_contact: { pt: "Contato", en: "Contact" },
  th_total: { pt: "Total", en: "Total" },
  th_contract_date: { pt: "Data do contrato", en: "Contract date" },
  th_installments: { pt: "Parcelas", en: "Installments" },

  overdue_by: { pt: "Em atraso há {n} dias", en: "Overdue by {n} days" },
  due_in: { pt: "Vence em {n} dias", en: "Due in {n} days" },
  due_today: { pt: "Vence hoje", en: "Due today" },
  no_due: { pt: "Sem vencimento", en: "No due date" },
  future_date: { pt: "data futura", en: "future date" },
  no_project: { pt: "Sem obra definida", en: "No job assigned" },
  view_terms: { pt: "ver condições", en: "view terms" },
  hide_terms: { pt: "ocultar condições", en: "hide terms" },

  cap_evb: {
    pt: "Quando billed passa o estimate, ou o fornecedor cobrou errado, ou houve trabalho extra. A interpretação é de vocês.",
    en: "When billed exceeds estimate, either the supplier overcharged or there was extra work. Interpretation is up to you.",
  },
  cap_unassigned: {
    pt: "Custos capturados ainda sem obra. A confirmação é feita na planilha.",
    en: "Costs captured without a job assignment. Confirmation is done in the spreadsheet.",
  },
  cap_monthly: {
    pt: "Quanto a empresa gasta por mês.",
    en: "How much the company spends per month.",
  },
  cap_date_missing: {
    pt: "{n} lançamentos sem data fora deste recorte ({v})",
    en: "{n} entries with no date outside this filter ({v})",
  },

  empty_none: { pt: "Nenhum registro encontrado.", en: "No records found." },
  page: { pt: "Página", en: "Page" },
  of: { pt: "de", en: "of" },
  prev: { pt: "Anterior", en: "Previous" },
  next: { pt: "Próxima", en: "Next" },

  // status values
  st_paid: { pt: "Pago", en: "Paid" },
  st_topay: { pt: "A pagar", en: "To pay" },
  st_overdue: { pt: "Em atraso", en: "Overdue" },

  // supplier filter
  supplier_filter: { pt: "Filtrar por fornecedor", en: "Filter by supplier" },
  all_suppliers: { pt: "Todos os fornecedores", en: "All suppliers" },

  // stage table
  expand_all: { pt: "Expandir tudo", en: "Expand all" },
  collapse_all: { pt: "Recolher tudo", en: "Collapse all" },

  // monthly chart segments
  seg_realizado: { pt: "Realizado", en: "Realized" },
  seg_compromissos: { pt: "Compromissos", en: "Committed" },
  seg_previsto: { pt: "Previsto", en: "Forecast" },
  seg_total: { pt: "Total", en: "Total" },
  chart_baseline: { pt: "previsto = média dos 3 meses completos anteriores", en: "forecast = avg of last 3 complete months" },

  // committed KPI
  kpi_committed: { pt: "Comprometido em contratos", en: "Committed in contracts" },
  kpi_committed_sub: { pt: "assinado, ainda não faturado", en: "signed, not yet billed" },
  budget_projection: { pt: "Projeção", en: "Projection" },
  budget_committed_remaining: { pt: "Comprometido restante", en: "Committed remaining" },
  committed_no_project: { pt: "Comprometido sem obra definida: {v} ({n} contratos)", en: "Committed with no job assigned: {v} ({n} contracts)" },

  // EvB badges
  badge_no_project: { pt: "Sem obra", en: "No job" },
  badge_no_estimate: { pt: "Sem valor no contrato", en: "No estimate on contract" },
  n_contracts: { pt: "{n} contratos", en: "{n} contracts" },

  // Unassigned chips
  chip_missing_project: { pt: "Sem obra", en: "No job" },
  chip_missing_phase: { pt: "Sem etapa", en: "No phase" },
  chip_missing_description: { pt: "Sem linha de budget", en: "No budget line" },
  unassigned_sub: { pt: "lançamentos sem classificação completa", en: "entries without full classification" },

  // filtered totals header
  filtered_meta: { pt: "{n} lançamentos · {v}", en: "{n} entries · {v}" },

  // weekly extras
  th_payment_method: { pt: "Forma de pagamento", en: "Payment method" },
  th_card: { pt: "Cartão", en: "Card" },

  // compliance
  sec_compliance: { pt: "Compliance dos subcontractors", en: "Subcontractor compliance" },
  compliance_subtitle: {
    pt: "somente subcontractors de obras ativas (com invoice ou contrato)",
    en: "active-project subcontractors only (with invoice or contract)",
  },
  compliance_critical: { pt: "Críticos", en: "Critical" },
  compliance_attention: { pt: "Atenção", en: "Attention" },
  compliance_ok: { pt: "Em dia", en: "Up to date" },
  compliance_search: { pt: "Buscar subcontractor…", en: "Search subcontractor…" },
  compliance_status_all: { pt: "Todos os status", en: "All statuses" },
  compliance_recent_only: { pt: "Somente com invoice recente", en: "Only with recent invoice" },
  compliance_n_subs: { pt: "{n} subcontractors", en: "{n} subcontractors" },
  compliance_filtered_of: { pt: "{n} de {total}", en: "{n} of {total}" },
  compliance_active_projects: { pt: "Obras ativas", en: "Active projects" },
  compliance_last_invoice: { pt: "Último invoice", en: "Last invoice" },
  compliance_contract: { pt: "Contrato", en: "Contract" },
  compliance_isencao_tag: { pt: "isenção", en: "exemption" },
  compliance_isencao_tooltip: {
    pt: "Isenção FL cobre apenas o titular. Se o sub tem funcionários, considere exigir apólice de Workers Comp.",
    en: "FL exemption only covers the named person. If the sub has employees, consider requiring a Workers Comp policy.",
  },
  compliance_vigente: { pt: "Vigente", en: "Current" },
  compliance_historico: { pt: "Histórico", en: "History" },
  compliance_history_toggle: { pt: "Histórico ({n} documentos anteriores)", en: "History ({n} previous documents)" },
  compliance_replaced: { pt: "substituído", en: "replaced" },
  compliance_cert_holder_warn: {
    pt: "certificado não está em nome da Family Realty",
    en: "certificate is not issued to Family Realty",
  },
  compliance_no_vigente: { pt: "sem registro vigente", en: "no current record" },
  compliance_w9: { pt: "W-9", en: "W-9" },
  compliance_gl: { pt: "General Liability", en: "General Liability" },
  compliance_wc: { pt: "Workers Comp", en: "Workers Comp" },
  ins_policy_type: { pt: "Tipo", en: "Type" },
  ins_insurer: { pt: "Seguradora", en: "Insurer" },
  ins_policy_number: { pt: "Nº apólice", en: "Policy #" },
  ins_effective: { pt: "Início", en: "Effective" },
  ins_expiration: { pt: "Expiração", en: "Expiration" },
  ins_limit_occ: { pt: "Limite por ocorrência", en: "Per-occurrence limit" },
  ins_limit_agg: { pt: "Limite agregado", en: "Aggregate limit" },
  ins_additional_insured: { pt: "Additional insured", en: "Additional insured" },
  ins_cert_holder_ok: { pt: "Certificate holder", en: "Certificate holder" },
  w9_signature: { pt: "Data de assinatura", en: "Signature date" },
  w9_revision: { pt: "Revisão", en: "Revision" },
  w9_tax_class: { pt: "Classificação fiscal", en: "Tax classification" },
  w9_review_due: { pt: "Próxima revisão", en: "Review due" },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string, vars?: Record<string, string | number>) => string };
const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "pt";
    return (localStorage.getItem("fr-lang") as Lang) || "pt";
  });
  useEffect(() => {
    localStorage.setItem("fr-lang", lang);
  }, [lang]);
  const t = (k: string, vars?: Record<string, string | number>) => {
    const entry = DICT[k];
    let s = entry ? entry[lang] : k;
    if (vars) for (const [key, val] of Object.entries(vars)) s = s.replace(`{${key}}`, String(val));
    return s;
  };
  return <I18nCtx.Provider value={{ lang, setLang: setLangState, t }}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const c = useContext(I18nCtx);
  if (!c) throw new Error("useI18n must be inside I18nProvider");
  return c;
}

export function fmtCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
export function fmtCurrencyCompact(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(n);
}
export function fmtDateLocale(d: Date | null | undefined, lang: Lang) {
  if (!d) return "—";
  return new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : "en-US", { day: "2-digit", month: "2-digit", year: "2-digit" }).format(d);
}
