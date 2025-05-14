import { useMutation } from "@tanstack/react-query";
import { RegisterData, LoginData, AuthResponse } from "../../models";
import AuthService from "../../services/auth.service";
import { toggleAuthState } from "../../store/authStateSlice";
import { useAppDispatch } from "../../store/useAppDispatch";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "../../routers/routeNames";
import { useHadlerError } from "../useHadlerError";
import { AxiosResponse } from "axios";

export const useSignupQuery = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterData) => AuthService.registration(data),
    onSuccess: () => {
      dispatch(toggleAuthState({ isLogin: true }));
      navigate(RouteNames.PROFILE);
    },
    onError: (error: any) => {
      useHadlerError(error?.response?.data?.message);
      dispatch(toggleAuthState({ isLogin: false }));
    },
  });
};

export const useLoginQuery = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginData) => AuthService.login(data),
    onSuccess: () => {
      dispatch(toggleAuthState({ isLogin: true }));
      navigate(RouteNames.PROFILE);
    },
    onError: (error: any) => {
      useHadlerError(error?.response?.data?.message);
      dispatch(toggleAuthState({ isLogin: false }));
    },
  });
};

export const useLogoutQuery = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSettled: () => {
      localStorage.removeItem("token");
      dispatch(toggleAuthState({ isLogin: false }));
      navigate(RouteNames.START);
    },
  });
};

export const useCheckAuthQuery = () => {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: () => AuthService.checkAuth(),
    onSuccess: (response: AxiosResponse<AuthResponse>) => {
      localStorage.setItem("token", response.data.accessToken);
      dispatch(toggleAuthState({ isLogin: true }));
    },
    onError: () => {
      dispatch(toggleAuthState({ isLogin: false }));
      localStorage.removeItem("token");
    },
  });
};
