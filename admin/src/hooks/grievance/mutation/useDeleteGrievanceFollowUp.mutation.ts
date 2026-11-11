import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "../../../services/axios.service";
import { API_URLS } from "../../apiUrls";

const deleteFollowUp = async (data: { id: string; timestamp: string }) => {
  const response: TServerResponse = await request({
    url: `${API_URLS.grievance.GRIEVANCES}/${data.id}/follow-ups`,
    method: "DELETE",
    data: { timestamp: data.timestamp },
  });
  return response;
};

export const useDeleteGrievanceFollowUpMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFollowUp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_URLS.grievance.GRIEVANCES] });
    },
  });
};
