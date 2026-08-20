import { createBrowserRouter } from "react-router-dom";
import TheLayout from "../container/TheLayout";
import Login from "../pages/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import PaymentDashboard from "../pages/payments/PaymentDashboard";
import Transactions from "../pages/payments/Transactions";
import TransactionDetail from "../pages/payments/TransactionDetail";
import GrievanceDashboard from "../pages/grievances/GrievanceDashboard";
import AllGrievances from "../pages/grievances/AllGrievances";
import GrievanceDetail from "../pages/grievances/GrievanceDetail";
import LeadDashboard from "../pages/leads/LeadDashboard";
import AllLeads from "../pages/leads/AllLeads";
import LeadDetail from "../pages/leads/LeadDetail";
import Consents from "../pages/consents/Consents";
import Settings from "../pages/settings/Settings";
import ProtectedRoute from "../routers/Protected.route";
import PublicRoute from "../routers/Public.route";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <PublicRoute />,
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <TheLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "payments/dashboard", element: <PaymentDashboard /> },
          { path: "payments", element: <Transactions /> },
          { path: "payments/:id", element: <TransactionDetail /> },
          { path: "grievances/dashboard", element: <GrievanceDashboard /> },
          { path: "grievances", element: <AllGrievances /> },
          { path: "grievances/:id", element: <GrievanceDetail /> },
          { path: "leads/dashboard", element: <LeadDashboard /> },
          { path: "leads", element: <AllLeads /> },
          { path: "leads/:id", element: <LeadDetail /> },
          { path: "consents", element: <Consents /> },
          { path: "settings", element: <Settings /> },
        ],
      },
    ],
  },
]);
