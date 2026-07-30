import { useMutation } from "@tanstack/react-query";
import { request } from "../../../services/axios.service";
import { API_URLS } from "../../apiUrls";
import type { forms } from "../../../form";

const sendConsent = async (data: typeof forms.consent.values) => {
  const response: TServerResponse = await request({
    url: API_URLS.consent.SENT_CONSENT,
    method: "POST",
    data,
  });
  return response;
};

export const useSentConsentMutation = () => {
  return useMutation({ mutationFn: sendConsent });
};
