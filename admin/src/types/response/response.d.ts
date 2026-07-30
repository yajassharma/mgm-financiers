type TPageData = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type TServerResponse = {
  statusCode: 200 | 400 | 500 | 401 | 201 | 204 | 429 | 202 | 404;
  status: "success" | "error";
  title: string;
  message: string;
  data?: any;
  extraData?: any;
  pageData?: TPageData;
};

interface IConsent {
  _id: string;
  consentId: string;
  name: string;
  mobile: string;
  pan: string;
  loanPurpose: string;
  status: "SENT" | "OTP_VERIFIED" | "CONSENTED" | "EXPIRED";
  consentBy: string;
  consentedCaptureTime?: string;
  createdAt: string;
  updatedAt: string;
}

interface IGrievance {
  _id: string;
  grievanceId: string;
  name: string;
  mobile: string;
  email: string;
  address?: string;
  category: string;
  subject: string;
  description: string;
  status:
    | "RECEIVED"
    | "IN_REVIEW"
    | "PENDING_CUSTOMER"
    | "RESOLVED"
    | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  adminResponse?: string;
  customerUpdate?: string;
  internalNotes?: string;
  assignedTo?: string;
  statusHistory: Array<{
    status: string;
    date: string;
    updatedBy?: string;
    note?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface IPayment {
  _id: string;
  orderId: string;
  customerName: string;
  mobile: string;
  email?: string;
  amount: number;
  paymentType: string;
  method?: string;
  status:
    | "COMPLETED"
    | "FAILED"
    | "PENDING"
    | "EXPIRED"
    | "REFUNDED"
    | "CREATED";
  gatewayOrderId?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

interface IAdminProfile {
  _id: string;
  name: string;
  email: string;
  roles: string[];
  totalConsents?: number;
}

interface IAnalyticsOverview {
  totalUsers: number;
  activeUsers: number;
  pageViews: number;
  avgSessionDuration: number;
  bounceRate: number;
  returningUsers: number;
}

interface IAnalyticsTraffic {
  period: string;
  data: Array<{
    date: string;
    visitors: number;
    pageViews: number;
  }>;
  sources: {
    organic: number;
    direct: number;
    referral: number;
    social: number;
  };
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  topPages: Array<{
    page: string;
    views: number;
  }>;
  countries: Array<{
    country: string;
    users: number;
  }>;
}

interface IGrievanceStats {
  total: number;
  open: number;
  inReview: number;
  resolved: number;
  closed: number;
  avgResolutionTime: number;
  todayNew: number;
  weeklyTrend: Array<{ date: string; count: number }>;
  monthlyTrend: Array<{ date: string; count: number }>;
}

interface IPaymentStats {
  totalRevenue: number;
  successful: number;
  pending: number;
  failed: number;
  successRate: number;
  todayPayments: number;
  todayRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  avgTransactionValue: number;
  statusDistribution: Record<string, number>;
  revenueByType: Array<{ type: string; revenue: number }>;
}
