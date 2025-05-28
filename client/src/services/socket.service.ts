import { io, Socket } from "socket.io-client";
import { WS_URL } from "../http";
import { selectAccessToken } from "../store/accessStateSlice";
import store from "../store";
import { IContact } from "../models";

interface MessageData {
  senderId: string;
  content: string;
  timestamp: string;
  chatId: string;
}

interface ErrorData {
  message: string;
}

export class SocketService {
  private socket: Socket | null = null;
  private isConnecting: boolean = false;

  connect(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnected()) {
        console.log(`SocketService: Уже подключено как ${userId}`);
        resolve();
        return;
      }

      if (this.isConnecting) {
        console.log(`SocketService: Подключение уже в процессе для ${userId}`);
        resolve();
        return;
      }

      this.isConnecting = true;

      const token = selectAccessToken(store.getState());
      if (!token) {
        console.error("SocketService: Токен не найден");
        this.isConnecting = false;
        reject("Нет токена");
        return;
      }

      this.socket = io(WS_URL, {
        auth: { token },
        query: { userId },
        withCredentials: true,
        path: "/socket.io",
      });

      this.socket.on("connect", () => {
        console.log(`SocketService: Подключено как ${userId}`);
        this.isConnecting = false;
        resolve();
      });

      this.socket.on("connect_error", (error) => {
        console.error("SocketService: Ошибка подключения:", error.message);
        this.isConnecting = false;
        reject(error);
      });

      this.socket.on("disconnect", (reason) => {
        console.log(`SocketService: Отключено: ${reason}`);
        this.isConnecting = false;
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("SocketService: Сокет отключен");
    }
    this.isConnecting = false;
  }

  isConnected(): boolean {
    return !!this.socket && this.socket.connected;
  }


  onConnect(callback: () => void): void {
    this.socket?.on("connect", callback);
  }

  offConnect(callback?: () => void): void {
    if (callback) {
      this.socket?.off("connect", callback);
    } else {
      this.socket?.off("connect");
    }
    console.log("SocketService: Отключён обработчик connect");
  }

  joinChat(targetUserId: string, chatId: string): void {
    if (!this.socket || !this.isConnected()) {
      console.error("SocketService: Сокет не подключен");
      return;
    }
    console.log(`SocketService: Присоединение к чату ${chatId}`);
    this.socket.emit("joinChat", { targetUserId, chatId });
  }

  leaveChat(chatId: string): void {
    if (!this.socket || !this.isConnected()) {
      console.error("SocketService: Сокет не подключен");
      return;
    }
    console.log(`SocketService: Покинуть чат ${chatId}`);
    this.socket.emit("leaveChat", { chatId });
  }

  onChatJoined(callback: (data: { chatId: string }) => void): void {
    this.socket?.on("chatJoined", callback);
  }

  offChatJoined(callback: (data: { chatId: string }) => void): void {
    this.socket?.off("chatJoined", callback);
  }

  sendMessage(chatId: string, content: string): void {
    if (!this.socket || !this.isConnected()) {
      console.error("SocketService: Сокет не подключен");
      return;
    }
    console.log(`SocketService: Отправка сообщения в ${chatId}: ${content}`);
    this.socket.emit("message", { chatId, content });
  }

  onMessage(callback: (data: MessageData) => void): void {
    this.socket?.on("message", callback);
  }

  offMessage(callback: (data: MessageData) => void): void {
    this.socket?.off("message", callback);
  }

  onMessageRoom(callback: (data: MessageData) => void): void {
    const handler = ({ type, senderId, chatId, content, timestamp }: any) => {
      if (type === "message") {
        callback({ senderId, content, timestamp, chatId });
      }
    };
    this.socket?.on("newContactOrMessage", handler);
  }

  offMessageRoom(callback: (data: MessageData) => void): void {
    const handler = ({ type, senderId, chatId, content, timestamp }: any) => {
      if (type === "message") {
        callback({ senderId, content, timestamp, chatId });
      }
    };
    this.socket?.off("newContactOrMessage", handler);
  }

  onNewContact(callback: (data: IContact) => void): void {
    const handler = ({ ...data }: any) => {
      if (data.type === "contact") {
        console.log(`SocketService: Тебя добавили в контакты: ${data._id}`);
        callback({
          _id: data._id,
          chatId: data.chatId,
          isInContacts: data.isInContacts,
          nickname: data.nickname,
        });
      }
    };
    this.socket?.on("newContactOrMessage", handler);
  }

  offNewContact(callback: (data: IContact) => void): void {
    const handler = ({ ...data }: any) => {
      if (data.type === "contact") {
        callback({
          _id: data._id,
          chatId: data.chatId,
          isInContacts: data.isInContacts,
          nickname: data.nickname,
        });
      }
    };
    this.socket?.off("newContactOrMessage", handler);
  }

  onError(callback: (data: ErrorData) => void): void {
    this.socket?.on("error", callback);
  }

  offError(callback: (data: ErrorData) => void): void {
    this.socket?.off("error", callback);
  }
}

export default new SocketService();