import { useGrievanceStatsQuery } from "../../hooks/grievance/query/useGrievanceStats.query";
import Card from "../../components/ui/Card";
import StatCard from "../../components/ui/StatCard";
import { CardSkeleton, ChartSkeleton } from "../../components/ui/Skeleton";
import PieChart from "../../components/charts/PieChart";
import BarChart from "../../components/charts/BarChart";
import PageHeader from "../../components/layout/PageHeader";

const STATUS_COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#6b7280"];

export default function GrievanceDashboard() {
  const { data: stats, isLoading } = useGrievanceStatsQuery();
  const s = stats?.data;

  const statusDistribution = s
    ? [
        { name: "Open", value: s.open || 0 },
        { name: "In Review", value: s.inReview || 0 },
        { name: "Resolved", value: s.resolved || 0 },
        { name: "Closed", value: s.closed || 0 },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Grievance Dashboard"
        subtitle="Complaint analytics and resolution metrics"
        breadcrumbs={[{ label: "Grievances" }, { label: "Dashboard" }]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Total Grievances" value={s?.total ?? 0} color="info" />
            <StatCard label="Open" value={s?.open ?? 0} color="warning" />
            <StatCard label="Resolved" value={s?.resolved ?? 0} color="success" />
            <StatCard label="Avg Resolution" value={s?.avgResolutionTime ? `${s.avgResolutionTime}d` : "—"} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <h3 className="text-sm font-semibold text-mgm-navy mb-4">Status Distribution</h3>
          {isLoading ? <ChartSkeleton /> : statusDistribution.length ? (
            <PieChart data={statusDistribution} colors={STATUS_COLORS} height={260} />
          ) : (
            <div className="h-64 flex items-center justify-center text-sm text-mgm-muted">No data</div>
          )}
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-mgm-navy mb-4">Weekly Trend</h3>
          {isLoading ? <ChartSkeleton /> : s?.weeklyTrend?.length ? (
            <BarChart data={s.weeklyTrend} xKey="date" yKey="count" height={260} color="#c9a227" />
          ) : (
            <div className="h-64 flex items-center justify-center text-sm text-mgm-muted">No trend data</div>
          )}
        </Card>
      </div>
    </div>
  );
}
