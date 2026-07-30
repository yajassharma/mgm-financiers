import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; label?: string };
  trendDirection?: "up" | "down" | "neutral";
  color?: "default" | "success" | "warning" | "danger" | "info";
}

const colorMap = {
  default: "bg-gray-50 text-mgm-navy",
  success: "bg-emerald-50 text-emerald-600",
  warning: "bg-amber-50 text-amber-600",
  danger: "bg-red-50 text-red-600",
  info: "bg-blue-50 text-blue-600",
};

export default function StatCard({
  label,
  value,
  icon,
  trend,
  trendDirection = "neutral",
  color = "default",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-mgm-border shadow-card p-5 animate-slide-up">
      <div className="flex items-start justify-between mb-3">
        <span className="text-[11px] uppercase tracking-wider font-semibold text-mgm-muted">
          {label}
        </span>
        {icon && (
          <div className={`p-2 rounded-xl ${colorMap[color]}`}>{icon}</div>
        )}
      </div>
      <div className="text-2xl font-bold text-mgm-navy tracking-tight">
        {value}
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-2">
          <span
            className={`text-xs font-semibold ${
              trendDirection === "up"
                ? "text-emerald-600"
                : trendDirection === "down"
                ? "text-red-500"
                : "text-mgm-muted"
            }`}
          >
            {trendDirection === "up" ? "↑" : trendDirection === "down" ? "↓" : "—"}{" "}
            {Math.abs(trend.value)}%
          </span>
          {trend.label && (
            <span className="text-[11px] text-mgm-muted">{trend.label}</span>
          )}
        </div>
      )}
    </div>
  );
}
