import { useMutation } from "@tanstack/react-query";
import { request } from "../../../services/axios.service";
import { API_URLS } from "../../apiUrls";

const resendConsent = async (data: { _id: string }) => {
  const response: TServerResponse = await request({
    url: API_URLS.consent.RESENT_CONSENT,
    method: "POST",
    data,
  });
  return response;
};

export const useResentConsentMutation = () => {
  return useMutation({ mutationFn: resendConsent });
};
