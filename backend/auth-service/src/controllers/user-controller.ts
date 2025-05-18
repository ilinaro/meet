import { Request, Response, NextFunction } from "express";
import { ErrorMessages } from "../utils/text-message";
import UserService from "../service/user-service";
import { logger } from "../utils/logger";
import { validationResult } from "express-validator";
import ApiError from "../exceptions/api-error";

class UserController {
  async registration(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        next(
          ApiError.BadRequest(
            ErrorMessages.REGISTRATION_INCORRECT,
            errors.array(),
          ),
        );
      }
      const { email, password, nickname } = req.body;

      const userData = await UserService.registration(
        email,
        password,
        nickname,
      );

      if (!userData) return;
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.json(userData);
      return;
    } catch (e) {
      logger.error("Ошибка при регистрации", e);
      next(e);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const userData = await UserService.login(email, password);

      if (!userData) return;
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.json(userData);
      return;
    } catch (e) {
      logger.error("catch on login", e);
      next(e);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const token = await UserService.logout(refreshToken);
      res.cookie("refreshToken", "", {
        httpOnly: true,
        expires: new Date(0),
      });
      res.json(token);
      return;
    } catch (e) {
      logger.error("catch on logout", e);
      next(e);
    }
  }

  async active(req: Request, res: Response, next: NextFunction) {
    try {
      const activationLink = req.params.link;
      await UserService.active(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      logger.error("catch on active", e);
      next(e);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await UserService.refresh(refreshToken);
      if (!userData) return;
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.json(userData);
    } catch (e) {
      logger.error("catch on refresh", e);
      next(e);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
      return;
    } catch (e) {
      logger.error("catch on getUsers", e);
      next(e);
    }
  }

  async searchUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { nickname } = req.query;
      const { _id: currentUserId } = req.user;
      if (!nickname || typeof nickname !== "string") {
        throw ApiError.BadRequest("Никнейм обязателен");
      }

      const users = await UserService.searchUsers(nickname, currentUserId);
      res.json(users);
    } catch (e) {
      logger.error("Ошибка при поиске пользователей", e);
      next(e);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id;
      const { nickname, allowChatInvites } = req.body;
      const updates = { nickname, allowChatInvites };
      const userData = await UserService.updateUser(userId, updates);
      res.json(userData);
    } catch (e) {
      logger.error("Ошибка при обновлении пользователя", e);
      next(e);
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = await UserService.getUserById(req.user._id);
      res.json(userData);
    } catch (e) {
      logger.error("Ошибка при получении пользователя", e);
      next(e);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      if (!user) {
        throw ApiError.BadRequest("Пользователь не найден");
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
