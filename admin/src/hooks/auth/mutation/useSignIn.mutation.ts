import { useMutation } from "@tanstack/react-query";
import { request } from "../../../services/axios.service";
import { API_URLS } from "../../apiUrls";
import type { forms } from "../../../form";

const signIn = async (data: typeof forms.login.values) => {
  const response = await request({
    url: API_URLS.auth.LOGIN,
    method: "POST",
    data,
  });
  return response;
};

export const useSignInMutation = () => {
  return useMutation({ mutationFn: signIn });
};
