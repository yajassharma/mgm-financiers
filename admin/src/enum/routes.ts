const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/",
  PAYMENT_DASHBOARD: "/payments/dashboard",
  PAYMENTS: "/payments",
  PAYMENT_DETAIL: "/payments/:id",
  GRIEVANCE_DASHBOARD: "/grievances/dashboard",
  GRIEVANCES: "/grievances",
  GRIEVANCE_DETAIL: "/grievances/:id",
  LEAD_DASHBOARD: "/leads/dashboard",
  LEADS: "/leads",
  LEAD_DETAIL: "/leads/:id",
  CONSENTS: "/consents",
} as const;

export default ROUTES;
