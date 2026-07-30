import { useQuery } from "@tanstack/react-query";
import { request } from "../../../services/axios.service";
import { API_URLS } from "../../apiUrls";

const get = async () => {
  const response: TServerResponse = await request({
    url: API_URLS.lead.LEAD_STATS,
    method: "GET",
  });
  return response;
};

export const useLeadStatsQuery = () => {
  return useQuery({
    queryKey: [API_URLS.lead.LEAD_STATS],
    queryFn: () => get(),
  });
};
