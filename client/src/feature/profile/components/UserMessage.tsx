import React, { useEffect } from "react";
import { UserProfile } from "./UserProfile";
import { ChatRoom } from "./ChatRoom";
import {
  isInfoExpanded,
  selectUserContact,
} from "../../../store/userContactStateSlice";
import { useSelector } from "react-redux";
import styles from "../Profile.module.scss";
import { useChatConnectQuery } from "../../../lib/ChatQuery";
import { useAppSelector } from "../../../store/useAppSelect";

export const UserMessage: React.FC = React.memo(() => {
  const isInfoContact = useSelector(isInfoExpanded);
  const userContact = useAppSelector(selectUserContact);
  const { data, mutate } = useChatConnectQuery();

  useEffect(() => {
    if (userContact?._id) {
      mutate(userContact._id);
    }
  }, [userContact?._id, mutate]);

  return (
    <div className={styles.children}>
      {isInfoContact ? <UserProfile /> : <ChatRoom chatId={data?.chatId} />}
    </div>
  );
});
