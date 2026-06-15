import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { JOBS, disbursementByWeek, fmtUSD, fmtUSDCompact, type CostItem } from "../data";

const PALETTE = [
  "#041C2C",
  "#EAAA00",
  "#2E7D52",
  "#5C7A99",
  "#B07A12",
  "#8A9BA8",
  "#3F5266",
  "#C9A95A",
];

export default function DisbursementScheduleChart({ items }: { items: CostItem[] }) {
  const data = disbursementByWeek(items);

  return (
    <div className="fr-card p-5 h-full">
      <h3 className="fr-heading" style={{ fontSize: 16, color: "var(--fr-navy)", marginBottom: 12 }}>
        Agenda de desembolsos por semana
      </h3>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#e3e6ec" />
          <XAxis dataKey="week" stroke="#808080" fontSize={12} />
          <YAxis tickFormatter={(v) => fmtUSDCompact(v as number)} stroke="#808080" fontSize={12} />
          <Tooltip
            formatter={(value: number) => fmtUSD(value)}
            cursor={{ fill: "rgba(4,28,44,0.05)" }}
            contentStyle={{ borderRadius: 8, borderColor: "#e3e6ec", fontFamily: "Lato", fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {JOBS.map((j, i) => (
            <Bar key={j} dataKey={j} stackId="w" fill={PALETTE[i % PALETTE.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
