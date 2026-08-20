import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "../../../services/axios.service";
import { API_URLS } from "../../apiUrls";

const updateSettings = async (data: Record<string, unknown>) => {
  const response: TServerResponse = await request({
    url: API_URLS.settings.UPDATE_SETTINGS,
    method: "PATCH",
    data,
  });
  return response;
};

export const useUpdateSettingsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_URLS.settings.GET_SETTINGS] });
    },
  });
};
