import { useNavigate } from "react-router-dom";
import { useLeadStatsQuery } from "../../hooks/lead/query/useLeadStats.query";
import { useLeadsQuery } from "../../hooks/lead/query/useLeads.query";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { CardSkeleton } from "../../components/ui/Skeleton";

const STATUS_VARIANT: Record<string, "default" | "success" | "warning" | "danger" | "info" | "gold"> = {
  NEW: "info",
  CONTACTED: "warning",
  QUALIFIED: "gold",
  PROPOSAL_SENT: "default",
  CONVERTED: "success",
  LOST: "danger",
};

const STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  PROPOSAL_SENT: "Proposal Sent",
  CONVERTED: "Converted",
  LOST: "Lost",
};

export default function LeadDashboard() {
  const navigate = useNavigate();
  const { data: stats, isLoading } = useLeadStatsQuery();
  const { data: recentLeads } = useLeadsQuery({ page: 1, limit: 8, search: "", status: "all" });
  const s = stats?.data;

  const loanTypeBreakdown = s?.loanTypeBreakdown || [];
  const employmentBreakdown = s?.employmentBreakdown || [];

  const statusBreakdown = [
    { label: "New", count: s?.newLeads || 0, color: "bg-blue-500" },
    { label: "Contacted", count: s?.contacted || 0, color: "bg-amber-500" },
    { label: "Qualified", count: s?.qualified || 0, color: "bg-purple-500" },
    { label: "Proposal Sent", count: s?.proposalSent || 0, color: "bg-gray-400" },
    { label: "Converted", count: s?.converted || 0, color: "bg-emerald-500" },
    { label: "Lost", count: s?.lost || 0, color: "bg-red-500" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-mgm-navy">Lead Dashboard</h1>
          <p className="text-sm text-mgm-muted mt-0.5">Loan enquiry analytics and pipeline overview</p>
        </div>
        <button
          onClick={() => navigate("/leads")}
          className="px-4 py-2.5 bg-mgm-navy text-white text-sm font-semibold rounded-xl hover:bg-mgm-navy/90 transition-colors"
        >
          View All Leads
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <KpiCard icon="leads" label="Total Leads" value={String(s?.total || 0)} />
            <KpiCard icon="today" label="Today's Leads" value={String(s?.todayCount || 0)} />
            <KpiCard icon="rate" label="Conversion Rate" value={`${s?.conversionRate || 0}%`} />
            <KpiCard icon="money" label="Total Pipeline" value={`₹${(s?.loanTypeBreakdown || []).reduce((a: number, b: any) => a + (b.totalAmount || 0), 0).toLocaleString()}`} />
          </>
        )}
      </div>

      {/* Status + Type Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <h3 className="text-sm font-semibold text-mgm-navy mb-4">Pipeline Status</h3>
          <div className="space-y-3">
            {statusBreakdown.map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                  <span className="text-sm text-mgm-navy">{s.label}</span>
                </div>
                <span className="text-sm font-semibold text-mgm-navy">{s.count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-mgm-navy mb-4">By Loan Type</h3>
          <div className="space-y-3">
            {loanTypeBreakdown.length > 0 ? (
              loanTypeBreakdown.map((t: any) => (
                <div key={t._id || t.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-mgm-gold" />
                    <span className="text-sm text-mgm-navy">{t._id}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-mgm-navy">{t.count}</span>
                    <span className="text-xs text-mgm-muted">₹{(t.totalAmount || 0).toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-mgm-muted">No data yet</p>
            )}
          </div>
        </Card>
      </div>

      {/* Employment Breakdown */}
      {employmentBreakdown.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-mgm-navy mb-4">By Employment Type</h3>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {employmentBreakdown.map((e: any) => (
              <div key={e._id || "unknown"} className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-lg font-bold text-mgm-navy">{e.count}</p>
                <p className="text-xs text-mgm-muted mt-0.5">{e._id || "Unknown"}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent Leads */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-mgm-navy">Recent Leads</h3>
          <button
            onClick={() => navigate("/leads")}
            className="text-xs font-medium text-mgm-gold hover:text-mgm-gold/80 transition-colors"
          >
            View All →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-mgm-border">
                <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-mgm-muted px-3 py-2.5">Lead ID</th>
                <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-mgm-muted px-3 py-2.5">Name</th>
                <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-mgm-muted px-3 py-2.5">Loan Type</th>
                <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-mgm-muted px-3 py-2.5">Amount</th>
                <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-mgm-muted px-3 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads?.data?.items?.slice(0, 8).map((lead: any) => (
                <tr
                  key={lead._id}
                  onClick={() => navigate(`/leads/${lead._id}`)}
                  className="border-b border-mgm-border last:border-0 cursor-pointer hover:bg-gray-50/80 transition-colors"
                >
                  <td className="px-3 py-3 text-sm font-mono text-mgm-gold">{lead.leadId}</td>
                  <td className="px-3 py-3 text-sm font-medium text-mgm-navy">{lead.name}</td>
                  <td className="px-3 py-3 text-sm text-mgm-muted">{lead.loanType}</td>
                  <td className="px-3 py-3 text-sm font-semibold text-mgm-navy">
                    {lead.amount ? `₹${lead.amount.toLocaleString()}` : "—"}
                  </td>
                  <td className="px-3 py-3">
                    <Badge variant={STATUS_VARIANT[lead.status] || "default"} size="sm">
                      {STATUS_LABELS[lead.status] || lead.status}
                    </Badge>
                  </td>
                </tr>
              ))}
              {(!recentLeads?.data?.items || recentLeads.data.items.length === 0) && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-sm text-mgm-muted">No leads yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function KpiCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  const iconBg: Record<string, string> = {
    leads: "bg-blue-50 text-blue-600",
    today: "bg-purple-50 text-purple-600",
    rate: "bg-emerald-50 text-emerald-600",
    money: "bg-amber-50 text-amber-600",
  };
  const iconSvgs: Record<string, React.ReactElement> = {
    leads: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    today: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
    rate: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    money: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v12M8 10h8M8 14h8" />
      </svg>
    ),
  };

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wider font-semibold text-mgm-muted">{label}</p>
          <p className="text-2xl font-bold text-mgm-navy mt-1">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg[icon] || "bg-gray-50 text-gray-600"}`}>
          {iconSvgs[icon] || null}
        </div>
      </div>
    </Card>
  );
}
