import { useEffect } from "react";

import { ContactDeletedData, IContact, MessageData } from "../../models";
import SocketService from "../../services/socket.service";

export const useSocketSubscriptions = (
  onMessageRoom: (data: MessageData) => void,
  onNewContact: (data: IContact) => void,
  onContactDeleted: (data: ContactDeletedData) => void
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
