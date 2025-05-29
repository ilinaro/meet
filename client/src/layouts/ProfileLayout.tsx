import { Outlet } from "react-router-dom";
import styles from "./ProfileLayout.module.scss";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../components";
import { Header } from "../components/Header/Header";
import { useCallback, useEffect, useState } from "react";
import { selectUserMain, useSetUserMain } from "../store/userMainStateSlice";
import { useAppSelector } from "../store/useAppSelect";
import SocketService from "../services/socket.service";
import { IContact, UserStatus } from "../models";
import { useGetUserQuery, useGetUserStatuses } from "../lib/UserQuery";
import { selectUserContact, useSetUserContact } from "../store/userContactStateSlice";
import { useGetContacts } from "../lib/ChatQuery";
import { queryClient } from "../main";
import { Loader } from "@mantine/core";
import { Text } from "../components";

type Props = {
  children?: React.ReactNode;
};

export const ProfileLayout: React.FC<Props> = () => {
  const setUserMain = useSetUserMain();
  const userContact = useAppSelector(selectUserContact);
  const setUserContact = useSetUserContact();
  const [errorConnect, setErrorConnect] = useState<any>();
  const { data: contactsData, isSuccess: isSuccessContacts } = useGetContacts();

  const handleUserStatus = useCallback((data: UserStatus) => {
    setUserStatus(data);
  }, []);

  const { data, isSuccess } = useGetUserQuery();
  
  useEffect(() => {
    if (data && isSuccess) {
      setUserMain(data);
    }
  }, [isSuccess, data, setUserMain]);

  const handleError = useCallback((error: any) => {
    setErrorConnect(error)
    console.error("ChatContainer: Ошибка сокета:", error.message);
  }, []);

  const status = SocketService.isConnected()
  const contactIds = contactsData?.map((contact) => contact._id) || [];
  const { data: statusesData } = useGetUserStatuses(contactIds);

  const [userStatus, setUserStatus] = useState<UserStatus>();
  const userMain = useAppSelector(selectUserMain);

  useEffect(() => {
    if (userMain?._id) {
      if (!status) {
        SocketService.connect(userMain._id)
          .then(() => {
            setErrorConnect("")
            console.log("ChatContainer: Подключено к сокету")
          })
          .catch((error) => {
            console.error("ChatContainer: Ошибка подключения:", error)
          });
      }

      SocketService.onUserStatus(handleUserStatus);
      SocketService.onError(handleError);

      return () => {
        SocketService.offUserStatus(handleUserStatus);
        SocketService.offError(handleError);
        SocketService.disconnect();
      };
    }
  }, [userMain?._id, handleUserStatus, handleError]);

  useEffect(() => {
    if (statusesData && contactsData) {
      queryClient.setQueryData(["userContacts"], (oldData?: IContact[]) => {
        if (!oldData) return oldData;

        return oldData.map((contact) => {
          const status = statusesData[contact._id];
          if (status) {
            if (contact._id === userContact?._id) {
              setUserContact({
                ...contact,
                isOnline: status.isOnline,
                lastSeen: status.lastSeen,
              });
            };
            return {
              ...contact,
              isOnline: status.isOnline,
              lastSeen: status.lastSeen,
            };
          }
          return contact;
        });
      });
    }
  }, [statusesData, isSuccessContacts]);

  useEffect(() => {
    queryClient.setQueryData(["userContacts"], (oldData?: IContact[]) => {
      if (!oldData) return oldData;
      return oldData.map((contact) => {
        if (contact._id === userStatus?.userId) {
          if (contact._id === userContact?._id) {
            setUserContact({
              ...contact,
              isOnline: userStatus?.isOnline,
              lastSeen: userStatus?.lastSeen ?? null,
            });
          };
          return {
            ...contact,
            isOnline: userStatus?.isOnline,
            lastSeen: userStatus?.lastSeen ?? null,
          };
        }
        return contact;
      });
    });
  }, [userStatus])

  return (
    <div className={styles.wrapper}>
      <Header />
      {!status && errorConnect && <Text size={20} fw={500} color={"red"}>{"Ошибка подключения"}</Text>}
      {!status && !errorConnect ?
        <div className={styles.loaderContainer}>
          <>
            <Loader size={20} color="gray" />
            <Text size={20} fw={500} color={"gray"}>Подключение...</Text>
          </>
        </div> :
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Outlet />
        </ErrorBoundary>
      }
    </div>
  );
};
