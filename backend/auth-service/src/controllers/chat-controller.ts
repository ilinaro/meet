import { Request, Response, NextFunction } from "express";
import ChatService from "../service/chat-service";
import ApiError from "../exceptions/api-error";
import ChatModel from "../models/chat-model";

class ChatController {
  async startChat(req: Request, res: Response, next: NextFunction) {
    try {
      const { targetUserId } = req.body;
      const { _id: currentUserId } = req.user;
      if (!targetUserId) {
        throw ApiError.BadRequest("Не указан ID целевого пользователя");
      }

      const chat = await ChatService.startChat(currentUserId, targetUserId);
      res.json({ chatId: chat._id });
    } catch (error) {
      next(error);
    }
  }

  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId, limit = "50", skip = "0" } = req.query; // Добавлены limit и skip
      const { _id: currentUserId } = req.user;
      if (!chatId || typeof chatId !== "string") {
        throw ApiError.BadRequest("Не указан chatId");
      }

      const chat = await ChatModel.findById(chatId);
      if (!chat) {
        throw ApiError.BadRequest("Чат не найден");
      }
      if (!chat.participants.includes(currentUserId)) {
        throw ApiError.BadRequest("У вас нет доступа к этому чату");
      }

      const parsedLimit = parseInt(limit as string, 10);
      const parsedSkip = parseInt(skip as string, 10);
      if (isNaN(parsedLimit) || parsedLimit < 1) {
        throw ApiError.BadRequest("Неверное значение limit");
      }
      if (isNaN(parsedSkip) || parsedSkip < 0) {
        throw ApiError.BadRequest("Неверное значение skip");
      }

      const messages = await ChatService.getMessages(
        chatId,
        parsedLimit,
        parsedSkip,
      );
      res.json(messages);
    } catch (error) {
      console.error(
        `Error in getMessages for chat ${req.query.chatId}:`,
        error,
      );
      next(error);
    }
  }
}

export default new ChatController();
