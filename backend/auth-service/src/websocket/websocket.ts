
import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import tokenService from "../service/token-service";
import { logger } from "../utils/logger";
import ChatService from "../service/chat-service";
import UserStatusService from "../service/user-status-service";
import ChatModel from "../models/chat-model";
import WebSocketService from "../service/websocket-service";
import UserStatusModel from "../models/user-status-model";

interface AuthSocket extends Socket {
  user?: { _id: string };
}

export const initWebSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
    path: "/socket.io",
    pingTimeout: 10000,
    pingInterval: 20000,
  });

  WebSocketService.initialize(io);

  io.use(async (socket: AuthSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        logger.error("WebSocket: Токен не предоставлен");
        return next(new Error("Токен не предоставлен"));
      }

      const userData = await tokenService.validateAccessToken(token);
      if (!userData) {
        logger.error("WebSocket: Неверный или истёкший токен");
        return next(new Error("Неверный или истёкший токен"));
      }

      socket.user = { _id: userData?._id };
      next();
    } catch (error) {
      logger.error("WebSocket: Ошибка авторизации", error);
      next(new Error("Ошибка авторизации"));
    }
  });

  io.on("connection", (socket: AuthSocket) => {
    if (!socket.user) return socket.disconnect();

    const userId = socket.user._id;
    logger.success(
      `WebSocket: Пользователь ${userId} подключился, socket ID: ${socket.id}`
    );

    socket.join(userId);

    UserStatusService.updateUserStatus(userId, {
      isOnline: true,
      lastSeen: null,
    }).catch((error) =>
      logger.error(`WebSocket: Ошибка обновления статуса для ${userId}:`, error)
    );

    io.emit("userStatus", {
      userId,
      isOnline: true,
      lastSeen: null,
    });
    logger.info(`WebSocket: Отправлен userStatus для ${userId}: isOnline=true`);

    socket.on("joinChat", ({ targetUserId, chatId }) => {
      if (!targetUserId || !chatId) {
        socket.emit("error", { message: "targetUserId и chatId обязательны" });
        return;
      }

      logger.info(
        `WebSocket: Пользователь ${userId} присоединяется к чату ${chatId}`
      );
      socket.join(chatId);
      socket.emit("chatJoined", { chatId });
      logger.info(
        `WebSocket: Пользователь ${userId} присоединился к чату ${chatId}`
      );
    });

    socket.on("message", async ({ chatId, content }) => {
      if (!chatId || !content) {
        socket.emit("error", { message: "chatId и content обязательны" });
        return;
      }

      logger.info(
        `WebSocket: Получено сообщение для чата ${chatId}: ${content}`
      );

      try {
        const message = await ChatService.saveMessage(chatId, userId, content);

        const chat = await ChatModel.findById(chatId);
        if (chat) {
          const recipientId = chat.participants
            .find((p) => p.toString() !== socket.user!._id)
            ?.toString();
          if (recipientId) {
            WebSocketService.sendNotification(recipientId, {
              type: "message",
              senderId: socket.user!._id,
              chatId,
              content,
              timestamp: message.createdAt.toISOString(),
            });
          }
        }

        io.to(chatId).emit("message", {
          senderId: socket.user!._id,
          content,
          chatId,
          timestamp: message.createdAt.toISOString(),
        });
        logger.info(
          `WebSocket: Рассылка сообщения от ${socket.user!._id} в чат ${chatId}: ${content}`
        );
      } catch (error) {
        logger.error("Ошибка сохранения сообщения:", error);
        socket.emit("error", { message: "Ошибка отправки сообщения" });
      }
    });

    socket.on("disconnect", async (reason) => {
      logger.info(`WebSocket: Пользователь ${userId} отключился, причина: ${reason}`);

      try {
        await UserStatusService.updateUserStatus(userId, {
          isOnline: false,
          lastSeen: new Date(),
        });

        io.emit("userStatus", {
          userId,
          isOnline: false,
          lastSeen: new Date().toISOString(),
        });
        logger.info(`WebSocket: Отправлен userStatus для ${userId}: isOnline=false`);
      } catch (error) {
        logger.error(`WebSocket: Ошибка при отключении ${userId}:`, error);
      }
    });
  });

  // Периодическая проверка устаревших статусов
  setInterval(async () => {
    try {
      const sockets = await io.fetchSockets();
      const connectedUserIds = sockets
        .filter((s: any) => s.user?._id)
        .map((s: any) => s.user._id);

      const staleStatuses = await UserStatusModel.find({
        isOnline: true,
        userId: { $nin: connectedUserIds },
      });

      for (const status of staleStatuses) {
        await UserStatusService.updateUserStatus(status.userId, {
          isOnline: false,
          lastSeen: new Date(),
        });

        io.emit("userStatus", {
          userId: status.userId,
          isOnline: false,
          lastSeen: new Date().toISOString(),
        });
        logger.info(`WebSocket: Исправлен устаревший статус для ${status.userId}`);
      }
    } catch (error) {
      logger.error("WebSocket: Ошибка проверки статусов:", error);
    }
  }, 30000);

  return httpServer;
};
