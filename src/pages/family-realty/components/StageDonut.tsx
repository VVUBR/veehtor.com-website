import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { realizadoByStage, fmtUSD, type CostItem } from "../data";

const STAGE_COLORS = ["#041C2C", "#EAAA00", "#2E7D52", "#5C7A99", "#B07A12", "#8A9BA8"];

export default function StageDonut({ items }: { items: CostItem[] }) {
  const data = realizadoByStage(items).filter((d) => d.value > 0);
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="fr-card p-5 h-full">
      <h3 className="fr-heading" style={{ fontSize: 16, color: "var(--fr-navy)", marginBottom: 12 }}>
        Realizado por etapa da construção
      </h3>
      <div className="fr-muted" style={{ fontSize: 12, marginBottom: 8 }}>
        Total realizado: <strong style={{ color: "var(--fr-navy)" }}>{fmtUSD(total)}</strong>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={2}>
            {data.map((_, i) => (
              <Cell key={i} fill={STAGE_COLORS[i % STAGE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => fmtUSD(value)}
            contentStyle={{ borderRadius: 8, borderColor: "#e3e6ec", fontFamily: "Lato", fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
