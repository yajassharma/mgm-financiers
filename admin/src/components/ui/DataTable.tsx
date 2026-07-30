import React, { useState, useMemo } from "react";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: string[];
  onRowClick?: (item: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: React.ReactNode;
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  searchable = false,
  searchPlaceholder = "Search...",
  searchKeys = [],
  onRowClick,
  emptyTitle = "No data found",
  emptyDescription,
  emptyIcon,
  pagination,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filteredData = useMemo(() => {
    let result = [...data];

    if (search && searchKeys.length > 0) {
      const q = search.toLowerCase();
      result = result.filter((item) =>
        searchKeys.some((key) =>
          String(item[key] ?? "")
            .toLowerCase()
            .includes(q)
        )
      );
    }

    if (sortKey) {
      result.sort((a, b) => {
        const aVal = a[sortKey] ?? "";
        const bVal = b[sortKey] ?? "";
        const cmp = String(aVal).localeCompare(String(bVal));
        return sortDir === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [data, search, searchKeys, sortKey, sortDir]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-mgm-border overflow-hidden">
        {searchable && (
          <div className="p-4 border-b border-mgm-border">
            <div className="h-10 shimmer-bg rounded-xl w-64" />
          </div>
        )}
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              {columns.map((_, j) => (
                <div key={j} className="h-4 shimmer-bg rounded flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-mgm-border overflow-hidden">
      {searchable && (
        <div className="p-4 border-b border-mgm-border">
          <div className="relative w-64">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mgm-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-mgm-border rounded-xl outline-none focus:border-mgm-gold focus:ring-2 focus:ring-mgm-gold/10 transition-colors"
            />
          </div>
        </div>
      )}

      {filteredData.length === 0 ? (
        <div className="py-16 text-center">
          {emptyIcon && (
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mx-auto mb-3 text-mgm-muted">
              {emptyIcon}
            </div>
          )}
          <p className="text-sm font-semibold text-mgm-navy">{emptyTitle}</p>
          {emptyDescription && (
            <p className="text-xs text-mgm-muted mt-1">{emptyDescription}</p>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-mgm-border bg-gray-50/50">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 text-left text-[10px] uppercase tracking-wider font-semibold text-mgm-muted ${
                      col.sortable ? "cursor-pointer select-none hover:text-mgm-navy" : ""
                    } ${col.className ?? ""}`}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {col.sortable && sortKey === col.key && (
                        <span className="text-mgm-gold">
                          {sortDir === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, i) => (
                <tr
                  key={i}
                  className={`border-b border-mgm-border last:border-0 transition-colors ${
                    onRowClick
                      ? "cursor-pointer hover:bg-gray-50/80"
                      : ""
                  }`}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-sm text-mgm-navy ${col.className ?? ""}`}
                    >
                      {col.render
                        ? col.render(item)
                        : item[col.key] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-mgm-border">
          <span className="text-xs text-mgm-muted">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-mgm-border text-mgm-navy hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, pagination.totalPages) }).map(
              (_, i) => {
                const start = Math.max(
                  1,
                  Math.min(
                    pagination.page - 2,
                    pagination.totalPages - 4
                  )
                );
                const p = start + i;
                if (p > pagination.totalPages) return null;
                return (
                  <button
                    key={p}
                    onClick={() => pagination.onPageChange(p)}
                    className={`w-8 h-8 text-xs font-medium rounded-lg transition-colors ${
                      p === pagination.page
                        ? "bg-mgm-navy text-white"
                        : "text-mgm-navy hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                );
              }
            )}
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-mgm-border text-mgm-navy hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
