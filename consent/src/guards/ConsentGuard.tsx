import { useEffect } from "react";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import { useVerifyConsentQuery } from "../hooks/consent/query/useVerifyConsent.query";

const ConsentGuard = () => {
  const { consentId } = useParams<{ consentId: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useVerifyConsentQuery(consentId!);

  useEffect(() => {
    if (!data) return;

    const route = data?.data?.route;

    if (route === "allow") {
      navigate(`/${consentId}`, {
        replace: true,
        state: data.data,
      });
    }

    if (route === "error") {
      navigate("error", {
        replace: true,
        state: data.data,
      });
    }

    if (route === "success") {
      navigate("success", {
        replace: true,
        state: data.data,
      });
    }
  }, [data, navigate]);

  // 🚫 BLOCK UI until verification completes
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
        {/* Spinner */}
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
          <svg
            className="h-10 w-10 animate-spin text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        </div>

        {/* Text */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Verifying Consent Link
        </h2>
        <p className="text-sm text-gray-500 max-w-xs">
          Please wait while we securely validate your request. This won’t take
          more than a moment.
        </p>
      </div>
    );
  }

  if (isError) {
    navigate("error", { replace: true });
    return null;
  }

  // ✅ Only render children when route is allowed
  return <Outlet />;
};

export default ConsentGuard;
