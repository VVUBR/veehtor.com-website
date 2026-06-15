import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";
import { JOBS_META, fmtUSD, fmtUSDCompact } from "../data";

export default function BudgetVsRealizadoChart() {
  const data = JOBS_META.map((j) => ({
    name: j.name,
    Budget: j.budget,
    Realizado: j.realizado,
    over: j.realizado > j.budget,
  }));

  return (
    <div className="fr-card p-5 h-full">
      <h3 className="fr-heading" style={{ fontSize: 16, color: "var(--fr-navy)", marginBottom: 12 }}>
        Budget vs Realizado por obra
      </h3>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 20, left: 8, bottom: 0 }}>
          <CartesianGrid horizontal={false} stroke="#e3e6ec" />
          <XAxis type="number" tickFormatter={(v) => fmtUSDCompact(v as number)} stroke="#808080" fontSize={12} />
          <YAxis type="category" dataKey="name" stroke="#2c2c2c" fontSize={12} width={110} />
          <Tooltip
            formatter={(value: number) => fmtUSD(value)}
            cursor={{ fill: "rgba(4,28,44,0.05)" }}
            contentStyle={{ borderRadius: 8, borderColor: "#e3e6ec", fontFamily: "Lato" }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="Budget" fill="#041C2C" radius={[0, 4, 4, 0]} />
          <Bar dataKey="Realizado" radius={[0, 4, 4, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.over ? "#B70200" : "#EAAA00"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
