import ChatModel from "../models/chat-model";
import MessageModel from "../models/message-model";
import ApiError from "../exceptions/api-error";

class ChatService {
  async startChat(currentUserId: string, targetUserId: string): Promise<any> {
    if (currentUserId === targetUserId) {
      throw ApiError.BadRequest("Нельзя начать чат с самим собой");
    }

    const existingChat = await ChatModel.findOne({
      participants: { $all: [currentUserId, targetUserId] },
    });

    if (existingChat) {
      return existingChat;
    }

    const chat = await ChatModel.create({
      participants: [currentUserId, targetUserId],
    });

    return chat;
  }

  async saveMessage(chatId: string, senderId: string, content: string) {
    try {
      if (typeof chatId !== "string" || typeof senderId !== "string") {
        throw new Error(
          `Invalid input: chatId=${chatId}, senderId=${senderId}`,
        );
      }
      if (!content.trim()) {
        throw new Error("Message content cannot be empty");
      }
      console.log(
        `Saving message: chatId=${chatId}, senderId=${senderId}, content=${content}`,
      );
      const message = await MessageModel.create({
        chatId,
        sender: senderId,
        content,
        createdAt: new Date(),
        readBy: [],
      });
      console.log(`Message saved:`, message);
      return message;
    } catch (error) {
      console.error(`Error saving message: ${error}`);
      throw error;
    }
  }
  async getMessages(chatId: string, limit: number = 50) {
    const messages = await MessageModel.find({ chatId })
      .populate("sender", "nickname")
      .sort({ createdAt: 1 })
      .limit(limit);
    return messages;
  }
}

export default new ChatService();
