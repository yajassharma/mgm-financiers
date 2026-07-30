import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "../../../services/axios.service";
import { API_URLS } from "../../apiUrls";

const updateStatus = async ({ id, data }: { id: string; data: { status?: string; notes?: string } }) => {
  const response: TServerResponse = await request({
    url: `${API_URLS.lead.UPDATE_STATUS}/${id}/status`,
    method: "PATCH",
    data: data,
  });
  return response;
};

export const useUpdateLeadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_URLS.lead.LEADS] });
      queryClient.invalidateQueries({ queryKey: [API_URLS.lead.LEAD_STATS] });
    },
  });
};
