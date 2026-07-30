import { useParams } from "react-router-dom";

const SuccessScreen = () => {
  const { consentId } = useParams<{ consentId: string }>();

  return (
    <div className="flex flex-col flex-grow items-center justify-center p-6 text-center bg-white h-full overflow-y-auto">
      <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border-2 border-emerald-500">
        <svg
          className="w-8 h-8 text-emerald-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={4}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-2">Consent Captured</h2>

      <p className="text-sm text-gray-500 leading-relaxed mb-6 px-4">
        Your authorization for credit evaluation is securely recorded.
      </p>

      <div className="w-full bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
        <div className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
          Reference ID
        </div>
        <div className="text-sm font-mono font-bold text-blue-900">
          {consentId ?? "MGM-XXXX"}
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;
