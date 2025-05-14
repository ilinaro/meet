import React, { useState } from "react";
import { Text } from "../../components";
import Input from "../../components/Input/Input";
import { useSearchUsersQuery } from "../../lib/UserQuery";
import { useDebounce } from "../../hook";
import { SearchList } from "./components/SearchList";
import { ContactList, UserInfo, UserMessage } from "./components";
import { useGetContacts } from "../../lib/ChatQuery";
import styles from "./Profile.module.scss";

export const Profile: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { data: searchData, isLoading } =
    useSearchUsersQuery(debouncedSearchTerm);
  const { data: contactsData } = useGetContacts();

  return (
    <div className={styles.content}>
      <div className={styles.menu}>
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
      <UserMessage />
    </div>
  );
};
