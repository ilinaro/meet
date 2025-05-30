import ContactModel from "../models/contact-model";
import ChatService from "./chat-service";
import ApiError from "../exceptions/api-error";
import WebSocketService from "./websocket-service";
import { logger } from "../utils/logger";

interface PopulatedContactId {
  _id: string;
  nickname: string;
  email: string;
}

export class ContactService {
  constructor(private readonly webSocketService: typeof WebSocketService) {}

  async addContact(userId: string, contactId: string, nickname: string) {
    if (userId === contactId) {
      throw ApiError.BadRequest("Нельзя добавить себя в контакты");
    }

    // Создаём чат для обоих пользователей
    const chat = await ChatService.startChat(userId, contactId);

    // Проверяем существующие контакты для обоих пользователей
    const [existingContact, existingReverseContact] = await Promise.all([
      ContactModel.findOne({ userId, contactId }),
      ContactModel.findOne({ userId: contactId, contactId: userId }),
    ]);

    if (existingContact) {
      throw ApiError.BadRequest("Контакт уже добавлен");
    }

    // Создаём записи для обоих пользователей
    const [contact, reverseContact] = await Promise.all([
      ContactModel.create({
        userId,
        contactId,
        chatId: chat._id,
        nickname,
      }),
      ContactModel.create({
        userId: contactId,
        contactId: userId,
        chatId: chat._id,
        nickname: userId,
      }),
    ]);

    this.webSocketService.sendNotification(contactId, {
      type: "contact",
      _id: userId,
      chatId: chat._id.toString(),
      isInContacts: true,
      nickname,
    });

    return {
      contact,
      chatId: chat._id,
    };
  }

  async getContacts(userId: string) {
    const contacts = await ContactModel.find({ userId }).populate<{
      contactId: PopulatedContactId;
    }>("contactId", "nickname");

    return contacts.map((contact) => {
      return {
        _id: contact.contactId._id,
        nickname: contact.contactId.nickname,
        isInContacts: true,
        chatId: contact.chatId,
      };
    });
  }

  async removeContact(userId: string, contactId: string) {
    const contact = await ContactModel.findOneAndDelete({
      userId,
      contactId,
    });

    if (!contact) {
      throw ApiError.BadRequest("Контакт не найден");
    }

    // Удаляем обратную связь
    await ContactModel.findOneAndDelete({
      userId: contactId,
      contactId: userId,
    });

    // Отправляем уведомление второму участнику об удалении контакта
    try {
      this.webSocketService.sendNotification(contactId, {
        type: "contactDeleted",
        contactId: userId,
      });
      logger.info(
        `Уведомление contactDeleted отправлено пользователю ${contactId}`,
      );
    } catch (error) {
      logger.error(
        `Ошибка отправки уведомления contactDeleted для ${contactId}:`,
        error,
      );
    }

    return contact;
  }
}

export default new ContactService(WebSocketService);
