import { useQuery } from "@tanstack/react-query";
import { request } from "../../../services/axios.service";
import { API_URLS } from "../../apiUrls";

const get = async (params: { period?: string }) => {
  const response: TServerResponse = await request({
    url: API_URLS.analytics.TRAFFIC,
    method: "GET",
    params,
  });
  return response;
};

export const useAnalyticsTrafficQuery = (params: { period?: string } = {}) => {
  return useQuery({
    queryKey: [API_URLS.analytics.TRAFFIC, params],
    queryFn: () => get(params),
  });
};
