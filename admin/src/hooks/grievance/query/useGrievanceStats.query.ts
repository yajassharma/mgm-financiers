import { useQuery } from "@tanstack/react-query";
import { request } from "../../../services/axios.service";
import { API_URLS } from "../../apiUrls";

const get = async () => {
  const response: TServerResponse = await request({
    url: API_URLS.grievance.GRIEVANCE_STATS,
    method: "GET",
  });
  return response;
};

export const useGrievanceStatsQuery = () => {
  return useQuery({
    queryKey: [API_URLS.grievance.GRIEVANCE_STATS],
    queryFn: () => get(),
  });
};
