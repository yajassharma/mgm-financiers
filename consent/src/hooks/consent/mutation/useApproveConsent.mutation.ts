import { useMutation } from "@tanstack/react-query";
import { request } from "../../../services/axios.service";
import { API_URLS } from "../../apis";

const approve = async (data: { consentId: string }) => {
  const response: TServerResponse = await request({
    url: API_URLS.CONSENT.APPROVE_CONSENT,
    method: "POST",
    data,
  });
  return response;
};

export const useApproveConsentMutation = () => {
  return useMutation({ mutationFn: approve });
};
