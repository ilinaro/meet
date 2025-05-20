import React, { useEffect, useState } from "react";
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
  const { mutate } = useChatConnectQuery();

  useEffect(() => {
    if (userContact?._id && !userContact?.chatId) {
      mutate(userContact._id);
    }
  }, [userContact?._id]);

  return (
    <div className={styles.children}>
      {isInfoContact ? <UserProfile /> : <ChatRoom />}
    </div>
  );
});
