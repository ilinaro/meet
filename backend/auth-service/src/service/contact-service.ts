import ContactModel from "../models/contact-model";
import UserService from "./user-service";
import ChatService from "./chat-service";
import MessageModel from "../models/message-model";
import ApiError from "../exceptions/api-error";

// Интерфейс для типизации contactId после populate
interface PopulatedContactId {
  _id: string;
  nickname: string;
  email: string;
}

class ContactService {
  async addContact(userId: string, contactId: string) {
    if (userId === contactId) {
      throw ApiError.BadRequest("Нельзя добавить себя в контакты");
    }

    const existingContact = await ContactModel.findOne({
      userId,
      contactId,
    });

    if (existingContact) {
      throw ApiError.BadRequest("Контакт уже добавлен");
    }

    const contact = await ContactModel.create({ userId, contactId });
    return contact;
  }

  async getContacts(userId: string) {
    // Указываем тип для populate
    const contacts = await ContactModel.find({ userId }).populate<{
      contactId: PopulatedContactId;
    }>("contactId", "nickname email");

    const result = [];
    for (const contact of contacts) {
      if (!contact.contactId || !contact.contactId._id) {
        continue; // Пропускаем, если contactId не заполнен
      }

      const userData = await UserService.getUserById(contact.contactId._id.toString());
      if (!userData) {
        continue;
      }

      const chat = await ChatService.startChat(userId, contact.contactId._id.toString());
      const lastMessages = await MessageModel.find({ chatId: chat._id })
        .populate("sender", "nickname")
        .sort({ createdAt: -1 })
        .limit(3);

      result.push({
        _id: contact.contactId._id.toString(),
        nickname: contact.contactId.nickname,
        email: contact.contactId.email,
        isOnline: userData.isOnline,
        lastSeen: userData.lastSeen,
        isInContacts: true,
      });
    }

    return result;
  }

  async removeContact(userId: string, contactId: string) {
    const contact = await ContactModel.findOneAndDelete({
      userId,
      contactId,
    });

    if (!contact) {
      throw ApiError.BadRequest("Контакт не найден");
    }

    return contact;
  }
}

export default new ContactService();