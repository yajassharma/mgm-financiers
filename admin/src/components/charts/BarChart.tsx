import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface BarChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  color?: string;
  height?: number;
  formatValue?: (val: number) => string;
  barRadius?: [number, number, number, number];
}

const COLORS = ["#c9a227", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-mgm-navy text-white px-3 py-2 rounded-lg text-xs shadow-dropdown">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i}>{p.value?.toLocaleString()}</p>
      ))}
    </div>
  );
};

export default function BarChart({
  data,
  xKey,
  yKey,
  color,
  height = 280,
  formatValue,
  barRadius = [6, 6, 0, 0],
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBar data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf1" vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 11, fill: "#6b7280" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#6b7280" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatValue}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey={yKey} radius={barRadius} maxBarSize={40}>
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={color || COLORS[i % COLORS.length]}
            />
          ))}
        </Bar>
      </RechartsBar>
    </ResponsiveContainer>
  );
}
