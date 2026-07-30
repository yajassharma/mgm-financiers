import { useQuery } from "@tanstack/react-query";
import { request } from "../../../services/axios.service";
import { API_URLS } from "../../apiUrls";

const get = async () => {
  const response: TServerResponse = await request({
    url: API_URLS.auth.GET_PROFILE,
    method: "GET",
  });

  return response;
};

export const useProfileQuery = () => {
  return useQuery({
    queryKey: [API_URLS.auth.GET_PROFILE],
    queryFn: () => get(),
  });
};
