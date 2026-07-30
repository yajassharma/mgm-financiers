import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGrievancesQuery } from "../../hooks/grievance/query/useGrievances.query";
import { useUpdateGrievanceStatusMutation } from "../../hooks/grievance/mutation/useUpdateGrievanceStatus.mutation";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import PageHeader from "../../components/layout/PageHeader";
import { CardSkeleton } from "../../components/ui/Skeleton";

const statusOptions = [
  { label: "Received", value: "RECEIVED" },
  { label: "In Review", value: "IN_REVIEW" },
  { label: "Pending Customer Response", value: "PENDING_CUSTOMER" },
  { label: "Resolved", value: "RESOLVED" },
  { label: "Closed", value: "CLOSED" },
];

const statusVariant: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
  RECEIVED: "info",
  IN_REVIEW: "warning",
  PENDING_CUSTOMER: "warning",
  RESOLVED: "success",
  CLOSED: "default",
};

export default function GrievanceDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, refetch } = useGrievancesQuery({ page: 1, limit: 100, search: "", status: "all" });
  const { mutateAsync: updateStatus, isPending } = useUpdateGrievanceStatusMutation();

  const grievance = data?.data?.items?.find((g: any) => g._id === id);

  const [newStatus, setNewStatus] = useState("");
  const [customerUpdate, setCustomerUpdate] = useState("");
  const [internalNotes, setInternalNotes] = useState("");

  if (isLoading) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (!grievance) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-semibold text-mgm-navy">Grievance not found</p>
        <Button variant="secondary" className="mt-4" onClick={() => navigate("/grievances")}>
          Back to Grievances
        </Button>
      </div>
    );
  }

  const handleStatusUpdate = async () => {
    if (!newStatus && !customerUpdate) return;
    await updateStatus({
      id: grievance._id,
      status: newStatus || grievance.status,
      customerUpdate: customerUpdate || undefined,
      internalNotes: internalNotes || undefined,
    });
    setNewStatus("");
    setCustomerUpdate("");
    setInternalNotes("");
    refetch();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={`Grievance ${grievance.grievanceId}`}
        subtitle={grievance.subject}
        breadcrumbs={[
          { label: "Grievances", href: "/grievances" },
          { label: "All Grievances", href: "/grievances" },
          { label: grievance.grievanceId },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Badge variant={statusVariant[grievance.status] || "default"} size="md">
              {grievance.status?.replace(/_/g, " ")}
            </Badge>
            <Badge
              variant={
                grievance.priority === "URGENT" || grievance.priority === "HIGH"
                  ? "danger"
                  : grievance.priority === "MEDIUM"
                  ? "warning"
                  : "default"
              }
              size="md"
            >
              {grievance.priority}
            </Badge>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Complaint Details */}
          <Card>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-mgm-muted mb-4">
              Complaint Details
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-[11px] text-mgm-muted uppercase tracking-wider">Subject</p>
                <p className="text-sm font-semibold text-mgm-navy mt-0.5">{grievance.subject}</p>
              </div>
              <div>
                <p className="text-[11px] text-mgm-muted uppercase tracking-wider">Category</p>
                <p className="text-sm text-mgm-navy mt-0.5">{grievance.category}</p>
              </div>
              <div>
                <p className="text-[11px] text-mgm-muted uppercase tracking-wider">Description</p>
                <p className="text-sm text-mgm-navy mt-0.5 leading-relaxed whitespace-pre-wrap">
                  {grievance.description}
                </p>
              </div>
            </div>
          </Card>

          {/* Latest Customer Update */}
          {grievance.customerUpdate && (
            <Card className="border-blue-200 bg-blue-50/30">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-blue-700 mb-3">
                Latest Customer Update
              </h3>
              <p className="text-sm text-blue-800 leading-relaxed">{grievance.customerUpdate}</p>
            </Card>
          )}

          {/* Status Timeline */}
          <Card>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-mgm-muted mb-4">
              Status Timeline
            </h3>
            <div className="space-y-0">
              {grievance.statusHistory?.map((entry: any, i: number) => (
                <div key={i} className="flex gap-3 pb-4 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                        i === 0
                          ? "bg-mgm-gold border-mgm-gold"
                          : "bg-white border-mgm-border"
                      }`}
                    />
                    {i < (grievance.statusHistory?.length || 0) - 1 && (
                      <div className="w-px flex-1 bg-mgm-border" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-mgm-navy">
                      {entry.status?.replace(/_/g, " ")}
                    </p>
                    <p className="text-[11px] text-mgm-muted mt-0.5">
                      {new Date(entry.timestamp).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {entry.note && (
                      <p className="text-xs text-mgm-navy mt-1 bg-blue-50 rounded-lg px-3 py-2 border border-blue-100">{entry.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Customer Info */}
          <Card>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-mgm-muted mb-4">
              Customer Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-[11px] text-mgm-muted uppercase tracking-wider">Name</p>
                <p className="text-sm font-semibold text-mgm-navy">{grievance.name}</p>
              </div>
              <div>
                <p className="text-[11px] text-mgm-muted uppercase tracking-wider">Phone</p>
                <p className="text-sm text-mgm-navy">{grievance.mobile}</p>
              </div>
              <div>
                <p className="text-[11px] text-mgm-muted uppercase tracking-wider">Email</p>
                <p className="text-sm text-mgm-navy">{grievance.email}</p>
              </div>
              {grievance.address && (
                <div>
                  <p className="text-[11px] text-mgm-muted uppercase tracking-wider">Address</p>
                  <p className="text-sm text-mgm-navy">{grievance.address}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Admin Actions */}
          <Card>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-mgm-muted mb-4">
              Admin Actions
            </h3>
            <div className="space-y-3">
              <Select
                label="Update Status"
                options={statusOptions}
                placeholder="Select status..."
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              />

              <div className="space-y-1.5">
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-mgm-gold">
                  Response to Customer
                </label>
                <textarea
                  value={customerUpdate}
                  onChange={(e) => setCustomerUpdate(e.target.value)}
                  placeholder="This message will be visible to the customer on the grievance tracking page..."
                  rows={3}
                  className="w-full px-4 py-2.5 text-sm border border-mgm-gold/30 rounded-xl outline-none focus:border-mgm-gold focus:ring-2 focus:ring-mgm-gold/10 resize-none transition-colors bg-amber-50/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-mgm-muted">
                  Internal Notes
                </label>
                <textarea
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Private notes (not visible to customer)..."
                  rows={2}
                  className="w-full px-4 py-2.5 text-sm border border-mgm-border rounded-xl outline-none focus:border-mgm-gold focus:ring-2 focus:ring-mgm-gold/10 resize-none transition-colors"
                />
              </div>

              <Button
                onClick={handleStatusUpdate}
                loading={isPending}
                disabled={!newStatus && !customerUpdate}
                className="w-full"
              >
                Save Changes
              </Button>
            </div>
          </Card>


        </div>
      </div>
    </div>
  );
}
