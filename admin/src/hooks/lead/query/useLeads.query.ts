import { useQuery } from "@tanstack/react-query";
import { request } from "../../../services/axios.service";
import { API_URLS } from "../../apiUrls";

interface TQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

const get = async (params: TQueryParams) => {
  const response: TServerResponse = await request({
    url: API_URLS.lead.LEADS,
    method: "GET",
    params: params,
  });
  return response;
};

export const useLeadsQuery = (params: TQueryParams) => {
  return useQuery({
    queryKey: [API_URLS.lead.LEADS, params],
    queryFn: () => get(params),
  });
};
