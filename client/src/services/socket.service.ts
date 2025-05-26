import { io, Socket } from "socket.io-client";
import { WS_URL } from "../http";
import { selectAccessToken } from "../store/accessStateSlice";
import store from "../store";

interface MessageData {
  senderId: string;
  content: string;
  timestamp: string;
  chatId: string;
}

interface ContactData {
  senderId: string;
  chatId: string;
  timestamp: string;
}

interface ErrorData {
  message: string;
}

export class SocketService {
  private socket: Socket | null = null;

  connect(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = selectAccessToken(store.getState());
      if (!token) {
        console.error("SocketService: Токен не найден");
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
        resolve();
      });

      this.socket.on("connect_error", (error) => {
        console.error("SocketService: Ошибка подключения:", error.message);
        reject(error);
      });

      this.socket.on("disconnect", (reason) => {
        console.log(`SocketService: Отключено: ${reason}`);
      });
    });
  }

  onConnect(callback: () => void): void {
    this.socket?.on("connect", callback);
  }

  offConnect(callback: () => void): void {
    this.socket?.off("connect", callback);
  }

  joinChat(targetUserId: string, chatId: string): void {
    if (!this.socket || !this.isConnected()) {
      console.error("SocketService: Сокет не подключен");
      return;
    }
    console.log(`SocketService: Присоединение к чату ${chatId}`);
    this.socket.emit("joinChat", { targetUserId, chatId });
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

  onTestMessage1(callback: (data: MessageData) => void): void {
    this.socket?.on("newContactOrMessage", ({ type, senderId, chatId, content, timestamp }) => {
      if (type === "message") {
        console.log(`SocketService: Новое сообщение от ${senderId}: ${content}`);
        callback({ senderId, content, timestamp, chatId });
      }
    });
  }

  onNewContact(callback: (data: ContactData) => void): void {
    this.socket?.on("newContactOrMessage", ({ type, senderId, chatId, timestamp }) => {
      if (type === "contact") {
        console.log(`SocketService: Тебя добавили в контакты: ${senderId}`);
        callback({ senderId, chatId, timestamp });
      }
    });
  }

  onError(callback: (data: ErrorData) => void): void {
    this.socket?.on("error", callback);
  }

  offError(callback: (data: ErrorData) => void): void {
    this.socket?.off("error", callback);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("SocketService: Сокет отключен");
    }
  }

  isConnected(): boolean {
    return !!this.socket && this.socket.connected;
  }
}

export default new SocketService();