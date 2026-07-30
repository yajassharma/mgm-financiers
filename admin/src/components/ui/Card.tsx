import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingMap = { none: "", sm: "p-4", md: "p-5", lg: "p-6" };

export default function Card({
  children,
  hover = false,
  padding = "md",
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-mgm-border shadow-card ${
        hover ? "hover:shadow-card-hover transition-shadow duration-200 cursor-pointer" : ""
      } ${paddingMap[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
