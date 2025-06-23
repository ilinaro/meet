import { useEffect } from "react";

import { IContact, MessageData } from "../../models";
import { queryClient } from "../../main";
import { useAppSelector } from "../../store/useAppSelect";
import { selectUserContact } from "../../store/userContactStateSlice";
import { selectUserMain } from "../../store/userMainStateSlice";

interface MessageRoomProps {
  messageRoom?: MessageData;
}

export const useMessageRoom = ({ messageRoom }: MessageRoomProps) => {
  const userContact = useAppSelector(selectUserContact);
  const userMain = useAppSelector(selectUserMain);
  useEffect(() => {
    if (!messageRoom) return;

    queryClient.setQueryData(["userContacts"], (oldData?: IContact[]) => {
      if (!oldData) return oldData;
      let newMessageChatIdAny = messageRoom?.chatId;
      let choiceContactChatId = userContact?.chatId;
      let isNewMessage =
        userMain?._id !== messageRoom?.senderId &&
        choiceContactChatId !== messageRoom?.chatId;

      return oldData.map((messageContact) => {
        if (messageContact?.chatId === newMessageChatIdAny) {
          return {
            ...messageContact,
            message: {
              content: messageRoom?.content,
              timestamp: messageRoom?.timestamp,
              isNewMessage,
            },
          };
        }
        return messageContact;
      });
    });
  }, [messageRoom]);
};
