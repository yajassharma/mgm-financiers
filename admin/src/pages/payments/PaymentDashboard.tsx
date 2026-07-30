import type React from "react";
import { useNavigate } from "react-router-dom";
import { usePaymentStatsQuery } from "../../hooks/payment/query/usePaymentStats.query";
import { usePaymentsQuery } from "../../hooks/payment/query/usePayments.query";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { CardSkeleton } from "../../components/ui/Skeleton";

export default function PaymentDashboard() {
  const navigate = useNavigate();
  const { data: stats, isLoading } = usePaymentStatsQuery();
  const { data: recentPayments } = usePaymentsQuery({ page: 1, limit: 8, search: "", status: "all" });
  const s = stats?.data;

  const totalRevenue = s?.totalRevenue || 0;
  const successRate = s?.total ? Math.round(((s.success || 0) / s.total) * 100) : 0;
  const todayCount = s?.todayCount || 0;
  const todayRevenue = s?.todayRevenue || 0;

  const statusBreakdown = [
    { label: "Completed", count: s?.success || 0, color: "bg-emerald-500" },
    { label: "Pending", count: s?.pending || 0, color: "bg-amber-500" },
    { label: "Processing", count: s?.processing || 0, color: "bg-blue-500" },
    { label: "Failed", count: (s?.failed || 0) + (s?.expired || 0), color: "bg-red-500" },
    { label: "Refunded", count: s?.refunded || 0, color: "bg-purple-500" },
  ];

  const typeBreakdown = s?.typeBreakdown || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-mgm-navy">Payment Dashboard</h1>
          <p className="text-sm text-mgm-muted mt-0.5">Overview of all payment transactions</p>
        </div>
        <button
          onClick={() => navigate("/payments")}
          className="px-4 py-2.5 bg-mgm-navy text-white text-sm font-semibold rounded-xl hover:bg-mgm-navy/90 transition-colors"
        >
          View All Payments
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <KpiCard icon="revenue" label="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} />
            <KpiCard icon="rate" label="Success Rate" value={`${successRate}%`} />
            <KpiCard icon="txn" label="Today's Transactions" value={String(todayCount)} />
            <KpiCard icon="revenue" label="Today's Revenue" value={`₹${todayRevenue.toLocaleString()}`} />
          </>
        )}
      </div>

      {/* Status + Type Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <h3 className="text-sm font-semibold text-mgm-navy mb-4">Payment Status</h3>
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
          <h3 className="text-sm font-semibold text-mgm-navy mb-4">By Payment Type</h3>
          <div className="space-y-3">
            {typeBreakdown.length > 0 ? (
              typeBreakdown.map((t: any) => (
                <div key={t._id || t.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-mgm-navy" />
                    <span className="text-sm text-mgm-navy">{t._id || t.type}</span>
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

      {/* Recent Transactions */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-mgm-navy">Recent Transactions</h3>
          <button
            onClick={() => navigate("/payments")}
            className="text-xs font-medium text-mgm-gold hover:text-mgm-gold/80 transition-colors"
          >
            View All →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-mgm-border">
                <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-mgm-muted px-3 py-2.5">Order ID</th>
                <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-mgm-muted px-3 py-2.5">Borrower</th>
                <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-mgm-muted px-3 py-2.5">Amount</th>
                <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-mgm-muted px-3 py-2.5">Type</th>
                <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-mgm-muted px-3 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments?.data?.items?.slice(0, 8).map((p: any) => (
                <tr
                  key={p._id}
                  onClick={() => navigate(`/payments/${p._id}`)}
                  className="border-b border-mgm-border last:border-0 cursor-pointer hover:bg-gray-50/80 transition-colors"
                >
                  <td className="px-3 py-3 text-sm font-mono text-mgm-navy">{p.orderId}</td>
                  <td className="px-3 py-3 text-sm text-mgm-navy">{p.customerName}</td>
                  <td className="px-3 py-3 text-sm font-semibold text-mgm-navy">₹{p.amount?.toLocaleString()}</td>
                  <td className="px-3 py-3 text-sm text-mgm-muted">{p.paymentType || "—"}</td>
                  <td className="px-3 py-3">
                    <Badge
                      variant={
                        p.status === "SUCCESS" || p.status === "COMPLETED" ? "success" :
                        p.status === "FAILED" || p.status === "EXPIRED" ? "danger" :
                        p.status === "PROCESSING" ? "info" : "warning"
                      }
                      size="sm"
                    >
                      {p.status}
                    </Badge>
                  </td>
                </tr>
              ))}
              {(!recentPayments?.data?.items || recentPayments.data.items.length === 0) && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-sm text-mgm-muted">No transactions yet</td>
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
    revenue: "bg-emerald-50 text-emerald-600",
    rate: "bg-blue-50 text-blue-600",
    txn: "bg-purple-50 text-purple-600",
  };
  const iconSvgs: Record<string, React.ReactElement> = {
    revenue: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v12M8 10h8M8 14h8" />
      </svg>
    ),
    rate: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    txn: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 10h18" />
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
