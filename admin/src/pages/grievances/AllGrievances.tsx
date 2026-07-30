import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGrievancesQuery } from "../../hooks/grievance/query/useGrievances.query";
import DataTable, { type Column } from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import Tabs from "../../components/ui/Tabs";
import PageHeader from "../../components/layout/PageHeader";

const statusTabs = [
  { key: "all", label: "All" },
  { key: "RECEIVED", label: "Received" },
  { key: "IN_REVIEW", label: "In Review" },
  { key: "RESOLVED", label: "Resolved" },
  { key: "CLOSED", label: "Closed" },
];

const statusVariant: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
  RECEIVED: "info",
  IN_REVIEW: "warning",
  PENDING_CUSTOMER: "warning",
  RESOLVED: "success",
  CLOSED: "default",
};

export default function AllGrievances() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");

  const { data, isLoading } = useGrievancesQuery({ page, limit: 15, search: "", status });

  const items = data?.data?.items || [];
  const pageData = data?.data?.pageData;

  const columns: Column<any>[] = [
    {
      key: "grievanceId",
      label: "Grievance ID",
      sortable: true,
      render: (item) => <span className="font-mono text-xs">{item.grievanceId}</span>,
    },
    {
      key: "name",
      label: "Customer",
      sortable: true,
      render: (item) => (
        <div>
          <p className="text-sm font-medium">{item.name}</p>
          <p className="text-[11px] text-mgm-muted">{item.email}</p>
        </div>
      ),
    },
    {
      key: "subject",
      label: "Subject",
      render: (item) => <span className="text-mgm-navy truncate max-w-[200px] block">{item.subject}</span>,
    },
    {
      key: "category",
      label: "Category",
      render: (item) => <span className="text-mgm-muted text-xs">{item.category}</span>,
    },
    {
      key: "priority",
      label: "Priority",
      render: (item) => (
        <Badge
          variant={
            item.priority === "URGENT" || item.priority === "HIGH"
              ? "danger"
              : item.priority === "MEDIUM"
              ? "warning"
              : "default"
          }
          size="sm"
        >
          {item.priority}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <Badge variant={statusVariant[item.status] || "default"} size="sm">
          {item.status?.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (item) => (
        <span className="text-xs text-mgm-muted">
          {new Date(item.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="All Grievances"
        subtitle="Manage and respond to customer complaints"
        breadcrumbs={[{ label: "Grievances" }, { label: "All Grievances" }]}
      />

      <Tabs tabs={statusTabs} active={status} onChange={(k) => { setStatus(k); setPage(1); }} />

      <DataTable
        columns={columns}
        data={items}
        loading={isLoading}
        searchable
        searchPlaceholder="Search by name, ID, or email..."
        searchKeys={["name", "grievanceId", "email", "subject"]}
        onRowClick={(item) => navigate(`/grievances/${item._id}`)}
        emptyTitle="No grievances found"
        emptyDescription="No grievances match your filters."
        pagination={
          pageData
            ? {
                page: pageData.page,
                totalPages: pageData.totalPages,
                total: pageData.total,
                onPageChange: setPage,
              }
            : undefined
        }
      />
    </div>
  );
}
