import { useMutation } from "@tanstack/react-query";
import { request } from "../../../services/axios.service";
import { API_URLS } from "../../apis";

const verify = async (data: { consentId: string; otp: string }) => {
  const response: TServerResponse = await request({
    url: API_URLS.CONSENT.VERIFY_OTP,
    method: "POST",
    data,
  });
  return response;
};

export const useVerifyOtpMutation = () => {
  return useMutation({ mutationFn: verify });
};
