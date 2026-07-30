import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "gold";
  size?: "sm" | "md";
  dot?: boolean;
}

const variantMap = {
  default: "bg-gray-100 text-gray-700",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
  info: "bg-blue-50 text-blue-700",
  gold: "bg-amber-50 text-amber-800",
};

const dotMap = {
  default: "bg-gray-400",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-blue-500",
  gold: "bg-amber-600",
};

const sizeMap = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-[11px]",
};

export default function Badge({
  children,
  variant = "default",
  size = "sm",
  dot = true,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-wider ${variantMap[variant]} ${sizeMap[size]}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotMap[variant]}`} />
      )}
      {children}
    </span>
  );
}
