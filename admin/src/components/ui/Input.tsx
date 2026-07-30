import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  icon,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-[11px] uppercase tracking-wider font-semibold text-mgm-muted">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-mgm-muted">
            {icon}
          </div>
        )}
        <input
          className={`w-full px-4 py-2.5 text-sm bg-white border border-mgm-border rounded-xl outline-none transition-colors
            focus:border-mgm-gold focus:ring-2 focus:ring-mgm-gold/10
            placeholder:text-gray-400
            ${icon ? "pl-10" : ""} ${
            error ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : ""
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
