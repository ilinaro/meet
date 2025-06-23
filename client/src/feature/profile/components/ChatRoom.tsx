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
  chatId?: string;
}

export const ChatRoom: React.FC = () => {
  const userMain = useAppSelector(selectUserMain);
  const userContact = useAppSelector(selectUserContact);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSocketReady, setIsSocketReady] = useState(
    SocketService.isConnected(),
  );
  const hasJoinedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<boolean>(false);
  const prevChatIdRef = useRef<string | null>(null);
  const { mutate: addUser } = useAddChatQuery();

  useEffect(() => {
    if (userMain?._id) {
      const handleMessage = (message: Message) => {
        console.log(message)
        // Фильтруем сообщения по текущей комнате
        if (message.chatId && message.chatId === userContact?.chatId) {
          setMessages((prev) => [...prev, message]);
        }
      };

      const handleError = ({ message }: { message: string }) => {
        console.error("ChatRoom: Ошибка сокета:", message);
      };

      const handleConnect = () => setIsSocketReady(true);

      SocketService.onMessage(handleMessage);
      SocketService.onError(handleError);
      SocketService.onConnect(handleConnect);

      return () => {
        SocketService.offMessage(handleMessage);
        SocketService.offError(handleError);
        SocketService.offConnect(handleConnect);
        hasJoinedRef.current = false;
      };
    }
  }, [userMain?._id, userContact?.chatId]); // Зависимость от chatId

  useEffect(() => {
    if (
      userContact &&
      !userContact?.isInContacts &&
      outputRef.current &&
      userMain?.nickname
    ) {
      addUser({ _id: userContact._id });
    }
  }, [userContact?._id, outputRef.current]);

  useEffect(() => {
    hasJoinedRef.current = false;
    outputRef.current = false;
  }, [userContact?.chatId]);

  useEffect(() => {
    if (
      userContact?.chatId &&
      userContact._id &&
      isSocketReady &&
      !hasJoinedRef.current
    ) {
      if (
        prevChatIdRef.current &&
        prevChatIdRef.current !== userContact.chatId
      ) {
        SocketService.leaveChat(prevChatIdRef.current);
      }
      SocketService.joinChat(userContact._id, userContact.chatId);
      hasJoinedRef.current = true;
      prevChatIdRef.current = userContact.chatId;
    }

    return () => {
      if (prevChatIdRef.current) {
        SocketService.leaveChat(prevChatIdRef.current);
        prevChatIdRef.current = null;
      }
      hasJoinedRef.current = false;
    };
  }, [userContact?.chatId, userContact?._id, isSocketReady]);

  const handleSendMessageAndAddUser = () => {
    if (messageInput.trim() && userContact?.chatId) {
      SocketService.sendMessage(userContact.chatId, messageInput);
      setMessageInput("");
    }
  };

  useEffect(() => {
    if (messageInput.length === 1 && !outputRef.current) {
      outputRef.current = true;
    }
  }, [messageInput]);

  useEffect(() => {
    setMessages([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setMessageInput("");
  }, [userContact?.chatId]);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer}>
        {messages.length === 0 && (
          <div className={styles.startChat}>
            <Text size={14} color="gray">
              Начать общение с {userContact?.nickname}
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
                {msg?.content && <Text size={15}>{msg.content}</Text>}
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
            autoFocus={!!userContact?.chatId}
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter" && messageInput.trim()) {
                handleSendMessageAndAddUser();
              }
            }}
            onChange={(e) => setMessageInput(e.target.value)}
          />
        </div>
        <div
          className={clsx(
            styles.sendButton,
            messageInput && styles.sendButtonActive,
          )}
        >
          <Button
            classNames={styles.enter}
            onClick={handleSendMessageAndAddUser}
            disabled={!userContact?.chatId}
          >
            <RiSendPlane2Line />
          </Button>
        </div>
      </div>
    </div>
  );
};
