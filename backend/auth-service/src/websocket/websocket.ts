import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import tokenService from "../service/token-service";
import { logger } from "../utils/logger";

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
    //   logger.info("WebSocket: Получен токен:", token);
      if (!token) {
        logger.error("WebSocket: Токен не предоставлен");
        return next(new Error("Токен не предоставлен"));
      }

      const userData = await tokenService.validateAccessToken(token);
    //   logger.info("WebSocket: Результат валидации токена:", userData);
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

    logger.success(`WebSocket: Пользователь ${socket.user._id} подключился, socket ID: ${socket.id}`);

    socket.on("joinChat", ({ targetUserId, chatId }) => {
      if (!targetUserId || !chatId) {
        socket.emit("error", { message: "targetUserId и chatId обязательны" });
        return;
      }

      logger.info(`WebSocket: Пользователь ${socket.user!._id} присоединяется к чату ${chatId}`);
      socket.join(chatId);
      socket.emit("chatJoined", { chatId });
      logger.info(`WebSocket: Пользователь ${socket.user!._id} присоединился к чату ${chatId}`);
    });

    socket.on("message", ({ chatId, content }) => {
      if (!chatId || !content) {
        socket.emit("error", { message: "chatId и content обязательны" });
        return;
      }

      logger.info(`WebSocket: Получено сообщение для чата ${chatId}: ${content}`);
      io.to(chatId).emit("message", {
        senderId: socket.user!._id,
        content,
        timestamp: new Date().toISOString(),
      });
      logger.info(`WebSocket: Рассылка сообщения от ${socket.user!._id} в чат ${chatId}: ${content}`);
    });

    socket.on("testMessage", ({ chatId, content }) => {
      if (!chatId || !content) {
        socket.emit("error", { message: "chatId и content обязательны" });
        return;
      }

      logger.info(`WebSocket: Получено тестовое сообщение для чата ${chatId}: ${content}`);
      io.to(chatId).emit("testMessage", {
        senderId: socket.user!._id,
        content,
        timestamp: new Date().toISOString(),
      });
      logger.info(`WebSocket: Рассылка тестового сообщения от ${socket.user!._id} в чат ${chatId}: ${content}`);
    });

    socket.on("disconnect", () => {
      logger.info(`WebSocket: Пользователь ${socket.user!._id} отключился`);
    });
  });

  return httpServer;
};