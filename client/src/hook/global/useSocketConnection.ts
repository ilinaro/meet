import { useEffect, useCallback } from "react";
import SocketService from "../../services/socket.service";
import { UserStatus } from "../../models";
import { useAppSelector } from "../../store/useAppSelect";
import { selectUserMain } from "../../store/userMainStateSlice";

interface SocketConnectionProps {
  setErrorConnect: (error: any) => void;
  handleUserStatus: (data: UserStatus) => void;
}

export const useSocketConnection = ({
  setErrorConnect,
  handleUserStatus,
}: SocketConnectionProps) => {
  const userMain = useAppSelector(selectUserMain);
  const handleError = useCallback((error: any) => {
    setErrorConnect(error);
    console.error("SocketConnection: Ошибка сокета:", error.message);
  }, []);

  useEffect(() => {
    if (userMain?._id) {
      if (!SocketService.isConnected()) {
        SocketService.connect(userMain?._id)
          .then(() => {
            setErrorConnect("");
          })
          .catch((error) => {
            setErrorConnect(error);
            console.error("ChatContainer: Ошибка подключения:", error);
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
};
