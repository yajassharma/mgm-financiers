import { useQuery } from "@tanstack/react-query";
import { request } from "../../../services/axios.service";
import { API_URLS } from "../../apiUrls";

const get = async () => {
  const response: TServerResponse = await request({
    url: API_URLS.analytics.OVERVIEW,
    method: "GET",
  });
  return response;
};

export const useAnalyticsOverviewQuery = () => {
  return useQuery({
    queryKey: [API_URLS.analytics.OVERVIEW],
    queryFn: () => get(),
    refetchInterval: 30000,
  });
};
