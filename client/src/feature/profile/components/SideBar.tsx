import styles from "../Profile.module.scss";
import { useGetContacts } from "../../../lib/ChatQuery";
import { ContactList, UserInfo } from "./";
import { useGetUserQuery, useSearchUsersQuery } from "../../../lib/UserQuery";
import { useDebounce } from "../../../hook";
import { useEffect, useState } from "react";
import { Text, Input } from "../../../components";
import { SearchList } from ".";
import { useSetUserMain } from "../../../store/userMainStateSlice";

export const SideBar: React.FC = () => {
  const setUserMain = useSetUserMain();

  const { data, isSuccess } = useGetUserQuery();

  useEffect(() => {
    if (data && isSuccess) {
      setUserMain(data);
    }
  }, [isSuccess]);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: contactsData } = useGetContacts();
  const { data: searchData, isLoading } =
    useSearchUsersQuery(debouncedSearchTerm);

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
