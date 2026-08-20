import { useQuery } from "@tanstack/react-query";
import { request } from "../../../services/axios.service";
import { API_URLS } from "../../apiUrls";

const getSettings = async () => {
  const response: TServerResponse = await request({
    url: API_URLS.settings.GET_SETTINGS,
    method: "GET",
  });
  return response;
};

export const useSettingsQuery = () => {
  return useQuery({
    queryKey: [API_URLS.settings.GET_SETTINGS],
    queryFn: getSettings,
  });
};
