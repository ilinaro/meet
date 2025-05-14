import { Button, Text } from "../../../components";
import { useDeleteChatQuery } from "../../../lib/ChatQuery";
import { useAppSelector } from "../../../store/useAppSelect";
import {
  selectUserContact,
  useSetUserContact,
} from "../../../store/userContactStateSlice";

import styles from "../Profile.module.scss";

export const UserProfile: React.FC = () => {
  const { mutate: deleteChat } = useDeleteChatQuery();
  const userContact = useAppSelector(selectUserContact);
  const setUserContact = useSetUserContact();
  const handlerDeleteChat = () => {
    if (userContact?._id) {
      deleteChat(userContact._id);
      setUserContact(undefined);
    }
  };

  return (
    <div className={styles.profileUser}>
      <Text size={30} fw={400}>
        Профиль {userContact?.nickname}
      </Text>
      <br />
      <Text size={25} fw={400} color="violet">
        {userContact?.isOnline ? "В сети" : "Не в сети"}
      </Text>
      <br />
      <Text size={25} fw={400}>
        {userContact?.lastSeen ? userContact?.lastSeen : "очень давно"}
      </Text>
      <br />
      <Text size={25} fw={400}>
        Звонки {userContact?.allowChatInvites ? "разрешены" : "запрещены"}
      </Text>
      <br />
      {userContact?.isInContacts && (
        <Button onClick={handlerDeleteChat}>
          Удалить чат с {userContact?.nickname}
        </Button>
      )}
    </div>
  );
};
