import { useEffect, useRef } from "react";
import { Routers } from "./routers/routers";
import { useDeviceTypeIdentifier } from "./lib/useDeviceTypeIdentifier";
import { useCheckAuthQuery } from "./lib";
import { selectAccessToken } from "./store/accessStateSlice";
import store from "./store";
import { useAppSelector } from "./store/useAppSelect";

export const App: React.FC = () => {
  useDeviceTypeIdentifier();
  const { mutate } = useCheckAuthQuery();
  const authRef = useRef(false);
  const token = selectAccessToken(store.getState());
  const { isLogin } = useAppSelector((state) => state.authState);

  useEffect(() => {
    if (!authRef.current) {
      mutate();
      authRef.current = true;
    }
  }, []);

  if (!token && isLogin === undefined) return <></>;
  return <Routers />;
};
