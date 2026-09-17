import "../theme.css";
import KpiCard from "../components/KpiCard";

// TEMPORARY layout-check page (not routed in production). Delete after visual verification.
export default function KpiPreview() {
  return (
    <div className="family-realty">
      <div style={{ padding: 24 }}>
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10 }}>
          <KpiCard label="Budget Total" value="$4,304,820" sub="24 obras (12 em andamento)" />
          <KpiCard label="Realizado" value="$2,755,085" tone="green" sub="64% do budget · inclui $141,276 ainda sem obra" />
          <KpiCard label="Bank Fee" value="$126,412" sub="Financiamento" />
          <KpiCard label="Comprometido" value="$2,987,412" sub="POs e contratos ativos · inclui $84,220 sem obra" />
          <KpiCard label="A Pagar" value="$412,930" tone="gold" sub="38 faturas" />
          <KpiCard label="Em Atraso" value="$61,204" tone="red" sub="6 faturas vencidas" />
          <KpiCard label="Sem Obra" value="$141,276" tone="gold" sub="17 lançamentos · aguardando vínculo" />
        </section>
      </div>
    </div>
  );
}
