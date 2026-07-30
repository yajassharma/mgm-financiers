import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface PieChartProps {
  data: Array<{ name: string; value: number }>;
  colors?: string[];
  height?: number;
  innerRadius?: number;
  showLegend?: boolean;
}

const DEFAULT_COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6", "#ec4899"];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const total = payload[0]?.payload?.total || 0;
  const pct = total ? ((payload[0].value / total) * 100).toFixed(1) : 0;
  return (
    <div className="bg-mgm-navy text-white px-3 py-2 rounded-lg text-xs shadow-dropdown">
      <p className="font-semibold">{payload[0].name}</p>
      <p>{payload[0].value?.toLocaleString()} ({pct}%)</p>
    </div>
  );
};

const renderLabel = ({ name, percent }: any) => {
  if (percent < 0.05) return null;
  return `${name} ${(percent * 100).toFixed(0)}%`;
};

export default function PieChart({
  data,
  colors = DEFAULT_COLORS,
  height = 280,
  innerRadius = 60,
  showLegend = true,
}: PieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const enriched = data.map((d) => ({ ...d, total }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPie>
        <Pie
          data={enriched}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={innerRadius + 30}
          dataKey="value"
          stroke="none"
          label={renderLabel}
          labelLine={false}
        >
          {enriched.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        {showLegend && (
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            formatter={(value: string) => (
              <span className="text-xs text-mgm-navy">{value}</span>
            )}
          />
        )}
      </RechartsPie>
    </ResponsiveContainer>
  );
}
