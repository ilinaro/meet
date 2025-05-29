import { useGetContacts } from "../../../lib/ChatQuery";
import { ContactList, UserInfo } from "./";
import { useGetUserQuery, useSearchUsersQuery } from "../../../lib/UserQuery";
import { useDebounce } from "../../../hook";
import { Text, Input } from "../../../components";
import { SearchList } from ".";
import { useCallback, useEffect, useState } from "react";
import SocketService from "../../../services/socket.service";
import { selectUserMain } from "../../../store/userMainStateSlice";
import { IContact, MessageData } from "../../../models";
import { queryClient } from "../../../main";
import { useAppSelector } from "../../../store/useAppSelect";
import styles from "../Profile.module.scss";
import { selectUserContact } from "../../../store/userContactStateSlice";

export const SideBar: React.FC = () => {
  

  const userMain = useAppSelector(selectUserMain);
  const userContact = useAppSelector(selectUserContact);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [messageRoom, setMessageRoom] = useState<MessageData>();
  const [contactRoom, setContactRoom] = useState<IContact>();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { data: contactsData } = useGetContacts();
  const { data: searchData, isLoading } = useSearchUsersQuery(debouncedSearchTerm);

  const handleMessageRoom = useCallback((data: MessageData) => {
    setMessageRoom(data);
  }, []);

  const handleNewContact = useCallback((data: IContact) => {
    setContactRoom(data);
  }, []);

  useEffect(() => {
    SocketService.onNewContact(handleNewContact);
    SocketService.onMessageRoom(handleMessageRoom);
    SocketService.onMessage(handleMessageRoom);

    return () => {
      SocketService.offNewContact(handleNewContact);
      SocketService.offMessageRoom(handleMessageRoom);
      SocketService.offMessage(handleMessageRoom);
    };
  }, [handleMessageRoom, handleNewContact]);

  useEffect(() => {
    queryClient.setQueryData(["userContacts"], (oldData?: IContact[]) => {
      if (!oldData) return oldData;

      return oldData.map((messageContact) => {
        let contactListChatId = messageContact?.chatId;
        let newMessageChatIdAny = messageRoom?.chatId;
        let choiceContactChatId = userContact?.chatId;

        let isNewMessage =
          userMain?._id !== messageRoom?.senderId &&
          choiceContactChatId !== messageRoom?.chatId;

        if (contactListChatId === newMessageChatIdAny) {
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

  useEffect(() => {
    let isOldContact =
      contactsData &&
      contactsData?.find((contact) => contact.chatId === contactRoom?.chatId);

    if (isOldContact) return;

    queryClient.setQueryData(["userContacts"], (oldData?: IContact[]) => {
      if (!oldData) {
        queryClient.invalidateQueries({ queryKey: ["userContacts"] });
        return;
      }
      if (contactRoom) {
        return [...oldData, contactRoom];
      }
    });
  }, [contactRoom, contactsData]);

  return (
    <div className={styles.sideBar}>
      <Input
        placeholder="Поиск"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className={styles.header}>
        <Text size={14} color="border">
          {(debouncedSearchTerm && debouncedSearchTerm.length >= 2) ||
            isLoading ||
            (searchData && searchData.length)
            ? "Поиск"
            : "Контакты"}
        </Text>
      </div>
      <div className={styles.contacts}>
        {debouncedSearchTerm && debouncedSearchTerm.length >= 2 ? (
          <SearchList
            contactsData={contactsData}
            searchData={searchData}
            isLoading={isLoading}
            searchUser={debouncedSearchTerm}
          />
        ) : (
          <ContactList contactsData={contactsData} />
        )}
      </div>
      <UserInfo />
    </div>
  );
};
