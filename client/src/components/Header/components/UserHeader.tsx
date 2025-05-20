import { Text } from "../..";
import { useAppSelector } from "../../../store/useAppSelect";
import {
  isInfoExpanded,
  selectUserContact,
  useToggleInfo,
} from "../../../store/userContactStateSlice";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./UserHeader.module.scss";

export const UserHeader: React.FC = () => {
  const isHeaderExpanded = useSelector(isInfoExpanded);
  const userContact = useAppSelector(selectUserContact);

  const toggleInfo = useToggleInfo();

  useEffect(() => {
    toggleInfo(false);
  }, [userContact?._id]);

  if (!userContact?._id) return null;

  return (
    <div className={styles.userHeader}>
      <div
        className={styles.name}
        onClick={() => toggleInfo(!isHeaderExpanded)}
      >
        <div className={styles.photoContact}>
          {/* {userContact && userContact.isOnline && (
            <div className={styles.status}></div>
          )} */}
          <Text size={35} color="violet">
            {userContact?.nickname?.[0]?.toUpperCase() || "..."}
          </Text>
        </div>
        {userContact?.nickname}
      </div>
    </div>
  );
};
