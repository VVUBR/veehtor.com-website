import { useEffect, useMemo, useState } from "react";
import "./theme.css";
import FRHeader from "./components/FRHeader";
import KpiCard from "./components/KpiCard";
import BudgetVsRealizadoChart from "./components/BudgetVsRealizadoChart";
import DisbursementScheduleChart from "./components/DisbursementScheduleChart";
import StageDonut from "./components/StageDonut";
import CostTable from "./components/CostTable";
import {
  COST_ITEMS,
  JOBS_META,
  countAlerts,
  expiringCompliance,
  filterByPeriod,
  fmtUSD,
  sumUpcoming30d,
  type PeriodKey,
} from "./data";

export default function FamilyRealty() {
  const [period, setPeriod] = useState<PeriodKey>("month");

  useEffect(() => {
    const prev = document.title;
    document.title = "Family Realty — Controle de Custos";
    return () => {
      document.title = prev;
    };
  }, []);

  const filtered = useMemo(() => filterByPeriod(COST_ITEMS, period), [period]);

  const totalBudget = useMemo(
    () => JOBS_META.reduce((s, j) => s + j.budget, 0),
    []
  );
  const totalRealizado = useMemo(
    () => JOBS_META.reduce((s, j) => s + j.realizado, 0),
    []
  );
  const pctConsumed = Math.round((totalRealizado / totalBudget) * 100);

  // Synthetic "vs previous period" variation, deterministic per period
  const variations: Record<PeriodKey, { text: string; good: boolean; dir: "up" | "down" }> = {
    week: { text: "3.2% vs semana anterior", good: true, dir: "down" },
    month: { text: "1.8% vs mês anterior", good: false, dir: "up" },
    next12w: { text: "Plano em linha", good: true, dir: "down" },
    all: { text: "Sob controle no agregado", good: true, dir: "down" },
  };

  const upcoming = useMemo(() => sumUpcoming30d(COST_ITEMS), []);
  const alerts = useMemo(() => countAlerts(COST_ITEMS), []);
  const compl = useMemo(() => expiringCompliance(30), []);

  return (
    <div className="family-realty">
      <FRHeader period={period} onChange={setPeriod} />

      <main className="px-6 py-6 mx-auto" style={{ maxWidth: 1480 }}>
        {/* KPI row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <KpiCard
            label="Budget total (obras ativas)"
            value={fmtUSD(totalBudget)}
            sub={`${JOBS_META.length} obras`}
          />
          <KpiCard
            label="Realizado"
            value={fmtUSD(totalRealizado)}
            sub={`${pctConsumed}% do budget`}
            trend={variations[period]}
          />
          <KpiCard
            label="A desembolsar (próximos 30 dias)"
            value={fmtUSD(upcoming)}
            tone="gold"
          />
          <KpiCard
            label="Pagamentos em alerta"
            value={alerts}
            sub="fora dos termos do contrato"
            tone={alerts > 0 ? "red" : "default"}
          />
          <KpiCard
            label="Compliance a vencer (30 dias)"
            value={compl}
            sub="Insurance / W-9"
            tone={compl > 0 ? "red" : "default"}
          />
        </section>

        {/* Charts row 1 */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          <BudgetVsRealizadoChart />
          <DisbursementScheduleChart items={COST_ITEMS} />
        </section>

        {/* Charts row 2 */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <StageDonut items={COST_ITEMS} />
          <div className="fr-card p-5">
            <h3 className="fr-heading" style={{ fontSize: 16, color: "var(--fr-navy)", marginBottom: 12 }}>
              Compliance a vencer
            </h3>
            <ul style={{ fontSize: 14 }}>
              <li className="flex justify-between py-2" style={{ borderBottom: "1px solid var(--fr-border)" }}>
                <span>Rivera Electric LLC — Insurance</span>
                <span style={{ color: "var(--fr-red)", fontWeight: 700 }}>vence em 11 dias</span>
              </li>
              <li className="flex justify-between py-2" style={{ borderBottom: "1px solid var(--fr-border)" }}>
                <span>Coastal Plumbing Co — W-9</span>
                <span style={{ color: "var(--fr-red)", fontWeight: 700 }}>vence em 22 dias</span>
              </li>
              <li className="flex justify-between py-2">
                <span>Granite State Framing — Insurance</span>
                <span style={{ color: "var(--fr-red)", fontWeight: 700 }}>vence em 28 dias</span>
              </li>
            </ul>
            <p className="fr-muted" style={{ fontSize: 12, marginTop: 12 }}>
              Subcontractors precisam estar com Insurance e W-9 vigentes para liberação de pagamento.
            </p>
          </div>
        </section>

        {/* Table */}
        <section className="mt-6">
          <CostTable items={filtered} />
        </section>

        <p
          className="fr-muted"
          style={{ fontSize: 12, textAlign: "center", marginTop: 32, marginBottom: 16 }}
        >
          Preview visual com dado fictício. A versão final terá dado real das obras e a identidade visual completa da Family Realty.
        </p>
      </main>
    </div>
  );
}
