import { useQuery } from "@tanstack/react-query";
import { request } from "../../../services/axios.service";
import { API_URLS } from "../../apis";

const verify = async (consentId: string) => {
  const response: TServerResponse = await request({
    url: API_URLS.CONSENT.VERIFY_CONSENT,
    method: "GET",
    params: {
      consentId,
    },
  });

  return response;
};

export const useVerifyConsentQuery = (consentId: string) => {
  return useQuery({
    queryKey: [API_URLS.CONSENT.VERIFY_CONSENT, consentId],
    queryFn: () => verify(consentId),
    enabled: !!consentId,
    retry: false,
  });
};
