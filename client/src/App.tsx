import { useEffect, useRef } from "react";
import { Routers } from "./routers/routers";
import { useDeviceTypeIdentifier } from "./lib/useDeviceTypeIdentifier";
import { useCheckAuthQuery } from "./lib";
import { getToken } from "./services/token.service";
import { handleRefreshFailure } from "./http";

export const App: React.FC = () => {
  useDeviceTypeIdentifier();
  const { mutate } = useCheckAuthQuery();
  const { token } = getToken();
  const authRef = useRef(false);

  useEffect(() => {
    if (token && !authRef.current) {
      mutate();
      authRef.current = true;
    }
    if (!token) {
      handleRefreshFailure()
    }
  }, []);

  return <Routers />;
};