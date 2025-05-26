import { useEffect, useState } from "react";
import { useAppSelector } from "../../store/useAppSelect";
import { selectUserContact } from "../../store/userContactStateSlice";
import { StartMessage, UserMessage } from "./components";
import { SideBar } from "./components/SideBar";
import styles from "./Profile.module.scss";
import SocketService from "../../services/socket.service";
import { selectUserMain } from "../../store/userMainStateSlice";


interface MessageData {
  senderId: string;
  content: string;
  timestamp: string;
  chatId?: string;
}

interface ContactData {
  senderId: string;
  chatId: string;
  timestamp: string;
}

export const Profile: React.FC = () => {
  const userContact = useAppSelector(selectUserContact);
  const userMain = useAppSelector(selectUserMain);
  const [notifications, setNotifications] = useState<MessageData[]>([]);
  const [contactNotifications, setContactNotifications] = useState<ContactData[]>([]); // Новое состояние для контактов
  // const [notifications, setNotifications] = useState<MessageData[]>([]);

  useEffect(() => {
    if (userMain?._id) {
      if (!SocketService.isConnected()) {
        SocketService.connect(userMain._id)
          .then(() => {
            console.log("ChatContainer: Подключено к сокету");
          })
          .catch((error) => {
            console.error("ChatContainer: Ошибка подключения:", error);
          });
      }

      // Слушаем новые сообщения
      // SocketService.onTestMessage1((data: MessageData) => {
      //   console.log(`ChatContainer: Новое сообщение от ${data.senderId}: ${data.content}`);
      //   setNotifications((prev) => [...prev, data]);
      //   alert(`Новое сообщение от ${data.senderId}: ${data.content}`);
      // });
      SocketService.onTestMessage1((data) => {
        if (data?.chatId !== userContact?.chatId) { // Только для неактивных чатов
          setNotifications((prev) => [...prev, data]);
          alert(`Новое сообщение от ${data.senderId}: ${data.content}`);
        }
      });
      // Слушаем добавление в контакты
      SocketService.onNewContact((data: ContactData) => {
        console.log(`ChatContainer: Тебя добавили в контакты: ${data.senderId}`);
        setContactNotifications((prev) => [...prev, data]);
        alert(`Тебя добавили в контакты: ${data.senderId}`);
      });

      // Слушаем ошибки
      SocketService.onError((error) => {
        console.error("ChatContainer: Ошибка сокета:", error.message);
      });

      return () => {
        SocketService.disconnect();
      };
    }
  }, [userMain?._id]);

  return (
    <div className={styles.content}>
      <SideBar />
      {userContact ? <UserMessage /> : <StartMessage />}
    </div>
  );
};
