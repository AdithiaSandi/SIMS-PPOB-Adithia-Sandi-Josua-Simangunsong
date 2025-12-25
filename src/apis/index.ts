import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { localStorageNamespace } from "../utils/constant";

const instance = axios.create({
  baseURL: "https://take-home-test-api.nutech-integrasi.com",
  // withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${
      localStorage.getItem(localStorageNamespace) || ""
    }`,
  },
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      !window.location.pathname.includes("/auth") &&
      (error.response?.status === 401 || error.response?.status === 403)
    ) {
      localStorage.removeItem(localStorageNamespace);
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export type TApiResponse<T = unknown> = {
  data?: T | null;
  message: string;
  status: number;
};

export type TPaginationParam = {
  offset: number;
  limit?: number;
};

export type TApiResponsePagination<T = unknown> = Omit<TApiResponse, "data"> & {
  data?: TPaginationParam & {
    records?: T | null;
  };
};

export type TApiErrorResponse = AxiosError<TApiResponse>;

export function getMethod<TData>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<TData>> {
  return instance.get(endpoint, config);
}

export function postMethod<TPayloadPost, TData>(
  endpoint: string,
  payload?: TPayloadPost,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<TData>> {
  return instance.post(endpoint, payload, config);
}

export function putMethod<TPayloadPut, TData>(
  endpoint: string,
  payload?: TPayloadPut,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<TData>> {
  return instance.put(endpoint, payload, config);
}
