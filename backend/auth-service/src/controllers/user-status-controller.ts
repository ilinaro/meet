import { Request, Response, NextFunction } from "express";
import ApiError from "../exceptions/api-error";
import { logger } from "../utils/logger";
import UserStatusService from "../service/user-status-service";

class UserStatusController {
  async getStatuses(req: Request, res: Response, next: NextFunction) {
    try {
      const { userIds } = req.body;
      if (
        !Array.isArray(userIds) ||
        !userIds.every((id) => typeof id === "string")
      ) {
        throw ApiError.BadRequest("userIds должен быть массивом строк");
      }

      const statuses = await UserStatusService.getStatuses(userIds);
      res.json(statuses);
      logger.info(
        `UserStatusController: Возвращены статусы для ${userIds.length} пользователей`,
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new UserStatusController();
