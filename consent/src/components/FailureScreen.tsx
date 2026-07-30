import React from "react";
import { useLocation } from "react-router-dom";

const FailureScreen: React.FC = () => {
  const { state } = useLocation() as {
    state?: {
      title?: string;
      message?: string;
      consentId?: string;
    };
  };

  return (
    <div className="flex flex-col flex-grow items-center justify-center p-8 text-center bg-white">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-10 h-10 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {state?.title ?? "Request Invalid"}
      </h2>

      <p className="text-gray-600 leading-relaxed mb-10">
        {state?.message ??
          "This consent request is no longer valid or has already been used."}
      </p>

      <div className="space-y-4 w-full">
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
        >
          Check Again
        </button>
        <p className="text-sm text-gray-500">
          Need help? Contact MGM Financiers at <br />
          <span className="font-semibold text-blue-800">
            support@mgmfinanciers.com
          </span>
        </p>
      </div>
    </div>
  );
};

export default FailureScreen;
