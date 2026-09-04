import { useI18n, fmtCurrency } from "../lib/i18n";
import type { ProfitRow } from "../data";
import KpiCard from "./KpiCard";

const fmtPct = (v: number | null) => (v == null ? "—" : `${v.toFixed(1)}%`);
const fmtMoney = (v: number | null) => (v == null ? "—" : fmtCurrency(v));

function Line({ label, value, strong, color }: { label: string; value: string; strong?: boolean; color?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4" style={{ padding: "6px 0", borderBottom: "1px solid var(--fr-border)" }}>
      <span className="fr-muted" style={{ fontSize: 13 }}>{label}</span>
      <span style={{
        fontSize: 13, fontWeight: strong ? 900 : 700,
        fontFamily: strong ? "Roboto" : "Lato",
        color: color ?? "var(--fr-navy)", fontVariantNumeric: "tabular-nums", textAlign: "right",
      }}>
        {value}
      </span>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="fr-card p-5">
      <h3 className="fr-heading" style={{ fontSize: 16, color: "var(--fr-navy)", marginBottom: 8 }}>{title}</h3>
      {children}
    </div>
  );
}

function profitColor(lucro: number | null) {
  if (lucro == null) return "var(--fr-navy)";
  return lucro >= 0 ? "var(--fr-green)" : "var(--fr-red)";
}

function hasSaleData(p: ProfitRow) {
  return p.actualSalePrice != null || p.expectedSalePrice != null;
}

function SingleProject({ p }: { p: ProfitRow }) {
  const { t } = useI18n();

  if (!hasSaleData(p)) {
    return (
      <div className="fr-card p-5">
        <h3 className="fr-heading" style={{ fontSize: 16, color: "var(--fr-navy)", marginBottom: 8 }}>{p.project}</h3>
        <p className="fr-muted" style={{ fontSize: 13 }}>{t("profit_no_sale")}</p>
      </div>
    );
  }

  const salePrice = p.actualSalePrice ?? p.expectedSalePrice;
  const priceLabel = p.actualSalePrice != null ? t("profit_price_actual") : t("profit_price_expected");
  const lucroTone = p.lucro == null ? "default" : p.lucro >= 0 ? "green" : "red";

  return (
    <div className="flex flex-col gap-4">
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label={t("profit_custo_total")} value={fmtMoney(p.custoTotal)} />
        <KpiCard label={priceLabel} value={fmtMoney(salePrice)} />
        <KpiCard label={t("profit_lucro")} value={fmtMoney(p.lucro)} tone={lucroTone as "green" | "red" | "default"} />
        <KpiCard label={t("profit_margem")} value={fmtPct(p.margemLiquidaPct)} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Block title={t("profit_sec_cost")}>
          <Line label={t("profit_obra_realizado")} value={fmtMoney(p.obraRealizado)} />
          <Line label={t("profit_comprometido")} value={fmtMoney(p.comprometido)} />
          <Line label={t("profit_budget_a_gastar")} value={fmtMoney(p.budgetAGastar)} />
          <Line label={t("profit_obra_projetada")} value={fmtMoney(p.obraProjetada)} />
          <Line label={t("profit_bank_fee")} value={fmtMoney(p.bankFee)} />
          <Line label={t("profit_acquisition")} value={fmtMoney(p.acquisitionCost)} />
          <Line label={t("profit_custo_total")} value={fmtMoney(p.custoTotal)} strong />
          {p.totalSqft != null && (
            <>
              <Line label={t("profit_custo_sqft_obra")} value={fmtMoney(p.custoObraSqft)} />
              <Line label={t("profit_custo_sqft_total")} value={fmtMoney(p.custoTotalSqft)} />
            </>
          )}
        </Block>

        <div className="flex flex-col gap-4">
          <Block title={t("profit_sec_sale")}>
            <Line label={priceLabel} value={fmtMoney(salePrice)} strong />
            <Line label={t("profit_preco_sqft")} value={fmtMoney(p.precoSqft)} />
            <Line label={t("profit_comissao")} value={fmtMoney(p.comissao)} />
            <Line label={t("profit_selling_costs")} value={fmtMoney(p.custosVendaTotal ?? p.sellingCosts)} />
            <Line label={t("profit_receita_liquida")} value={fmtMoney(p.receitaLiquida)} />
            <Line label={t("profit_lucro")} value={fmtMoney(p.lucro)} strong color={profitColor(p.lucro)} />
            <Line label={t("profit_margem")} value={fmtPct(p.margemLiquidaPct)} />
            <Line label={t("profit_roi")} value={fmtPct(p.roiPct)} />
          </Block>

          {p.investorCapital != null && (
            <Block title={t("profit_sec_investor")}>
              <Line label={t("profit_inv_capital")} value={fmtMoney(p.investorCapital)} />
              <Line label={t("profit_inv_pct")} value={fmtPct(p.investorProfitPct)} />
              <Line label={t("profit_inv_profit")} value={fmtMoney(p.lucroInvestidor)} strong color={profitColor(p.lucroInvestidor)} />
              <Line label={t("profit_inv_roi")} value={fmtPct(p.roiInvestidorPct)} />
              {p.monthsToSale != null && (
                <Line label={t("profit_inv_annual")} value={fmtPct(p.retornoAnualInvestidorPct)} />
              )}
            </Block>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProfitSection({
  job,
  profitByProject,
}: {
  job: string;
  profitByProject: Map<string, ProfitRow>;
}) {
  const { t } = useI18n();

  if (job !== "__ALL__") {
    const p = profitByProject.get(job);
    if (!p) {
      return (
        <div className="fr-card p-5">
          <p className="fr-muted" style={{ fontSize: 13 }}>{t("profit_no_sale")}</p>
        </div>
      );
    }
    return <SingleProject p={p} />;
  }

  const rows = [...profitByProject.values()]
    .filter(hasSaleData)
    .sort((a, b) => (b.lucro ?? 0) - (a.lucro ?? 0));

  return (
    <div className="fr-card" style={{ overflow: "hidden" }}>
      <div style={{ padding: "20px 20px 12px" }}>
        <h3 className="fr-heading" style={{ fontSize: 16, color: "var(--fr-navy)" }}>{t("tab_profit")}</h3>
      </div>
      <div style={{ maxHeight: 520, overflowY: "auto" }}>
        <table className="fr-table">
          <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
            <tr>
              <th>{t("job")}</th>
              <th style={{ textAlign: "right" }}>{t("profit_custo_total")}</th>
              <th style={{ textAlign: "right" }}>{t("profit_preco_venda")}</th>
              <th style={{ textAlign: "right" }}>{t("profit_lucro")}</th>
              <th style={{ textAlign: "right" }}>{t("profit_margem")}</th>
              <th style={{ textAlign: "right" }}>{t("profit_roi")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const salePrice = p.actualSalePrice ?? p.expectedSalePrice;
              return (
                <tr key={p.project}>
                  <td style={{ fontWeight: 700, color: "var(--fr-navy)" }}>{p.project}</td>
                  <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtMoney(p.custoTotal)}</td>
                  <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtMoney(salePrice)}</td>
                  <td style={{ textAlign: "right", fontWeight: 900, color: profitColor(p.lucro), fontVariantNumeric: "tabular-nums" }}>
                    {fmtMoney(p.lucro)}
                  </td>
                  <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtPct(p.margemLiquidaPct)}</td>
                  <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtPct(p.roiPct)}</td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="fr-muted" style={{ fontSize: 13, padding: 16 }}>
                  {t("profit_no_data")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
