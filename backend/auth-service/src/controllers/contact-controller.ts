import { Request, Response, NextFunction } from "express";
import ContactService from "../service/contact-service";
import ApiError from "../exceptions/api-error";

class ContactController {
  async addContact(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id: targetUserId, nickname } = req.body;
      const { _id } = req.user;
      if (!targetUserId || !nickname) {
        throw ApiError.BadRequest("Нет некоторых данных о пользователе");
      }

      await ContactService.addContact(_id, targetUserId, nickname);
      res.json({ message: "Пользователь добавлен в контакты" });
    } catch (error) {
      next(error);
    }
  }

  async getContacts(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id: currentUserId } = req.user;
      const contacts = await ContactService.getContacts(currentUserId);
      res.json(contacts);
    } catch (error) {
      next(error);
    }
  }

  async removeContact(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: targetUserId } = req.params;
      const { _id: currentUserId } = req.user;
      await ContactService.removeContact(currentUserId, targetUserId);
      res.json({ message: "Пользователь удалён из контактов" });
    } catch (error) {
      next(error);
    }
  }
}

export default new ContactController();
