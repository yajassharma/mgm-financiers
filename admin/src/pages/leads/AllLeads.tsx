import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLeadsQuery } from "../../hooks/lead/query/useLeads.query";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import PageHeader from "../../components/layout/PageHeader";

const STATUS_MAP: Record<string, { label: string; variant: "default" | "success" | "warning" | "danger" | "info" | "gold" }> = {
  NEW: { label: "New", variant: "info" },
  CONTACTED: { label: "Contacted", variant: "warning" },
  QUALIFIED: { label: "Qualified", variant: "gold" },
  PROPOSAL_SENT: { label: "Proposal Sent", variant: "default" },
  CONVERTED: { label: "Converted", variant: "success" },
  LOST: { label: "Lost", variant: "danger" },
};

export default function AllLeads() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const limit = 12;

  const { data, isLoading } = useLeadsQuery({ page, limit, search, status });
  const leads = data?.data?.items || [];
  const total = data?.data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Loan Leads"
        subtitle="All loan enquiries from the website"
        breadcrumbs={[{ label: "Leads" }, { label: "All Leads" }]}
        action={
          <div className="flex items-center gap-2">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mgm-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by name, phone, email..."
                className="pl-9 pr-4 py-2 bg-gray-50 border border-mgm-border rounded-xl text-sm text-mgm-navy placeholder:text-mgm-muted focus:outline-none focus:border-mgm-gold focus:ring-2 focus:ring-mgm-gold/10 w-64"
              />
            </div>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="px-3 py-2 bg-gray-50 border border-mgm-border rounded-xl text-sm text-mgm-navy focus:outline-none focus:border-mgm-gold"
            >
              <option value="all">All Status</option>
              {Object.entries(STATUS_MAP).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        }
      />

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-mgm-border">
                <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-mgm-muted px-4 py-3">Lead ID</th>
                <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-mgm-muted px-4 py-3">Name</th>
                <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-mgm-muted px-4 py-3">Phone</th>
                <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-mgm-muted px-4 py-3">Loan Type</th>
                <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-mgm-muted px-4 py-3">Amount</th>
                <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-mgm-muted px-4 py-3">Status</th>
                <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-mgm-muted px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-mgm-border last:border-0">
                    <td colSpan={7} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : leads.length > 0 ? (
                leads.map((lead: any) => (
                  <tr
                    key={lead._id}
                    onClick={() => navigate(`/leads/${lead._id}`)}
                    className="border-b border-mgm-border last:border-0 cursor-pointer hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-mono text-mgm-gold font-semibold">{lead.leadId}</td>
                    <td className="px-4 py-3 text-sm font-medium text-mgm-navy">{lead.name}</td>
                    <td className="px-4 py-3 text-sm text-mgm-muted">+91 {lead.phone}</td>
                    <td className="px-4 py-3 text-sm text-mgm-navy">{lead.loanType}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-mgm-navy">
                      {lead.amount ? `₹${lead.amount.toLocaleString()}` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_MAP[lead.status]?.variant || "default"} size="sm">
                        {STATUS_MAP[lead.status]?.label || lead.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-mgm-muted">
                      {new Date(lead.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-sm text-mgm-muted">No leads found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-mgm-muted">
            Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} of {total}
          </p>
          <div className="flex gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-mgm-border text-mgm-navy hover:bg-gray-50 disabled:opacity-40"
            >
              Prev
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                    page === pageNum
                      ? "bg-mgm-navy text-white"
                      : "border border-mgm-border text-mgm-navy hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-mgm-border text-mgm-navy hover:bg-gray-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
