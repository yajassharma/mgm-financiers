import { authApis } from "./auth.api";
import { consentApis, grievanceApis, paymentApis, leadApis, analyticsApis, settingsApis } from "./content.api";

export const API_URLS = {
  auth: authApis,
  consent: consentApis,
  grievance: grievanceApis,
  payment: paymentApis,
  lead: leadApis,
  analytics: analyticsApis,
  settings: settingsApis,
};
