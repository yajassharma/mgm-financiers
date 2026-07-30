import { useNavigate, useParams } from "react-router-dom";
import { usePaymentsQuery } from "../../hooks/payment/query/usePayments.query";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { CardSkeleton } from "../../components/ui/Skeleton";

const statusBadgeClass: Record<string, string> = {
  SUCCESS: "bg-emerald-50 text-emerald-700 border-emerald-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
  FAILED: "bg-red-50 text-red-700 border-red-200",
  EXPIRED: "bg-red-50 text-red-700 border-red-200",
};

export default function TransactionDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = usePaymentsQuery({ page: 1, limit: 200, search: "", status: "all" });

  const payment = data?.data?.items?.find((p: any) => p._id === id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-semibold text-mgm-navy">Transaction not found</p>
        <Button variant="secondary" className="mt-4" onClick={() => navigate("/payments")}>
          Back to Payments
        </Button>
      </div>
    );
  }

  const badgeClass = statusBadgeClass[payment.status] || "bg-gray-50 text-gray-700 border-gray-200";
  const created = new Date(payment.createdAt);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back link */}
      <button
        onClick={() => navigate("/payments")}
        className="text-sm font-medium text-mgm-gold hover:text-mgm-gold/80 transition-colors"
      >
        ← Back to Payments
      </button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-mgm-navy">Payment Details</h1>
          <p className="text-sm text-mgm-muted mt-0.5">{payment.orderId}</p>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${badgeClass}`}>
          {payment.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Borrower Information */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-4 h-4 text-mgm-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="text-sm font-semibold text-mgm-navy">Borrower Information</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-1.5 border-b border-mgm-border last:border-0">
                <span className="text-sm text-mgm-muted">Full Name</span>
                <span className="text-sm font-semibold text-mgm-navy">{payment.customerName}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-mgm-border last:border-0">
                <span className="text-sm text-mgm-muted">Phone</span>
                <span className="text-sm text-mgm-navy">{payment.customerPhone}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-mgm-border last:border-0">
                <span className="text-sm text-mgm-muted">Email</span>
                <span className="text-sm text-mgm-navy">{payment.customerEmail}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-sm text-mgm-muted">Loan Account</span>
                <span className="text-sm font-mono text-mgm-navy">{payment.loanAccountNumber || "—"}</span>
              </div>
            </div>
          </Card>

          {/* Payment Information */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-4 h-4 text-mgm-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20" />
              </svg>
              <h3 className="text-sm font-semibold text-mgm-navy">Payment Information</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-1.5 border-b border-mgm-border last:border-0">
                <span className="text-sm text-mgm-muted">Payment ID</span>
                <span className="text-sm font-mono text-mgm-navy">{payment.cfPaymentId || "—"}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-mgm-border last:border-0">
                <span className="text-sm text-mgm-muted">Amount</span>
                <span className="text-sm font-semibold text-mgm-navy">₹{payment.amount?.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-mgm-border last:border-0">
                <span className="text-sm text-mgm-muted">Payment Type</span>
                <span className="text-sm text-mgm-navy">{payment.paymentType || "—"}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-mgm-border last:border-0">
                <span className="text-sm text-mgm-muted">Currency</span>
                <span className="text-sm text-mgm-navy">INR</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-mgm-border last:border-0">
                <span className="text-sm text-mgm-muted">Payment Method</span>
                <span className="text-sm text-mgm-navy">{payment.paymentMethod || "—"}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-mgm-border last:border-0">
                <span className="text-sm text-mgm-muted">CF Payment ID</span>
                <span className="text-sm font-mono text-mgm-navy">{payment.cfPaymentId || "—"}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-sm text-mgm-muted">Paid At</span>
                <span className="text-sm text-mgm-navy">
                  {created.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })},{" "}
                  {created.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
            {payment.failureReason && (
              <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-200">
                <p className="text-[11px] text-red-600 uppercase tracking-wider font-semibold mb-1">Failure Reason</p>
                <p className="text-sm text-red-700">{payment.failureReason}</p>
              </div>
            )}
          </Card>

          {/* Gateway Response */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-4 h-4 text-mgm-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <h3 className="text-sm font-semibold text-mgm-navy">Gateway Response</h3>
            </div>
            <pre className="bg-gray-50 rounded-xl p-4 text-xs font-mono text-mgm-navy overflow-x-auto max-h-48">
              {JSON.stringify({
                order_id: payment.orderId,
                cf_order_id: payment.cfPaymentId || null,
                order_amount: payment.amount,
                order_currency: "INR",
                order_status: payment.status,
                payment_method: payment.paymentMethod || null,
                customer_details: {
                  customer_id: payment.customerEmail,
                  customer_name: payment.customerName,
                  customer_email: payment.customerEmail,
                  customer_phone: payment.customerPhone,
                },
                created_at: payment.createdAt,
              }, null, 2)}
            </pre>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Transaction Amount */}
          <Card className="text-center">
            <p className="text-xs uppercase tracking-wider font-semibold text-mgm-muted mb-2">Transaction Amount</p>
            <p className="text-3xl font-bold text-mgm-navy">₹{payment.amount?.toLocaleString()}</p>
            <p className="text-sm text-mgm-muted mt-1">{payment.paymentType || "Payment"}</p>
          </Card>

          {/* Timeline */}
          <Card>
            <h3 className="text-sm font-semibold text-mgm-navy mb-4">Timeline</h3>
            <div className="space-y-0">
              {payment.statusHistory?.map((entry: any, i: number) => (
                <div key={i} className="flex gap-3 pb-4 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${
                        i === 0 ? "bg-mgm-gold" : "bg-mgm-border"
                      }`}
                    />
                    {i < (payment.statusHistory?.length || 0) - 1 && (
                      <div className="w-px flex-1 bg-mgm-border" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-mgm-navy">
                      {entry.status?.replace(/_/g, " ") || "Order Created"}
                    </p>
                    <p className="text-[11px] text-mgm-muted mt-0.5">
                      {new Date(entry.timestamp || payment.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                      })},{" "}
                      {new Date(entry.timestamp || payment.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {(!payment.statusHistory || payment.statusHistory.length === 0) && (
                <div className="flex gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-mgm-gold flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-mgm-navy">Order Created</p>
                    <p className="text-[11px] text-mgm-muted mt-0.5">
                      {created.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })},{" "}
                      {created.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-sm font-semibold text-mgm-navy mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2.5 text-sm text-mgm-navy bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                Download Receipt
              </button>
              <button className="w-full text-left px-3 py-2.5 text-sm text-mgm-navy bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                View on Cashfree
              </button>
              <button className="w-full text-left px-3 py-2.5 text-sm text-mgm-navy bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                Export Details
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
