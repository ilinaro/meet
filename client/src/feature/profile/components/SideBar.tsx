import styles from "../Profile.module.scss";
import { useGetContacts } from "../../../lib/ChatQuery";
import { ContactList, UserInfo } from "./";
import { useGetUserQuery, useSearchUsersQuery } from "../../../lib/UserQuery";
import { useDebounce } from "../../../hook";
import { Text, Input } from "../../../components";
import { SearchList } from ".";
import { useSetUserMain } from "../../../store/userMainStateSlice";

import { useEffect, useState } from "react";
import SocketService from "../../../services/socket.service";
import { selectUserMain } from "../../../store/userMainStateSlice";
import { ContactData, MessageData } from "../../../models";
import { queryClient } from "../../../main";
import { useAppSelector } from "../../../store/useAppSelect";
import { selectUserContact } from "../../../store/userContactStateSlice";

export const SideBar: React.FC = () => {
  const setUserMain = useSetUserMain();

  const { data, isSuccess } = useGetUserQuery();


  useEffect(() => {
    if (data && isSuccess) {
      setUserMain(data);
    }
  }, [isSuccess]);

  const userContact = useAppSelector(selectUserContact);
  const userMain = useAppSelector(selectUserMain);

  const [searchTerm, setSearchTerm] = useState<string>("");

  const [messageRoom, setMessageRoom] = useState<MessageData>();
  const [contactRoom, setContactRoom] = useState<ContactData>();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);


  const { data: contactsData } = useGetContacts();
  const { data: searchData, isLoading } =
    useSearchUsersQuery(debouncedSearchTerm);

  useEffect(() => {
    if (userMain?._id) {
      if (!SocketService.isConnected()) {
        SocketService.connect(userMain._id)
          .then(() => {
            console.log("ChatContainer: Подключено к сокету");
          })
          .catch((error) => {
            console.error("ChatContainer: Ошибка подключения:", error);
          });
      }

      SocketService.onMessageRoom((data) => {
          setMessageRoom(data)
      });

      SocketService.onNewContact((data: ContactData) => {
        setContactRoom(data)
      });

      SocketService.onError((error) => {
        console.error("ChatContainer: Ошибка сокета:", error.message);
      });

      return () => {
        SocketService.disconnect();
      };
    }
  }, [userMain?._id]);

  useEffect(() => {
    if (messageRoom?.senderId !== userContact?._id) {
      console.log("messageRoom", messageRoom)
    }
  }, [messageRoom])

  useEffect(() => {
    let isOldContact = contactsData && contactsData?.find(contact => contact.chatId === contactRoom?.chatId)
    if (isOldContact) return
    queryClient.invalidateQueries({ queryKey: ["userContacts"] });
  }, [contactRoom])

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
