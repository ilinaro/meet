import { useAddChatQuery } from "../../../lib/ChatQuery";
import { Button, Text } from "../../../components";
import styles from "../Profile.module.scss";
import { useAppSelector } from "../../../store/useAppSelect";
import { selectUserContact } from "../../../store/userContactStateSlice";

type Props = {
  toggleInfo: () => void;
};

export const UserHeader: React.FC<Props> = ({ toggleInfo }) => {
  const userContact = useAppSelector(selectUserContact);
  const { mutate: addUser } = useAddChatQuery();
  const addUserInContacts = (id: string) => {
    addUser(id);
  };

  return (
    <div className={styles.userHeader}>
      <div className={styles.name} onClick={toggleInfo}>
        <div className={styles.photoContact}>
          {userContact && userContact.isOnline && (
            <div className={styles.status}></div>
          )}
          <Text size={35} color="violet">
            {userContact?.nickname?.[0]?.toUpperCase() || "..."}
          </Text>
        </div>
        {userContact?.nickname}
      </div>
      {!userContact?.isInContacts && (
        <div className={styles.addedUser}>
          <Button
            onClick={() => userContact && addUserInContacts(userContact._id)}
          >
            +
          </Button>
        </div>
      )}
    </div>
  );
};
