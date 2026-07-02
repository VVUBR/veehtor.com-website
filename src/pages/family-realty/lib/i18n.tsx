import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "pt" | "en";

const DICT: Record<string, { pt: string; en: string }> = {
  // header
  brand: { pt: "FAMILY REALTY", en: "FAMILY REALTY" },
  title: { pt: "Controle de Custos por Obra", en: "Cost Control by Job" },
  job: { pt: "Obra", en: "Job" },
  allJobs: { pt: "Todas as obras", en: "All jobs" },
  unassigned: { pt: "A classificar", en: "Unassigned" },
  period_month: { pt: "Este mês", en: "This month" },
  period_30d: { pt: "Últimos 30 dias", en: "Last 30 days" },
  period_3m: { pt: "Últimos 3 meses", en: "Last 3 months" },
  period_year: { pt: "Este ano", en: "This year" },
  period_all: { pt: "Tudo", en: "All time" },
  period_custom: { pt: "Personalizado", en: "Custom" },
  from: { pt: "De", en: "From" },
  to: { pt: "Até", en: "To" },
  clear: { pt: "Limpar", en: "Clear" },
  exportPdf: { pt: "Exportar PDF", en: "Export PDF" },
  exportCsv: { pt: "Exportar CSV", en: "Export CSV" },
  signOut: { pt: "Sair", en: "Sign out" },

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
