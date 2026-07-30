import React from "react";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
}

export default function Select({
  label,
  options,
  placeholder,
  error,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-[11px] uppercase tracking-wider font-semibold text-mgm-muted">
          {label}
        </label>
      )}
      <select
        className={`w-full px-4 py-2.5 text-sm bg-white border border-mgm-border rounded-xl outline-none transition-colors appearance-none
          focus:border-mgm-gold focus:ring-2 focus:ring-mgm-gold/10
          ${error ? "border-red-400" : ""} ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
