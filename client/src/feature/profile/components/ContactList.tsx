import React from "react";
import { IContact } from "../../../models";
import { Text } from "../../../components";
import styles from "../Profile.module.scss";
import clsx from "clsx";
import { useAppSelector } from "../../../store/useAppSelect";
import {
  selectUserContact,
  useSetUserContact,
} from "../../../store/userContactStateSlice";

type Props = {
  contactsData?: IContact[];
};

export const ContactList: React.FC<Props> = React.memo(({ contactsData }) => {
  const setUserContact = useSetUserContact();
  const userContact = useAppSelector(selectUserContact);

  const isListNoEmpty = contactsData && contactsData.length > 0

  return (
    <div className={styles.searchResults}>
      { isListNoEmpty &&
        contactsData.map((contact) => (
          <div
            key={contact._id}
            className={clsx(
              styles.searchResultItem,
              contact._id === userContact?._id && styles.action,
            )}
            onClick={() => setUserContact(contact)}
          >
            <div className={styles.photoContants}>
              {/* {contact.isOnline && <div className={styles.status}></div>} */}
              <Text size={35} color="violet">
                {contact.nickname?.[0]?.toUpperCase() || "..."}
              </Text>
            </div>
            <Text size={24} color={"black-general"}>
              {contact.nickname}
            </Text>
          </div>
        ))}
    </div>
  );
});
