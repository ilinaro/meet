import { io, Socket } from "socket.io-client";
import { WS_URL } from "../http";

interface MessageData {
  senderId: string;
  content: string;
  timestamp: string;
}

interface ErrorData {
  message: string;
}

export class SocketService {
  private socket: Socket | null = null;

  connect(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem("token");
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

  joinChat(targetUserId: string, chatId: string): void {
    if (!this.socket || !this.isConnected()) {
      console.error("SocketService: Сокет не подключен");
      return;
    }
    console.log(
      `SocketService: Присоединение к чату с targetUserId=${targetUserId}, chatId=${chatId}`
    );
    this.socket.emit("joinChat", { targetUserId, chatId });
  }

  onChatJoined(callback: (data: { chatId: string }) => void): void {
    if (this.socket) {
      this.socket.on("chatJoined", (data) => {
        console.log("SocketService: Присоединились к чату:", data);
        callback(data);
      });
    }
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
    if (this.socket) {
      this.socket.on("message", (data) => {
        console.log("SocketService: Получено сообщение:", data);
        callback(data);
      });
    }
  }

  onTestMessage(callback: (data: MessageData) => void): void {
    if (this.socket) {
      this.socket.on("testMessage", (data) => {
        console.log("SocketService: Получено тестовое сообщение:", data);
        callback(data);
      });
    }
  }

  onError(callback: (data: ErrorData) => void): void {
    if (this.socket) {
      this.socket.on("error", (data) => {
        console.log("SocketService: Получена ошибка:", data);
        callback(data);
      });
    }
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
