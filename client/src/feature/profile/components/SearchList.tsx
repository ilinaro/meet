import React, { useMemo } from "react";
import { Text } from "../../../components";
import { motion } from "framer-motion";
import { Loader } from "@mantine/core";
import { IContact } from "../../../models";
import { useAppSelector } from "../../../store/useAppSelect";
import clsx from "clsx";
import styles from "../Profile.module.scss";
import {
  selectUserContact,
  useSetUserContact,
} from "../../../store/userContactStateSlice";

type Props = {
  searchUser?: string;
  searchData?: IContact[];
  contactsData?: IContact[];
  isLoading: boolean;
};

export const SearchList: React.FC<Props> = React.memo(
  ({ searchData, isLoading = false, searchUser, contactsData }) => {
    const isListNoEmpty = searchUser && searchUser.length >= 2 && !isLoading;
    const setUserContact = useSetUserContact();
    const userContact = useAppSelector(selectUserContact);

    const contactsSet = useMemo(() =>
      new Set(contactsData?.map(contact => contact._id)),
      [contactsData]
    );

    const choiceUser = (userItem: IContact) => {
      setUserContact({
        ...userItem,
        isInContacts: contactsSet.has(userItem._id)
      });
    }
    
    return (
      <div className={styles.searchResults}>
        {isLoading && (
          <div className={styles.searchResultItem}>
            <Loader color="gray" size={20} />
          </div>
        )}
        {searchData && searchData.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {searchData.map((userItem) => {
              if (userItem.isInContacts) return null;
              return (
                <div
                  key={userItem._id}
                  className={clsx(
                    styles.searchResultItem,
                    userItem._id === userContact?._id && styles.action,
                  )}
                  onClick={() => choiceUser(userItem)}
                >
                  <div className={styles.photoContants}>
                    <Text size={35} color="violet">
                      {userItem.nickname?.[0]?.toUpperCase() || "..."}
                    </Text>
                  </div>

                  <Text size={24} color={"black-general"}>
                    {userItem.nickname}
                  </Text>
                </div>
              );
            })}
          </motion.div>
        ) : (
          <>
            {isListNoEmpty && (
              <div className={styles.searchResultItem}>
                <Text size={14} color={"gray"}>
                  Нет результатов
                </Text>
              </div>
            )}
          </>
        )}
      </div>
    );
  },
);