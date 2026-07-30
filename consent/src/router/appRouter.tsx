import { createBrowserRouter, redirect } from "react-router-dom";
import LandingPage from "../components/LandingPage";
import OTPVerification from "../components/OTPVerification";
import ConsentReview from "../components/ConsentReview";
import SuccessScreen from "../components/SuccessScreen";
import FailureScreen from "../components/FailureScreen";
import ROUTES from "../enum/routes";
import ConsentGuard from "../guards/ConsentGuard";

export const router = createBrowserRouter([
  {
    path: "/",
    loader: () => redirect("/MGM-X4821"),
  },
  {
    path: "/:consentId",
    element: <ConsentGuard />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "otp",
        element: <OTPVerification />,
      },
      {
        path: "consent",
        element: <ConsentReview />,
      },
      {
        path: "success",
        element: <SuccessScreen />,
      },
      {
        path: ROUTES.FAILURE, // "failure"
        element: <FailureScreen />,
      },
    ],
  },
]);
