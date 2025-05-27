import { Types } from "mongoose";
import ContactModel from "../models/contact-model";
import ChatService from "./chat-service";
import ApiError from "../exceptions/api-error";
import WebSocketService from "./websocket-service"; // Экземпляр синглтона

interface PopulatedContactId {
  _id: string;
  nickname: string;
  email: string;
}

export class ContactService {
  constructor(private readonly webSocketService: typeof WebSocketService) {} // Исправлен тип

  async addContact(userId: string, contactId: string) {
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
      ContactModel.create({ userId, contactId, chatId: chat._id }),
      ContactModel.create({
        userId: contactId,
        contactId: userId,
        chatId: chat._id,
      }),
    ]);

    // Отправляем уведомление через WebSocketService
    this.webSocketService.sendNotification(contactId, {
      type: "contact",
      senderId: userId,
      chatId: chat._id.toString(),
      timestamp: new Date().toISOString(),
    });

    // Возвращаем информацию о контакте и чате
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

    return contact;
  }
}

export default new ContactService(WebSocketService); // Передаём экземпляр
