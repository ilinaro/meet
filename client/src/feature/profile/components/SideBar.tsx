import { useGetContacts } from "../../../lib/ChatQuery";
import { ContactList, UserInfo } from "./";
import { useSearchUsersQuery } from "../../../lib/UserQuery";
import { useDebounce } from "../../../hook";
import { Text, Input } from "../../../components";
import { SearchList } from ".";
import { useCallback, useEffect, useState } from "react";
import SocketService from "../../../services/socket.service";
import { selectUserMain } from "../../../store/userMainStateSlice";
import { ContactDeletedData, IContact, MessageData } from "../../../models";
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
  const [contactDeleted, setContactDeleted] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { data: contactsData = [] } = useGetContacts();
  console.log(contactsData)
  const { data: searchData, isLoading } =
    useSearchUsersQuery(debouncedSearchTerm);

  const handleMessageRoom = useCallback((data: MessageData) => {
    setMessageRoom(data);
  }, []);

  const handleNewContact = useCallback((data: IContact) => {
    console.log("handleNewContact", data);
    setContactRoom(data);
  }, []);

  const handleContactDeleted = useCallback((data: ContactDeletedData) => {
    setContactDeleted(data.contactId);
  }, []);

  const isStateHeader =
    (debouncedSearchTerm && debouncedSearchTerm.length >= 2) ||
    isLoading ||
    (searchData && searchData.length);

  useEffect(() => {
    SocketService.onContactDeleted(handleContactDeleted);
    SocketService.onNewContact(handleNewContact);
    SocketService.onMessageRoom(handleMessageRoom);
    SocketService.onMessage(handleMessageRoom);

    return () => {
      SocketService.offContactDeleted(handleContactDeleted);
      SocketService.offNewContact(handleNewContact);
      SocketService.offMessageRoom(handleMessageRoom);
      SocketService.offMessage(handleMessageRoom);
    };
  }, [handleMessageRoom, handleNewContact, handleContactDeleted]);

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

  useEffect(() => {
    if (!contactRoom) return;

    let isOldContact =
      contactsData &&
      contactsData.find((contact) => contact.chatId === contactRoom?.chatId);

    if (isOldContact) return;

    queryClient.setQueryData(["userContacts"], (oldData?: IContact[]) => {
      if (!oldData) {
        queryClient.invalidateQueries({ queryKey: ["userContacts"] });
        return [];
      }
      return [...oldData, contactRoom];
    });
  }, [contactRoom]);

  useEffect(() => {
    if (!contactDeleted) return;
  
    queryClient.setQueryData(["userContacts"], (oldData?: IContact[]) => {
      if (!oldData) return [];
      let nextData = oldData.filter(contact => {
        if (contact._id !== contactDeleted) {
          return contact
        }
      });
      setContactDeleted("");
      return nextData
    });
  }, [contactDeleted]);

  return (
    <div className={styles.sideBar}>
      <Input
        placeholder="Поиск"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className={styles.header}>
        <Text size={14} color="border">
          {isStateHeader ? "Поиск" : "Контакты"}
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
