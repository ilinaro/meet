import { useEffect } from "react";
import { useAppDispatch } from "../store/useAppDispatch";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { resetAuthAndUser } from "../store";
import { RouteNames } from "../routers/routeNames";

export const useAuthEventHandler = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleLogout = () => {
      queryClient.clear();
      dispatch(resetAuthAndUser());
      navigate(RouteNames.START, { replace: true });
    };

    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, [dispatch, navigate, queryClient]);
};
