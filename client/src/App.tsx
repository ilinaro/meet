import { useEffect, useRef } from "react";
import { Routers } from "./routers/routers";
import { useDeviceTypeIdentifier } from "./lib/useDeviceTypeIdentifier";
import { useCheckAuthQuery } from "./lib";

export const App: React.FC = () => {
  useDeviceTypeIdentifier();
  const { mutate } = useCheckAuthQuery();
  const authRef = useRef(false);

  useEffect(() => {
    if (!authRef.current) {
      mutate();
      authRef.current = true;
    }
  }, []);

  return <Routers />;
};
