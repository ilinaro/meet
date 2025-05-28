import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import tokenService from "../service/token-service";
import { logger } from "../utils/logger";
import ChatService from "../service/chat-service";
import UserStatusModel from "../models/user-status-model";
import ChatModel from "../models/chat-model";
import WebSocketService from "../service/websocket-service";

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
  });

  // Инициализируем WebSocketService
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

    logger.success(
      `WebSocket: Пользователь ${socket.user._id} подключился, socket ID: ${socket.id}`,
    );

    socket.join(socket.user._id);

    UserStatusModel.findOneAndUpdate(
      { userId: socket.user._id },
      { isOnline: true, lastSeen: null },
      { upsert: true, new: true },
    ).catch((error) => logger.error("Ошибка обновления статуса:", error));
    io.emit("userStatus", { userId: socket.user._id, isOnline: true });

    socket.on("joinChat", ({ targetUserId, chatId }) => {
      if (!targetUserId || !chatId) {
        socket.emit("error", { message: "targetUserId и chatId обязательны" });
        return;
      }

      logger.info(
        `WebSocket: Пользователь ${socket.user!._id} присоединяется к чату ${chatId}`,
      );
      socket.join(chatId);
      socket.emit("chatJoined", { chatId });
      logger.info(
        `WebSocket: Пользователь ${socket.user!._id} присоединился к чату ${chatId}`,
      );
    });

    socket.on("message", async ({ chatId, content }) => {
      if (!chatId || !content) {
        socket.emit("error", { message: "chatId и content обязательны" });
        return;
      }

      logger.info(
        `WebSocket: Получено сообщение для чата ${chatId}: ${content}`,
      );

      try {
        const message = await ChatService.saveMessage(
          chatId,
          socket.user!._id,
          content,
        );

        const chat = await ChatModel.findById(chatId);
        if (chat) {
          const recipientId = chat.participants
            .find((p) => p.toString() !== socket.user!._id)
            ?.toString();
          if (recipientId) {
            // Используем WebSocketService для уведомления
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
          `WebSocket: Рассылка сообщения от ${socket.user!._id} в чат ${chatId}: ${content}`,
        );
      } catch (error) {
        logger.error("Ошибка сохранения сообщения:", error);
        socket.emit("error", { message: "Ошибка отправки сообщения" });
      }
    });

    socket.on("disconnect", () => {
      logger.info(`WebSocket: Пользователь ${socket.user!._id} отключился`);

      UserStatusModel.findOneAndUpdate(
        { userId: socket.user!._id },
        { isOnline: false, lastSeen: new Date() },
        { upsert: true, new: true },
      ).catch((error) => logger.error("Ошибка обновления статуса:", error));
      io.emit("userStatus", {
        userId: socket.user!._id,
        isOnline: false,
        lastSeen: new Date().toISOString(),
      });
    });
  });

  return httpServer;
};
