import axios, {
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from "axios";
import { AuthResponse } from "../models";

export const WS_URL = "http://localhost:4001";
export const API_URL = `${import.meta.env.VITE_API_URL}/api`;
const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

$api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

$api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data?.accessToken) {
      localStorage.setItem("token", response.data.accessToken);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest.headers._isRetry) {
      originalRequest.headers._isRetry = true;
      try {
        const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
          withCredentials: true,
        });
        localStorage.setItem("token", response.data.accessToken);
        return $api.request(originalRequest);
      } catch (e) {
        localStorage.removeItem("token");
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  },
);

export default $api;
