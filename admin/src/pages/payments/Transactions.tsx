import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePaymentsQuery } from "../../hooks/payment/query/usePayments.query";
import DataTable, { type Column } from "../../components/ui/DataTable";
import Badge from "../../components/ui/Badge";
import Tabs from "../../components/ui/Tabs";
import PageHeader from "../../components/layout/PageHeader";

const statusTabs = [
  { key: "all", label: "All" },
  { key: "SUCCESS", label: "Completed" },
  { key: "PENDING", label: "Pending" },
  { key: "FAILED", label: "Failed" },
  { key: "EXPIRED", label: "Expired" },
];

export default function Transactions() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");

  const { data, isLoading } = usePaymentsQuery({
    page,
    limit: 15,
    search: "",
    status,
  });

  const items = data?.data?.items || [];
  const pageData = data?.data?.pageData;

  const columns: Column<any>[] = [
    {
      key: "orderId",
      label: "Transaction ID",
      sortable: true,
      render: (item) => (
        <span className="font-mono text-xs">{item.orderId}</span>
      ),
    },
    {
      key: "customerName",
      label: "Customer",
      sortable: true,
      render: (item) => (
        <div>
          <p className="text-sm font-medium">{item.customerName}</p>
          <p className="text-[11px] text-mgm-muted">{item.mobile}</p>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (item) => (
        <span className="font-semibold">₹{item.amount?.toLocaleString()}</span>
      ),
    },
    {
      key: "paymentType",
      label: "Loan Type",
      render: (item) => (
        <span className="text-mgm-muted">{item.paymentType || "—"}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <Badge
          variant={
            item.status === "SUCCESS"
              ? "success"
              : item.status === "FAILED" || item.status === "EXPIRED"
              ? "danger"
              : "warning"
          }
          size="sm"
        >
          {item.status}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: (item) => (
        <span className="text-mgm-muted text-xs">
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
        title="Transactions"
        subtitle="All payment transactions"
        breadcrumbs={[{ label: "Payments" }, { label: "Transactions" }]}
      />

      <div className="flex items-center justify-between">
        <Tabs tabs={statusTabs} active={status} onChange={(k) => { setStatus(k); setPage(1); }} />
      </div>

      <DataTable
        columns={columns}
        data={items}
        loading={isLoading}
        searchable
        searchPlaceholder="Search by name, ID, or phone..."
        searchKeys={["customerName", "orderId", "mobile"]}
        onRowClick={(item) => navigate(`/payments/${item._id}`)}
        emptyTitle="No transactions found"
        emptyDescription="No payment transactions match your filters."
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
