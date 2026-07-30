import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLeadDetailQuery } from "../../hooks/lead/query/useLeadDetail.query";
import { useUpdateLeadMutation } from "../../hooks/lead/mutation/useUpdateLead.mutation";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { CardSkeleton } from "../../components/ui/Skeleton";
import PageHeader from "../../components/layout/PageHeader";

const STATUS_OPTIONS = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "PROPOSAL_SENT", label: "Proposal Sent" },
  { value: "CONVERTED", label: "Converted" },
  { value: "LOST", label: "Lost" },
];

const STATUS_VARIANT: Record<string, "default" | "success" | "warning" | "danger" | "info" | "gold"> = {
  NEW: "info",
  CONTACTED: "warning",
  QUALIFIED: "gold",
  PROPOSAL_SENT: "default",
  CONVERTED: "success",
  LOST: "danger",
};

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useLeadDetailQuery(id || "");
  const updateMutation = useUpdateLeadMutation();
  const lead = data?.data;

  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState("");

  if (isLoading) {
    return (
      <div className="space-y-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-16">
        <p className="text-mgm-muted">Lead not found</p>
        <button onClick={() => navigate("/leads")} className="mt-4 text-sm text-mgm-gold hover:underline">
          Back to Leads
        </button>
      </div>
    );
  }

  const handleUpdate = async () => {
    if (!newStatus && !notes.trim()) return;
    const payload: any = {};
    if (newStatus) payload.status = newStatus;
    if (notes.trim()) payload.notes = notes.trim();

    await updateMutation.mutateAsync({ id: lead._id, data: payload });
    setSuccess("Lead updated successfully");
    setNewStatus("");
    setNotes("");
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={`${lead.leadId} — ${lead.name}`}
        subtitle="Loan enquiry profile"
        breadcrumbs={[
          { label: "Leads", href: "/leads" },
          { label: lead.leadId },
        ]}
        action={
          <button
            onClick={() => navigate("/leads")}
            className="px-4 py-2 text-sm font-medium text-mgm-navy border border-mgm-border rounded-xl hover:bg-gray-50 transition-colors"
          >
            ← Back to Leads
          </button>
        }
      />

      {success && (
        <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Lead Info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Personal Info */}
          <Card>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-mgm-muted mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoField label="Full Name" value={lead.name} />
              <InfoField label="Phone" value={`+91 ${lead.phone}`} />
              <InfoField label="Email" value={lead.email || "—"} />
              <InfoField label="Lead ID" value={lead.leadId} gold />
              <InfoField label="Source" value={lead.source || "Website"} />
              <InfoField label="Created" value={new Date(lead.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} />
            </div>
          </Card>

          {/* Loan Requirements */}
          <Card>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-mgm-muted mb-4">
              Loan Requirements
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoField label="Loan Type" value={lead.loanType} />
              <InfoField label="Amount" value={lead.amount ? `₹${lead.amount.toLocaleString()}` : "—"} gold />
              <InfoField label="CIBIL Score" value={lead.cibil === "not-sure" ? "Not Sure" : (lead.cibil || "—")} />
              <InfoField label="Employment" value={lead.employment || "—"} />
            </div>
            {lead.purpose && (
              <div className="mt-4 pt-4 border-t border-mgm-border">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-mgm-muted mb-1">Purpose</p>
                <p className="text-sm text-mgm-navy leading-relaxed">{lead.purpose}</p>
              </div>
            )}
          </Card>

          {/* Status History Timeline */}
          <Card>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-mgm-muted mb-4">
              Status History
            </h3>
            {lead.statusHistory && lead.statusHistory.length > 0 ? (
              <div className="space-y-0">
                {[...lead.statusHistory].reverse().map((entry: any, idx: number) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        idx === 0 ? "bg-mgm-gold" : "bg-mgm-navy"
                      }`} />
                      {idx < lead.statusHistory.length - 1 && (
                        <div className="w-0.5 flex-1 min-h-[32px] bg-mgm-border" />
                      )}
                    </div>
                    <div className="pb-5">
                      <div className="flex items-center gap-2">
                        <Badge variant={STATUS_VARIANT[entry.status] || "default"} size="sm">
                          {entry.status?.replace(/_/g, " ")}
                        </Badge>
                        <span className="text-[10px] text-mgm-muted">
                          {new Date(entry.timestamp).toLocaleString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {entry.note && (
                        <p className="text-sm text-mgm-navy mt-1.5 leading-relaxed">{entry.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-mgm-muted">No status history</p>
            )}
          </Card>
        </div>

        {/* Right: Update Panel */}
        <div className="space-y-5">
          {/* Current Status */}
          <Card>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-mgm-muted mb-3">
              Current Status
            </h3>
            <Badge variant={STATUS_VARIANT[lead.status] || "default"} size="md">
              {lead.status?.replace(/_/g, " ")}
            </Badge>
            <div className="mt-4 space-y-2 text-xs text-mgm-muted">
              {lead.contactedAt && (
                <p>Contacted: {new Date(lead.contactedAt).toLocaleDateString("en-IN")}</p>
              )}
              {lead.convertedAt && (
                <p>Converted: {new Date(lead.convertedAt).toLocaleDateString("en-IN")}</p>
              )}
              {lead.lostAt && (
                <p>Lost: {new Date(lead.lostAt).toLocaleDateString("en-IN")}</p>
              )}
            </div>
          </Card>

          {/* Update Status */}
          <Card>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-mgm-muted mb-3">
              Update Lead
            </h3>
            <div className="space-y-3">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-mgm-border rounded-xl text-sm text-mgm-navy focus:outline-none focus:border-mgm-gold"
              >
                <option value="">Select new status</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Add a note (optional)..."
                className="w-full px-3 py-2.5 bg-gray-50 border border-mgm-border rounded-xl text-sm text-mgm-navy placeholder:text-mgm-muted focus:outline-none focus:border-mgm-gold resize-none"
              />
              <button
                onClick={handleUpdate}
                disabled={(!newStatus && !notes.trim()) || updateMutation.isPending}
                className="w-full py-2.5 bg-mgm-navy text-white text-sm font-semibold rounded-xl hover:bg-mgm-navy/90 transition-colors disabled:opacity-50"
              >
                {updateMutation.isPending ? "Updating..." : "Update Lead"}
              </button>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-mgm-muted mb-3">
              Lead Score
            </h3>
            <div className="space-y-2">
              <ScoreBar label="Completeness" value={getCompleteness(lead)} />
              <ScoreBar label="Engagement" value={lead.statusHistory?.length || 0} max={10} />
              <ScoreBar label="Amount" value={lead.amount > 0 ? Math.min(100, (lead.amount / 5000000) * 100) : 0} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value, gold }: { label: string; value: string; gold?: boolean }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider font-semibold text-mgm-muted mb-1">{label}</p>
      <p className={`text-sm font-medium ${gold ? "text-mgm-gold" : "text-mgm-navy"}`}>{value}</p>
    </div>
  );
}

function getCompleteness(lead: any) {
  const fields = ["name", "phone", "email", "loanType", "amount", "cibil", "employment", "purpose"];
  const filled = fields.filter((f) => lead[f] && lead[f] !== "").length;
  return Math.round((filled / fields.length) * 100);
}

function ScoreBar({ label, value, max = 100 }: { label: string; value: number; max?: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const color = pct >= 70 ? "bg-emerald-500" : pct >= 40 ? "bg-amber-500" : "bg-red-400";
  return (
    <div>
      <div className="flex justify-between text-[10px] text-mgm-muted mb-1">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
