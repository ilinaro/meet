import dayjs from "dayjs";
import { Button, Text } from "../../../components";
import { useAddChatQuery, useDeleteChatQuery } from "../../../lib/ChatQuery";
import { IContact } from "../../../models";
import { useAppSelector } from "../../../store/useAppSelect";
import {
  selectUserContact,
  useSetUserContact,
} from "../../../store/userContactStateSlice";
import styles from "../Profile.module.scss";

export const UserProfile: React.FC = () => {
  const { mutate: deleteChat } = useDeleteChatQuery();
  const { mutate: addUser } = useAddChatQuery();
  const userContact = useAppSelector(selectUserContact);
  const setUserContact = useSetUserContact();
  const handlerDeleteChat = () => {
    if (userContact?._id) {
      deleteChat(userContact._id);
      setUserContact(undefined);
    }
  };

  const addUserInContacts = (userContact: IContact) => {
    addUser({ _id: userContact._id });
  };

  if (!userContact) return null;

  return (
    <div className={styles.profileUser}>
      <Text size={30} fw={400}>
        Профиль {userContact?.nickname}
      </Text>
      <br />
      {userContact?.isInContacts && (
        <Text size={25} fw={400} color="violet">
          {userContact?.isOnline ? "В сети" : "Не в сети"}
        </Text>
      )}
      <br />
      {!userContact?.isOnline && userContact.lastSeen && (
        <Text size={25} fw={400}>
          Был{" "}
          {userContact?.lastSeen
            ? dayjs(userContact?.lastSeen).format("DD.MM.YYYY HH:mm")
            : "очень давно"}
        </Text>
      )}
      <br />
      <Text size={25} fw={400}>
        {/* Звонки {userContact?.allowChatInvites ? "разрешены" : "запрещены"} */}
      </Text>
      <br />
      {userContact?.isInContacts ? (
        <Button onClick={handlerDeleteChat}>Удалить контакт</Button>
      ) : (
        <div className={styles.addedUser}>
          <Button onClick={() => addUserInContacts(userContact)}>
            Добавить в контакты
          </Button>
        </div>
      )}
    </div>
  );
};
