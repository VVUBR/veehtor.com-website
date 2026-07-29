export const BANK_FEE_PHASE = "Bank Fee";
export const POST_SALE_PHASE = "Post-Sale";
// Fases que existem como custo real mas nunca tiveram budget.
// Ficam fora do % consumido e do saldo, e entram em cartão próprio.
export const OUT_OF_BUDGET_PHASES = [BANK_FEE_PHASE, POST_SALE_PHASE] as const;
export const isOutOfBudget = (phase?: string | null) =>
  OUT_OF_BUDGET_PHASES.includes((phase ?? "").trim() as typeof OUT_OF_BUDGET_PHASES[number]);
