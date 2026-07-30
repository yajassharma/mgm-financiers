import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import { CONSENT_DETAILS } from "../constants";
import { useApproveConsentMutation } from "../hooks/consent/mutation/useApproveConsent.mutation";
import { toast } from "react-toastify";

const ConsentReview: React.FC = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const { consentId } = useParams<{ consentId: string }>();

  const { isPending, mutateAsync } = useApproveConsentMutation();

  const approveConsent = async () => {
    const res = await mutateAsync({ consentId: consentId ?? "" });
    if (res.status === "success") {
      navigate(`/${consentId}/success`); // ✅ relative navigation
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      <Header title="Review & Give Consent" />

      <div className="p-5 flex-grow overflow-y-auto">
        <div className="bg-gray-50 rounded-lg p-3 mb-5 border border-gray-100 text-[10px] space-y-1.5">
          <div className="flex justify-between">
            <span className="text-gray-500 uppercase font-bold tracking-tighter">
              NBFC
            </span>
            <span className="font-semibold text-gray-800">
              {CONSENT_DETAILS.nbfcName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 uppercase font-bold tracking-tighter">
              Bureau
            </span>
            <span className="font-semibold text-gray-800">
              {CONSENT_DETAILS.bureauName}
            </span>
          </div>
        </div>

        <h3 className="text-xs font-bold text-gray-900 mb-2">
          Declaration & Consent
        </h3>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-56 overflow-y-auto mb-4">
          <p className="text-[11px] text-gray-700 leading-relaxed space-y-3">
            I hereby provide my explicit and informed consent to{" "}
            <strong>{CONSENT_DETAILS.nbfcName}</strong> to access my credit
            information from <strong>{CONSENT_DETAILS.bureauName}</strong> for
            the purpose of evaluating my loan application.
            <br />
            <br />I understand that:
            <ul className="list-disc pl-4 mt-1 space-y-1">
              <li>This access is one-time and purpose-specific.</li>
              <li>My consent is voluntary and for this transaction.</li>
              <li>
                The information fetched will be used solely for credit
                assessment.
              </li>
              <li>I can withdraw my consent as per applicable laws.</li>
            </ul>
            <br />
            By clicking "I Agree & Give Consent", I confirm that I am the
            authorized user of this mobile number.
          </p>
        </div>

        <label className="flex items-start cursor-pointer group mb-4">
          <div className="flex items-center h-5 mt-0.5">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="ml-2.5 text-xs">
            <span className="text-gray-700 font-medium">
              I have read and agree to the above terms
            </span>
          </div>
        </label>
      </div>

      <div className="p-5 bg-white border-t border-gray-100 space-y-2.5">
        <button
          onClick={approveConsent}
          disabled={!agreed || isPending}
          className={`w-full font-bold py-3.5 rounded-xl transition-all shadow-lg ${
            agreed
              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100 active:scale-95"
              : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
          }`}
        >
          {isPending ? "Approving..." : "I Agree & Give Consent"}
        </button>

        <button
          onClick={() => navigate(`/${consentId}/otp`)}
          className="w-full text-xs font-semibold text-gray-400 hover:text-gray-700 py-1"
        >
          Cancel Request
        </button>
      </div>
    </div>
  );
};

export default ConsentReview;
