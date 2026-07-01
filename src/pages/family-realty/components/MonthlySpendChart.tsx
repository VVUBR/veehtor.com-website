import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { monthlySpend, fmtUSD, fmtUSDCompact, type CostItem } from "../data";

export default function MonthlySpendChart({ items }: { items: CostItem[] }) {
  const data = monthlySpend(items, 10, 3);

  return (
    <div className="fr-card p-5 h-full flex flex-col">
      <h3
        className="fr-heading"
        style={{ fontSize: 16, color: "var(--fr-navy)", marginBottom: 4 }}
      >
        Gastos por mês
      </h3>
      <p className="fr-muted" style={{ fontSize: 12, marginBottom: 12 }}>
        Quanto a empresa gasta por mês.
      </p>

      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
            <CartesianGrid vertical={false} stroke="#e3e6ec" />
            <XAxis dataKey="label" stroke="#2c2c2c" fontSize={12} />
            <YAxis
              tickFormatter={(v) => fmtUSDCompact(v as number)}
              stroke="#808080"
              fontSize={12}
            />
            <Tooltip
              formatter={(value: number, _name: string, p: any) => [
                fmtUSD(value),
                p?.payload?.forecast ? "Previsto" : "Realizado",
              ]}
              cursor={{ fill: "rgba(4,28,44,0.05)" }}
              contentStyle={{
                borderRadius: 8,
                borderColor: "#e3e6ec",
                fontFamily: "Lato",
                fontSize: 12,
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((d, i) =>
                d.forecast ? (
                  <Cell
                    key={i}
                    fill="rgba(4,28,44,0.12)"
                    stroke="var(--fr-navy)"
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                  />
                ) : (
                  <Cell key={i} fill="var(--fr-navy)" />
                )
              )}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 mt-2 fr-muted" style={{ fontSize: 11 }}>
        <span className="flex items-center gap-2">
          <span style={{ width: 12, height: 12, background: "var(--fr-navy)", borderRadius: 2 }} />
          Realizado
        </span>
        <span className="flex items-center gap-2">
          <span
            style={{
              width: 12,
              height: 12,
              background: "rgba(4,28,44,0.12)",
              border: "1.5px dashed var(--fr-navy)",
              borderRadius: 2,
            }}
          />
          Previsto
        </span>
      </div>
    </div>
  );
}
