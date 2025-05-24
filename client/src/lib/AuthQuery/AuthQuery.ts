import { useMutation } from "@tanstack/react-query";
import { RegisterData, LoginData, AuthResponse } from "../../models";
import AuthService from "../../services/auth.service";
import { toggleAuthState } from "../../store/authStateSlice";
import { useAppDispatch } from "../../store/useAppDispatch";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "../../routers/routeNames";
import { useHadlerError } from "../useHadlerError";
import { AxiosResponse } from "axios";
import { setToken } from "../../services/token.service";
import { handleRefreshFailure } from "../../http";
import { queryClient } from "../../main";

export const useSignupQuery = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterData) => AuthService.registration(data),
    onSuccess: (response: AxiosResponse<AuthResponse>) => {
      if (response.data.accessToken) {
        setToken(response.data.accessToken);
      }
      dispatch(toggleAuthState({ isLogin: true }));
      navigate(RouteNames.PROFILE);
    }, 
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Ошибка регистрации";
      useHadlerError(message);
      dispatch(toggleAuthState({ isLogin: false }));
    },
  });
};

export const useLoginQuery = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: LoginData) => await AuthService.login(data),
    onSuccess: (response: AxiosResponse<AuthResponse>) => {
      if (response.data.accessToken) {
        setToken(response.data.accessToken);
      }
      dispatch(toggleAuthState({ isLogin: true }));
      navigate(RouteNames.PROFILE);
      queryClient.refetchQueries({ queryKey: ["userData"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Ошибка входа в систему";
      useHadlerError(message);
      dispatch(toggleAuthState({ isLogin: false }));
    },
  });
};

export const useLogoutQuery = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      try {
        await AuthService.logout();
      } catch (error) {
        console.error("Logout failed", error);
      } finally {
        handleRefreshFailure();
        navigate(RouteNames.LOGIN);
      }
    },
  });
};

export const useCheckAuthQuery = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation<AxiosResponse<AuthResponse>, Error>({
    mutationFn: async () => await AuthService.checkAuth(),
    onSuccess: (response: AxiosResponse<AuthResponse>) => {
      dispatch(toggleAuthState({ isLogin: true }));
      setToken(response.data.accessToken);
    },
    onError: () => {
      handleRefreshFailure();
      navigate(RouteNames.LOGIN);
    },
  });
};
