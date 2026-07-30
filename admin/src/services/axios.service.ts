import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { deleteAllCookies } from "./getCookies.service";

const client = axios.create({
  baseURL: `${import.meta.env.VITE_APP_BASE_URL}`,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const request = async (options: AxiosRequestConfig<any>) => {
  const token = localStorage.getItem("token");
  client.defaults.headers.common.authorization = `Bearer ${token}`;

  const onSuccess = (response: AxiosResponse) => response.data;
  /* eslint-disable */
  const onError = (error: any) => {
    if (error.response.status === 401) {
      deleteAllCookies();
      window.location.replace("/login");
    }
    if (error.response.status >= 500) {
      // notification.error({
      //   message: error.response?.data?.title,
      //   description: error.response?.data?.message,
      // });
    }

    return error.response;
  };

  try {
    const response = await client(options);
    return onSuccess(response);
  } catch (error) {
    return onError(error);
  }
};
