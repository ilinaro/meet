import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import tokenService from "../service/token-service";
import { logger } from "../utils/logger";
import ChatService from "../service/chat-service"; // Добавлено для сохранения сообщений
import UserStatusModel from "../models/user-status-model"; // Добавлено для статуса пользователей

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

    // Обновление статуса пользователя при подключении
    UserStatusModel.findOneAndUpdate(
      { userId: socket.user._id },
      { isOnline: true, lastSeen: null },
      { upsert: true, new: true },
    ).catch((error) => logger.error("Ошибка обновления статуса:", error));
    io.emit("userStatus", { userId: socket.user._id, isOnline: true }); // Рассылка статуса

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
        // Сохранение сообщения в базу данных
        const message = await ChatService.saveMessage(
          chatId,
          socket.user!._id,
          content,
        );

        io.to(chatId).emit("message", {
          senderId: socket.user!._id,
          content,
          timestamp: message.createdAt.toISOString(), // Используем время из базы
        });
        logger.info(
          `WebSocket: Рассылка сообщения от ${socket.user!._id} в чат ${chatId}: ${content}`,
        );
      } catch (error) {
        logger.error("Ошибка сохранения сообщения:", error);
        socket.emit("error", { message: "Ошибка отправки сообщения" });
      }
    });

    socket.on("testMessage", ({ chatId, content }) => {
      if (!chatId || !content) {
        socket.emit("error", { message: "chatId и content обязательны" });
        return;
      }

      logger.info(
        `WebSocket: Получено тестовое сообщение для чата ${chatId}: ${content}`,
      );
      io.to(chatId).emit("testMessage", {
        senderId: socket.user!._id,
        content,
        timestamp: new Date().toISOString(),
      });
      logger.info(
        `WebSocket: Рассылка тестового сообщения от ${socket.user!._id} в чат ${chatId}: ${content}`,
      );
    });

    socket.on("disconnect", () => {
      logger.info(`WebSocket: Пользователь ${socket.user!._id} отключился`);

      // Обновление статуса при отключении
      UserStatusModel.findOneAndUpdate(
        { userId: socket.user!._id },
        { isOnline: false, lastSeen: new Date() },
        { upsert: true, new: true },
      ).catch((error) => logger.error("Ошибка обновления статуса:", error));
      io.emit("userStatus", {
        userId: socket.user!._id,
        isOnline: false,
        lastSeen: new Date().toISOString(),
      }); // Рассылка статуса
    });
  });

  return httpServer;
};
