import mongoose from "mongoose";
import ChatModel from "../models/chat-model";
import MessageModel from "../models/message-model";
import UserModel from "../models/user-model";
import ContactModel from "../models/contact-model";
import UserStatusModel from "../models/user-status-model";
import ApiError from "../exceptions/api-error";
import { ErrorMessages } from "../utils/text-message";
import { IUser } from "../types/user";

class ContactService {
  async addContact(currentUserId: string, targetUserId: string): Promise<void> {
    if (currentUserId === targetUserId) {
      throw ApiError.BadRequest("Нельзя добавить себя в контакты");
    }

    const targetUser = await UserModel.findById(targetUserId);
    if (!targetUser) {
      throw ApiError.BadRequest(ErrorMessages.USER_NOT_FOUND);
    }

    const existingContact = await ContactModel.findOne({
      userId: currentUserId,
      contactId: targetUserId,
    });
    if (existingContact) {
      throw ApiError.BadRequest("Пользователь уже в контактах");
    }

    const existingReverseContact = await ContactModel.findOne({
      userId: targetUserId,
      contactId: currentUserId,
    });

    await ContactModel.create({
      userId: currentUserId,
      contactId: targetUserId,
    });

    if (!existingReverseContact) {
      await ContactModel.create({
        userId: targetUserId,
        contactId: currentUserId,
      });
    }
  }

  async getContacts(currentUserId: string): Promise<any[]> {
    const contacts = await ContactModel.find({
      userId: new mongoose.Types.ObjectId(currentUserId),
    }).populate<{ contactId: IUser }>("contactId", "nickname email");

    const result = await Promise.all(
      contacts.map(async (contact) => {
        const chat = await ChatModel.findOne({
          participants: {
            $all: [
              new mongoose.Types.ObjectId(currentUserId),
              new mongoose.Types.ObjectId(contact.contactId._id),
            ],
          },
        });

        const lastMessages = chat
          ? await MessageModel.find({ chatId: chat._id })
              .populate("sender", "nickname")
              .sort({ createdAt: -1 })
              .limit(3)
          : [];

        const status = await UserStatusModel.findOne({
          userId: contact.contactId._id,
        });

        return {
          _id: contact.contactId._id,
          nickname: contact.contactId.nickname,
          email: contact.contactId.email,
          isOnline: status ? status.isOnline : false,
          lastSeen: status && !status.isOnline ? status.lastSeen : null,
          isInContacts: true,
          lastMessages,
        };
      })
    );

    return result;
  }

  async removeContact(
    currentUserId: string,
    targetUserId: string
  ): Promise<void> {
    if (currentUserId === targetUserId) {
      throw ApiError.BadRequest("Нельзя удалить себя из контактов");
    }

    const targetUser = await UserModel.findById(targetUserId);
    if (!targetUser) {
      throw ApiError.BadRequest(ErrorMessages.USER_NOT_FOUND);
    }

    const existingContact = await ContactModel.findOne({
      userId: currentUserId,
      contactId: targetUserId,
    });
    if (!existingContact) {
      throw ApiError.BadRequest("Пользователь не находится в контактах");
    }

    await ContactModel.deleteOne({
      userId: currentUserId,
      contactId: targetUserId,
    });
  }
}

export default new ContactService();
