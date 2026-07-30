import { useMutation } from "@tanstack/react-query";
import { request } from "../../../services/axios.service";
import { API_URLS } from "../../apiUrls";

const updateStatus = async (data: {
  id: string;
  status: string;
  adminResponse?: string;
  customerUpdate?: string;
  internalNotes?: string;
}) => {
  const response: TServerResponse = await request({
    url: `${API_URLS.grievance.UPDATE_STATUS}/${data.id}/status`,
    method: "PATCH",
    data: {
      status: data.status,
      adminResponse: data.adminResponse,
      customerUpdate: data.customerUpdate,
      internalNotes: data.internalNotes,
    },
  });
  return response;
};

export const useUpdateGrievanceStatusMutation = () => {
  return useMutation({ mutationFn: updateStatus });
};
