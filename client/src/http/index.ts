import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { getToken, removeToken, setToken } from "../services/token.service";
import { AuthResponse } from "../models";
import { queryClient } from "../main";
import store, { resetAuthAndUser } from "../store";

export const WS_URL = import.meta.env.VITE_WS_URL || "http://localhost:4001"; // Добавлена проверка переменной окружения для WS_URL
export const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`; // Добавлена заглушка для VITE_API_URL

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
  removeToken();
  queryClient.invalidateQueries({ queryKey: ["checkAuth", "userMain"] });
  store.dispatch(resetAuthAndUser());
};

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
  timeout: 10000, // Добавлен таймаут для всех запросов (10 секунд)
});

$api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { token } = getToken();
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
        // Добавлен таймаут для запроса на обновление токена
        const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
          withCredentials: true,
          timeout: 5000, // Таймаут 5 секунд для запроса обновления
        });

        // Добавлена проверка наличия accessToken
        const { accessToken } = response.data;
        if (!accessToken || typeof accessToken !== "string") {
          throw new Error("Invalid or missing accessToken in refresh response");
        }

        setToken(accessToken);
        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return $api.request(originalRequest);
      } catch (e) {
        processQueue(e, null);

        // Улучшена проверка ошибки без приведения к any
        if (axios.isAxiosError(e) && e.response?.status === 401) {
          // Изменено логирование для минимизации утечек информации
          console.warn("Refresh token is invalid, clearing auth state");
          handleRefreshFailure();
          return Promise.reject(new Error("Unauthorized: Invalid refresh token"));
        }

        // Изменено логирование для большей безопасности
        console.warn("Failed to refresh token");
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    throw error;
  }
);

export default $api;