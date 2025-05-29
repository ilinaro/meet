import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { AuthResponse } from "../models";
import { queryClient } from "../main";
import store, { resetAuthAndUser } from "../store";
import { setAccessToken, selectAccessToken } from "../store/accessStateSlice";

export const WS_URL = import.meta.env.VITE_WS_URL;
export const API_URL = import.meta.env.VITE_API_URL;

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });

  failedQueue = [];
};

export const handleRefreshFailure = () => {
  queryClient.clear();
  store.dispatch(resetAuthAndUser());
};

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
  timeout: 10000,
});

$api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = selectAccessToken(store.getState());
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

$api.interceptors.response.use(
  (config: AxiosResponse) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._isRetry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return $api.request(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._isRetry = true;
      isRefreshing = true;

      try {
        const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
          withCredentials: true,
          timeout: 5000,
        });

        const { accessToken } = response.data;
        if (!accessToken || typeof accessToken !== "string") {
          throw new Error("Invalid or missing accessToken in refresh response");
        }

        store.dispatch(setAccessToken({ accessToken }));
        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return $api.request(originalRequest);
      } catch (e) {
        processQueue(e, null);

        if (axios.isAxiosError(e) && e.response?.status === 401) {
          console.warn("Refresh token is invalid, clearing auth state");
          await handleRefreshFailure();
          return Promise.reject(
            new Error("Unauthorized: Invalid refresh token"),
          );
        }

        console.warn("Failed to refresh token");
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    throw error;
  },
);

export default $api;
