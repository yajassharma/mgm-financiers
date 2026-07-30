type TConsentStatus = "SENT" | "OTP_VERIFIED" | "CONSENTED" | "EXPIRED";

type TConsents = {
  _id: string;
  name: string;
  consentId: string;
  mobile: string;
  pan: string;
  loanPurpose: string;
  status: TConsentStatus;
  createdAt: string;
};
