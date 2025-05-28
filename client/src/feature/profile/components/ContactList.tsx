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
import dayjs from "dayjs";

type Props = {
  contactsData?: IContact[];
};

export const ContactList: React.FC<Props> = React.memo(({ contactsData }) => {
  const setUserContact = useSetUserContact();
  const userContact = useAppSelector(selectUserContact);

  const isListNoEmpty = contactsData && contactsData.length > 0;

  return (
    <div className={styles.searchResults}>
      {isListNoEmpty &&
        contactsData.map((contact) => (
          <div
            key={contact._id}
            className={clsx(
              styles.searchResultItem,
              contact._id === userContact?._id && styles.action,
            )}
            onClick={() => setUserContact(contact)}
          >
            {/* {contact.isOnline && <div className={styles.status}></div>} */}
            <div className={styles.photoContants}>
              <Text size={35} color="violet">
                {contact.nickname?.[0]?.toUpperCase() || "..."}
              </Text>
            </div>
            <div className={styles.contactInfo}>
              <div className={styles.nameContact}>
                <div className={styles.textName}>
                  <Text size={22} color={"black-general"}>
                    {contact.nickname}
                  </Text>
                </div>
                {contact?.message?.isNewMessage && (
                  <div className={styles.newMessage}></div>
                )}
                <div>
                </div>
              </div>
              <div className={styles.messageContact}>
                <div className={styles.textContainer}>
                  {contact?.message && (
                    <Text size={14} color="border" className={styles.textMessage}>
                      {contact.message?.content}
                    </Text>
                  )}
                </div>
                <div className={styles.timeMessage}>
                  <Text size={10} color="gray">
                    {contact.message?.timestamp &&
                      dayjs(contact.message?.timestamp).format("DD.MM HH:mm")
                    }
                  </Text>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div >
  );
});
