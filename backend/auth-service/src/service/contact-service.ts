import ContactModel from "../models/contact-model";
import ChatService from "./chat-service";
import ApiError from "../exceptions/api-error";

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
    const chatId = await ChatService.startChat(userId, contactId);
    const existingContact = await ContactModel.findOne({
      userId,
      contactId,
    });

    if (existingContact) {
      throw ApiError.BadRequest("Контакт уже добавлен");
    }

    const contact = await ContactModel.create({ userId, contactId, chatId });
    return contact;
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

    return contact;
  }
}

export default new ContactService();
