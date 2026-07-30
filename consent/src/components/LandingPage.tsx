import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import { CONSENT_DETAILS } from "../constants";
import ROUTES from "../enum/routes";

const LandingPage = () => {
  const navigate = useNavigate();

  const { state } = useLocation() as {
    state?: {
      name?: string;
    };
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      <Header title="Credit Information Consent Request" />

      {/* Scrollable middle content */}
      <div className="p-5 flex-grow overflow-y-auto custom-scrollbar">
        <div className="mb-5">
          <p className="text-gray-600 text-sm">
            Hello{" "}
            <span className="font-semibold text-gray-900 capitalize">
              {state?.name}
            </span>
            ,
          </p>
          <p className="text-xs text-gray-500 mt-1">
            MGM Financiers requires your authorization to proceed with your
            request.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5">
          <h2 className="text-[10px] font-bold text-blue-900 uppercase tracking-wider mb-3">
            Request Summary
          </h2>
          <div className="space-y-2.5">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-blue-700">Requested by:</span>
              <span className="text-xs font-semibold text-gray-900">
                {CONSENT_DETAILS.nbfcName}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-blue-700">Credit Bureau:</span>
              <span className="text-xs font-semibold text-gray-900">
                {CONSENT_DETAILS.bureauName}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-blue-700">Purpose:</span>
              <span className="text-xs font-semibold text-gray-900">
                {CONSENT_DETAILS.purpose}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-[11px] text-gray-700 leading-relaxed italic border-l-2 border-blue-200 pl-3">
            "MGM Financiers is requesting your permission to access your credit
            information from CRIF / Transunion CIBIL for loan evaluation."
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-[10px] text-gray-500 leading-normal">
            By proceeding, you authorize the fetching of your credit score as
            per RBI regulations. This is a secure, one-time access for the
            mentioned purpose only.
          </p>
        </div>
      </div>

      {/* Fixed bottom action area */}
      <div className="p-5 bg-white border-t border-gray-100 mt-auto">
        <button
          onClick={() => navigate(ROUTES.OTP, { state: state })}
          className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-100 active:scale-95"
        >
          Verify Mobile Number
        </button>
        <div className="flex justify-center mt-3 space-x-4">
          <a
            href="#"
            className="text-[10px] text-gray-400 underline decoration-gray-300"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-[10px] text-gray-400 underline decoration-gray-300"
          >
            Terms
          </a>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
