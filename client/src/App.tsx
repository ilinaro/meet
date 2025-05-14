import { useEffect } from "react";
import { Routers } from "./routers/routers";
import { useDeviceTypeIdentifier } from "./lib/useDeviceTypeIdentifier";
import { useAppDispatch } from "./store/useAppDispatch";
import { useAppSelector } from "./store/useAppSelect";
import { toggleAuthState } from "./store/authStateSlice";

export const App: React.FC = () => {
  const accessToken = localStorage.getItem("token");
  const dispatch = useAppDispatch();
  const { isLogin } = useAppSelector((state) => state.authState);

  useDeviceTypeIdentifier();

  useEffect(() => {
    if (accessToken) {
      dispatch(toggleAuthState({ isLogin: true }));
    } else {
      dispatch(toggleAuthState({ isLogin: false }));
    }
  }, []);

  if (isLogin === undefined) {
    return <></>;
  }

  return <Routers />;
};
