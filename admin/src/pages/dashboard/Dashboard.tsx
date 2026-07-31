import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalyticsOverviewQuery } from "../../hooks/analytics/query/useAnalyticsOverview.query";
import { useAnalyticsTrafficQuery } from "../../hooks/analytics/query/useAnalyticsTraffic.query";
import { useGrievanceStatsQuery } from "../../hooks/grievance/query/useGrievanceStats.query";
import { usePaymentStatsQuery } from "../../hooks/payment/query/usePaymentStats.query";
import { useGrievancesQuery } from "../../hooks/grievance/query/useGrievances.query";
import { useConsentsQuery } from "../../hooks/consent/query/useConsents.query";
import Card from "../../components/ui/Card";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../components/ui/Badge";
import { CardSkeleton, ChartSkeleton } from "../../components/ui/Skeleton";
import AreaChart from "../../components/charts/AreaChart";
import PieChart from "../../components/charts/PieChart";

const TRAFFIC_COLORS = ["#c9a227", "#3b82f6", "#10b981", "#f59e0b"];
const PIE_COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"];

export default function Dashboard() {
  const navigate = useNavigate();
  const [trafficPeriod, setTrafficPeriod] = useState("7d");

  const { data: overview, isLoading: overviewLoading } = useAnalyticsOverviewQuery();
  const { data: traffic, isLoading: trafficLoading } = useAnalyticsTrafficQuery({ period: trafficPeriod });
  const { data: grievanceStats } = useGrievanceStatsQuery();
  const { data: paymentStats } = usePaymentStatsQuery();
  const { data: recentGrievances } = useGrievancesQuery({ page: 1, limit: 5 });
  const { data: recentConsents } = useConsentsQuery({ page: 1, limit: 5 });

  const ov = overview?.data;
  const tr = traffic?.data;
  const gs = grievanceStats?.data;
  const ps = paymentStats?.data;

  const trafficSources = tr?.sources?.length
    ? tr.sources.map((s: any) => ({
        name: (s.source || "Direct").charAt(0).toUpperCase() + (s.source || "Direct").slice(1),
        value: s.sessions as number,
      }))
    : [];

  const deviceData = tr?.devices?.length
    ? tr.devices.map((d: any) => ({
        name: d.device.charAt(0).toUpperCase() + d.device.slice(1),
        value: d.sessions as number,
      }))
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-mgm-navy tracking-tight">Dashboard</h1>
          <p className="text-sm text-mgm-muted mt-0.5">
            Website analytics and operations overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          {["7d", "30d", "90d"].map((p) => (
            <button
              key={p}
              onClick={() => setTrafficPeriod(p)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                trafficPeriod === p
                  ? "bg-mgm-navy text-white"
                  : "bg-white border border-mgm-border text-mgm-muted hover:text-mgm-navy"
              }`}
            >
              {p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : "90 Days"}
            </button>
          ))}
        </div>
      </div>

      {/* GA Notice - only show if backend GA4 is not responding */}
      {!overviewLoading && ov && !ov.ga && (
        <Card className="bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-amber-800">Google Analytics not configured</h3>
              <p className="text-xs text-amber-700 mt-1">
                Connect your GA4 Measurement ID to populate traffic data. Add <code className="bg-amber-100 px-1 rounded">VITE_GA_MEASUREMENT_ID</code> to your environment variables.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewLoading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              label="Total Visitors"
              value={ov?.ga?.totalUsers?.toLocaleString() || "—"}
              color="info"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />
            <StatCard
              label="Page Views"
              value={ov?.ga?.pageViews?.toLocaleString() || "—"}
              color="success"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              }
            />
            <StatCard
              label="Open Grievances"
              value={gs?.open ?? "—"}
              color="warning"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard
              label="Total Revenue"
              value={`₹${(ps?.totalRevenue || 0).toLocaleString()}`}
              color="success"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Traffic Trend */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-mgm-navy">Traffic Trend</h3>
          </div>
          {trafficLoading ? (
            <ChartSkeleton />
          ) : tr?.daily?.length ? (
            <AreaChart
              data={tr.daily}
              xKey="date"
              yKey="visitors"
              yKey2="pageViews"
              color="#c9a227"
              color2="#3b82f6"
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-sm text-mgm-muted">
              No traffic data available
            </div>
          )}
        </Card>

        {/* Traffic Sources */}
        <Card>
          <h3 className="text-sm font-semibold text-mgm-navy mb-4">Traffic Sources</h3>
          {trafficLoading ? (
            <ChartSkeleton />
          ) : trafficSources.length ? (
            <PieChart data={trafficSources} colors={TRAFFIC_COLORS} height={220} innerRadius={50} />
          ) : (
            <div className="h-56 flex items-center justify-center text-sm text-mgm-muted">
              No source data
            </div>
          )}
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Device Breakdown */}
        <Card>
          <h3 className="text-sm font-semibold text-mgm-navy mb-4">Device Breakdown</h3>
          {trafficLoading ? (
            <ChartSkeleton />
          ) : deviceData.length ? (
            <PieChart data={deviceData} colors={PIE_COLORS} height={220} innerRadius={50} />
          ) : (
            <div className="h-56 flex items-center justify-center text-sm text-mgm-muted">
              No device data
            </div>
          )}
        </Card>

        {/* Top Pages */}
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-mgm-navy mb-4">Top Pages</h3>
          {(ov?.ga?.topPages?.length || tr?.topPages?.length) ? (
            <div className="space-y-2">
              {(ov?.ga?.topPages || tr?.topPages || []).slice(0, 5).map((page: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-mgm-border last:border-0">
                  <span className="text-sm text-mgm-navy truncate mr-4">{page.page}</span>
                  <span className="text-xs font-semibold text-mgm-muted whitespace-nowrap">
                    {page.views.toLocaleString()} views
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-sm text-mgm-muted">
              No page data
            </div>
          )}
        </Card>
      </div>

      {/* Operations Overview */}
      <Card>
        <h3 className="text-sm font-semibold text-mgm-navy mb-4">Operations Overview</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => navigate("/grievances/dashboard")}
            className="p-4 rounded-xl border border-mgm-border hover:border-mgm-gold hover:shadow-card-hover transition-all text-left group"
          >
            <p className="text-[10px] uppercase tracking-wider text-mgm-muted font-semibold mb-1">Grievances</p>
            <p className="text-xl font-bold text-mgm-navy">{gs?.total ?? "—"}</p>
            <p className="text-[11px] text-mgm-muted mt-1">{gs?.open ?? 0} open</p>
          </button>
          <button
            onClick={() => navigate("/payments/dashboard")}
            className="p-4 rounded-xl border border-mgm-border hover:border-mgm-gold hover:shadow-card-hover transition-all text-left group"
          >
            <p className="text-[10px] uppercase tracking-wider text-mgm-muted font-semibold mb-1">Payments</p>
            <p className="text-xl font-bold text-mgm-navy">{ps?.successful ?? "—"}</p>
            <p className="text-[11px] text-mgm-muted mt-1">₹{(ps?.totalRevenue || 0).toLocaleString()}</p>
          </button>
          <button
            onClick={() => navigate("/consents")}
            className="p-4 rounded-xl border border-mgm-border hover:border-mgm-gold hover:shadow-card-hover transition-all text-left group"
          >
            <p className="text-[10px] uppercase tracking-wider text-mgm-muted font-semibold mb-1">Consents</p>
            <p className="text-xl font-bold text-mgm-navy">{recentConsents?.data?.pageData?.total ?? "—"}</p>
            <p className="text-[11px] text-mgm-muted mt-1">Total requests</p>
          </button>
          <div className="p-4 rounded-xl border border-mgm-border bg-gray-50/50">
            <p className="text-[10px] uppercase tracking-wider text-mgm-muted font-semibold mb-1">Avg Session</p>
            <p className="text-xl font-bold text-mgm-navy">{ov?.ga?.avgSessionDuration ? `${Math.round(ov.ga.avgSessionDuration)}s` : "—"}</p>
            <p className="text-[11px] text-mgm-muted mt-1">Bounce rate: {ov?.ga?.bounceRate ? `${ov.ga.bounceRate.toFixed(1)}%` : "—"}</p>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Grievances */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-mgm-navy">Recent Grievances</h3>
            <button
              onClick={() => navigate("/grievances")}
              className="text-xs font-medium text-mgm-gold hover:text-mgm-gold/80 transition-colors"
            >
              View all →
            </button>
          </div>
          <div className="space-y-2">
            {recentGrievances?.data?.items?.slice(0, 5).map((g: any) => (
              <div
                key={g._id}
                onClick={() => navigate(`/grievances/${g._id}`)}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border-b border-mgm-border last:border-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-mgm-navy truncate">{g.subject}</p>
                  <p className="text-[11px] text-mgm-muted">{g.name} · {g.grievanceId}</p>
                </div>
                <Badge
                  variant={
                    g.status === "RESOLVED" || g.status === "CLOSED"
                      ? "success"
                      : g.status === "IN_REVIEW"
                      ? "warning"
                      : "info"
                  }
                  size="sm"
                >
                  {g.status?.replace(/_/g, " ")}
                </Badge>
              </div>
            )) || (
              <p className="text-sm text-mgm-muted py-4 text-center">No grievances yet</p>
            )}
          </div>
        </Card>

        {/* Recent Consents */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-mgm-navy">Recent Consents</h3>
            <button
              onClick={() => navigate("/consents")}
              className="text-xs font-medium text-mgm-gold hover:text-mgm-gold/80 transition-colors"
            >
              View all →
            </button>
          </div>
          <div className="space-y-2">
            {recentConsents?.data?.items?.slice(0, 5).map((c: any) => (
              <div
                key={c._id}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border-b border-mgm-border last:border-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-mgm-navy truncate">{c.name}</p>
                  <p className="text-[11px] text-mgm-muted">{c.consentId} · {c.loanPurpose}</p>
                </div>
                <Badge
                  variant={
                    c.status === "CONSENTED"
                      ? "success"
                      : c.status === "EXPIRED"
                      ? "danger"
                      : "info"
                  }
                  size="sm"
                >
                  {c.status}
                </Badge>
              </div>
            )) || (
              <p className="text-sm text-mgm-muted py-4 text-center">No consents yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
