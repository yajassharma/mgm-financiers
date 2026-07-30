import { useState } from "react";
import { request } from "../../../services/axios.service";
import { API_URLS } from "../../../hooks/apiUrls";

interface ResentLinkButtonProps {
  id: string;
  refetch: () => void;
}

export default function ResentLinkButton({ id, refetch }: ResentLinkButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleResend = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await request({
        url: API_URLS.consent.RESENT_CONSENT,
        method: "POST",
        data: { _id: id },
      });
      refetch();
    } catch (err) {
      console.error("Resend failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleResend}
      disabled={loading}
      className="p-1.5 rounded-lg hover:bg-gray-100 text-mgm-muted hover:text-mgm-navy transition-colors disabled:opacity-50"
      title="Resend consent link"
    >
      {loading ? (
        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )}
    </button>
  );
}
