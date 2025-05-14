import { useEffect, useState } from "react";
import SocketService from "../../../services/socket.service";
import { useAppSelector } from "../../../store/useAppSelect";
import Input from "../../../components/Input/Input";
import { Button } from "../../../components";
import { selectUserMain } from "../../../store/userMainStateSlice";
import { selectUserContact } from "../../../store/userContactStateSlice";
import styles from "../Profile.module.scss";
import { Loader } from "@mantine/core";
import { useChatConnectQuery } from "../../../lib/ChatQuery";

interface Message {
  senderId: string;
  content: string;
  timestamp: string;
}

export const Chat: React.FC = () => {
  const userMain = useAppSelector(selectUserMain);
  const userContact = useAppSelector(selectUserContact);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { data, isPending, mutate } = useChatConnectQuery();

  useEffect(() => {
    if (userMain?._id) {
      console.log("Chat: Инициализация сокета для пользователя", userMain._id);
      if (!SocketService.isConnected()) {
        SocketService.connect(userMain._id);
      }

      SocketService.onChatJoined(({ chatId }) => {
        console.log("Chat: Присоединились к чату:", chatId);
      });

      SocketService.onMessage((message) => {
        console.log("Chat: Новое сообщение:", message);
        setMessages((prev) => {
          console.log("Chat: Обновление messages:", [...prev, message]);
          return [...prev, message];
        });
      });

      SocketService.onTestMessage((message) => {
        console.log("Chat: Новое тестовое сообщение:", message);
        setMessages((prev) => {
          console.log("Chat: Обновление messages:", [...prev, message]);
          return [...prev, message];
        });
      });

      SocketService.onError(({ message }) => {
        console.error("Chat: Ошибка сокета:", message);
      });

      return () => {
        console.log("Chat: Отключение сокета");
        SocketService.disconnect();
      };
    }
  }, [userMain?._id]);

  useEffect(() => {
    if (userContact?._id) {
      console.log("Chat: Запуск чата с контактом", userContact._id);
      mutate(userContact._id);
    }
  }, [userContact?._id, mutate]);

  useEffect(() => {
    if (data?.chatId && SocketService.isConnected()) {
      console.log("Chat: Присоединение к WebSocket-чату", data.chatId);
      userContact?._id && SocketService.joinChat(userContact._id, data.chatId);
    }
  }, [data?.chatId, userContact?._id]);

  const handleSendMessage = () => {
    if (messageInput.trim() && data?.chatId) {
      console.log("Chat: Отправка сообщения в", data.chatId);
      SocketService.sendMessage(data.chatId, messageInput);
      setMessageInput("");
    }
  };

  const handleSendTestMessage = () => {
    if (data?.chatId) {
      console.log("Chat: Отправка тестового сообщения в", data.chatId);
      SocketService.sendTestMessage(data.chatId, "Тестовое сообщение!");
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {isPending && <Loader color="gray" size={20} />}
        {messages.length === 0 && !isPending && <p>Нет сообщений</p>}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.senderId === userMain?._id
                ? styles.messageSent
                : styles.messageReceived
            }
          >
            <p>{msg.content}</p>
            <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      {data?.chatId ? (
        <div>Чат ID: {data.chatId}</div>
      ) : (
        <div>Чат не выбран</div>
      )}
      <div className={styles.inputMessage}>
        <Input
          placeholder="Сообщение..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <Button classNames={styles.enter} onClick={handleSendMessage}>
          {">"}
        </Button>
        <Button classNames={styles.testButton} onClick={handleSendTestMessage}>
          Тест
        </Button>
      </div>
    </div>
  );
};
