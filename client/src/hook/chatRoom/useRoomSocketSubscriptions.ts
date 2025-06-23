import { useEffect } from "react";

import { ContactDeleted, IContact, MessageData } from "../../models";
import SocketService from "../../services/socket.service";

export const useRoomSocketSubscriptions = (
  onMessageRoom: (data: MessageData) => void,
  onNewContact: (data: IContact) => void,
  onContactDeleted: (data: ContactDeleted) => void,
) => {
  useEffect(() => {
    SocketService.onContactDeleted(onContactDeleted);
    SocketService.onNewContact(onNewContact);
    SocketService.onMessageRoom(onMessageRoom);
    SocketService.onMessage(onMessageRoom);

    return () => {
      SocketService.offContactDeleted(onContactDeleted);
      SocketService.offNewContact(onNewContact);
      SocketService.offMessageRoom(onMessageRoom);
      SocketService.offMessage(onMessageRoom);
    };
  }, [onMessageRoom, onNewContact, onContactDeleted]);
};
