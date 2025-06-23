import { ContactList, UserInfo } from "./";
import { Text, Input } from "../../../components";
import { SearchList } from ".";
import { useCallback, useState } from "react";
import styles from "../Profile.module.scss";
import { useGetContacts } from "../../../lib/ChatQuery";
import { ContactDeleted, IContact, MessageData } from "../../../models";
import {
  useContactDeleted,
  useMessageRoom,
  useNewContact,
  useSearch,
  useSocketSubscriptions,
} from "../../../hook/sideBar";

export const SideBar: React.FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    searchData,
    isLoading,
    isStateHeader,
  } = useSearch();
  const { data: contactsData = [] } = useGetContacts();

  const [messageRoom, setMessageRoom] = useState<MessageData>();
  const [contactRoom, setContactRoom] = useState<IContact>();
  const [contactDeleted, setContactDeleted] = useState("");

  const handleMessageRoom = useCallback((data: MessageData) => {
    setMessageRoom(data);
  }, []);

  const handleNewContact = useCallback((data: IContact) => {
    setContactRoom(data);
  }, []);

  const handleContactDeleted = useCallback(({ contactId }: ContactDeleted) => {
    setContactDeleted(contactId);
  }, []);

  useMessageRoom({ messageRoom });
  useNewContact({ contactRoom, contactsData });
  useContactDeleted({ contactDeleted, setContactDeleted });

  useSocketSubscriptions(
    handleMessageRoom,
    handleNewContact,
    handleContactDeleted,
  );

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
        {isStateHeader ? (
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
