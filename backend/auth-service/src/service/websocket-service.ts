import { Server } from "socket.io";
import { logger } from "../utils/logger";

interface ContactNotification {
  type: "contact";
  senderId: string;
  chatId: string;
  timestamp: string;
}

interface MessageNotification {
  type: "message";
  senderId: string;
  chatId: string;
  content: string;
  timestamp: string;
}

type Notification = ContactNotification | MessageNotification;

export class WebSocketService {
  private io: Server | null = null;

  constructor() {}

  initialize(io: Server) {
    if (this.io) {
      logger.warn("WebSocketService: io уже инициализирован");
      return;
    }
    this.io = io;
    logger.info("WebSocketService: io инициализирован");
  }

  sendNotification(userId: string, notification: Notification) {
    if (!this.io) {
      logger.error("WebSocketService: io не инициализирован");
      return;
    }
    this.io.to(userId).emit("newContactOrMessage", notification);
    logger.info(`WebSocketService: Отправлено уведомление пользователю ${userId}: ${notification.type}`);
  }

  isInitialized(): boolean {
    return !!this.io;
  }
}

export default new WebSocketService();