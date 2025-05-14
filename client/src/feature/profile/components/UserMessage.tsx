import React from "react";
import { useAppSelector } from "../../../store/useAppSelect";
import { useEffect, useState } from "react";
import { UserProfile } from "./UserProfile";
import { Chat } from "./Chat";
import { UserHeader } from "./UserHeader";
import styles from "../Profile.module.scss";
import { selectUserContact } from "../../../store/userContactStateSlice";

export const UserMessage: React.FC = React.memo(() => {
  const [openProfile, setOpenProfile] = useState(false);
  const userContact = useAppSelector(selectUserContact);

  const toggleInfo = () => {
    setOpenProfile(!openProfile);
  };

  useEffect(() => {
    setOpenProfile(false);
  }, [userContact?._id]);

  return (
    <div className={styles.children}>
      {userContact && (
        <>
          <UserHeader toggleInfo={toggleInfo} />
          {openProfile ? <UserProfile /> : <Chat />}
        </>
      )}
    </div>
  );
});
