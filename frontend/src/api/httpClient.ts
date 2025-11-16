import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import type { ApiResponse } from "../types/api";

const baseURL = (import.meta as any).env?.VITE_API_BASE_URL ?? "";
const client = axios.create({
  baseURL,
  timeout: 10000,
});

const unwrap = <T>(responseData: ApiResponse<T>): T => {
  if (!responseData.success) {
    const error = new Error(responseData.message || "API error");
    (error as any).statusCode = responseData.statusCode;
    throw error;
  }
  return responseData.data;
};

const handleError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    const message =
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Network or server error";
    const err = new Error(message);
    (err as any).statusCode = axiosError.response?.status;
    throw err;
  }

  throw error instanceof Error ? error : new Error("Unknown error");
};

export const http = {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<any> {
    try {
      const { data } = await client.get<ApiResponse<T>>(url, config);
      return unwrap<T>(data);
    } catch (err) {
      handleError(err);
    }
  },

  async post<T>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig
  ): Promise<any> {
    try {
      const { data } = await client.post<ApiResponse<T>>(url, body, config);
      return unwrap<T>(data);
    } catch (err) {
      handleError(err);
    }
  },

  async delete<T = void>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<any> {
    try {
      const { data } = await client.delete<ApiResponse<T>>(url, config);
      if (!data) {
        return undefined as T;
      }
      return unwrap<T>(data);
    } catch (err) {
      handleError(err);
      return undefined;
    }
  },
};
