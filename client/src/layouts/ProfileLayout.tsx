import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { useCallback, useState } from "react";

import { Header, ErrorFallback } from "../components";
import { UserStatus } from "../models";
import SocketService from "../services/socket.service";
import {
  useSocketConnection,
  useUserMainInitializer,
  useFirstLoadingContactStatuses,
  useUpdateContactStatuses,
} from "../hook/global";

import styles from "./ProfileLayout.module.scss";
import { LoaderAndConnect } from "./components/LoaderAndConnect";

type Props = {
  children?: React.ReactNode;
};

export const ProfileLayout: React.FC<Props> = () => {
  const [errorConnect, setErrorConnect] = useState();
  const [updateContactStatus, setUpdateContactStatus] = useState<UserStatus>();

  useUserMainInitializer();
  useFirstLoadingContactStatuses();

  const handleUserStatus = useCallback((data: UserStatus) => {
    setUpdateContactStatus(data);
  }, []);

  useUpdateContactStatuses({ updateContactStatus });

  useSocketConnection({
    handleUserStatus,
    setErrorConnect,
  });

  return (
    <div className={styles.wrapper}>
      <Header />
      {SocketService.isConnected() ? (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Outlet />
        </ErrorBoundary>
      ) : (
        <LoaderAndConnect errorConnect={!!errorConnect} />
      )}
    </div>
  );
};
