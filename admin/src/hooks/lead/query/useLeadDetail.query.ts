import { useQuery } from "@tanstack/react-query";
import { request } from "../../../services/axios.service";
import { API_URLS } from "../../apiUrls";

const get = async (id: string) => {
  const response: TServerResponse = await request({
    url: `${API_URLS.lead.LEAD_DETAIL}/${id}`,
    method: "GET",
  });
  return response;
};

export const useLeadDetailQuery = (id: string) => {
  return useQuery({
    queryKey: [API_URLS.lead.LEAD_DETAIL, id],
    queryFn: () => get(id),
    enabled: !!id,
  });
};
