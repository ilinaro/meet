import { useEffect, useRef, useState } from "react";
import SocketService from "../../../services/socket.service";
import { useAppSelector } from "../../../store/useAppSelect";
import { Button, Text, Input } from "../../../components";
import { selectUserMain } from "../../../store/userMainStateSlice";
import { selectUserContact } from "../../../store/userContactStateSlice";
import { useAddChatQuery } from "../../../lib/ChatQuery";
import { RiSendPlane2Line } from "react-icons/ri";
import clsx from "clsx";
import dayjs from "dayjs";
import styles from "../Profile.module.scss";

interface Message {
  senderId: string;
  content: string;
  timestamp: string;
}

type Props = {
  chatId?: string
}

export const ChatRoom: React.FC<Props> = ({ chatId }) => {
  const userMain = useAppSelector(selectUserMain);
  const userContact = useAppSelector(selectUserContact);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: addUser } = useAddChatQuery();

  useEffect(() => {
    if (userMain?._id) {
      if (!SocketService.isConnected()) {
        SocketService.connect(userMain._id);
      }

      SocketService.onMessage((message) => {
        setMessages((prev) => [...prev, message]);
      });

      SocketService.onError(({ message }) => {
        console.error("Chat: Ошибка сокета:", message);
      });

      return () => {
        SocketService.disconnect();
      };
    }
  }, [userMain?._id]);


  useEffect(() => {
    if (chatId && SocketService.isConnected()) {
      console.log("Chat: Присоединение к WebSocket-чату", chatId);
      userContact?._id && SocketService.joinChat(userContact._id, chatId);
    }
  }, [chatId, userContact?._id]);

  const handleSendMessageAndAddUser = () => {
    if (!userContact || !chatId) return
    if (!userContact.isInContacts) {
      addUser(userContact._id)
    }
    if (messageInput.trim() && chatId) {
      SocketService.sendMessage(chatId, messageInput);
      setMessageInput("");
    }
  };

  useEffect(() => {
    setMessages([])
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setMessageInput("")
  }, [chatId])

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer}>
        {messages.length === 0 && (
          <div className={styles.startChat}>
            <Text size={14} color="gray">
              Начать общение c {userContact?.nickname}
            </Text>
          </div>
        )}
        {messages.map((msg, index) => (
          <div className={styles.messageBlock} key={msg.timestamp + index}>
            <div
              className={clsx(
                styles.messageUser,
                msg.senderId === userMain?._id
                  ? styles.messageSent
                  : styles.messageReceived,
              )}
            >
              <div>
                {msg?.content && (
                  <div>{<Text size={15}>{msg.content || "..."}</Text>}</div>
                )}
                {msg?.timestamp && (
                  <div
                    className={clsx(
                      styles.timestamp,
                      msg.senderId === userMain?._id
                        ? styles.timestampSent
                        : styles.timestampReceived,
                    )}
                  >
                    <Text size={14}>
                      {dayjs(msg.timestamp).format("HH:mm")}
                    </Text>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.actionMessage}>
        <div className={styles.inputMessage}>
          <Input
            placeholder="Сообщение..."
            value={messageInput}
            autoFocus={!!chatId}
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter" && messageInput.trim()) {
                handleSendMessageAndAddUser();
              }
            }}
            onChange={(e) => setMessageInput(e.target.value)}
          />
        </div>
        <div className={clsx(styles.sendButton, messageInput && styles.sendButtonActive)}>
          <Button
            classNames={styles.enter}
            onClick={handleSendMessageAndAddUser}
            disabled={!chatId}
          >
            <RiSendPlane2Line />
          </Button>
        </div>
      </div>
    </div >
  );
};
