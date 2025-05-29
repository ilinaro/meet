import UserStatusModel from "../models/user-status-model";
import { logger } from "../utils/logger";
import ApiError from "../exceptions/api-error";

interface UserStatus {
  isOnline: boolean;
  lastSeen: string | null;
}

interface UserStatusUpdate {
  isOnline: boolean;
  lastSeen?: Date | null;
}

export class UserStatusService {
  async updateUserStatus(userId: string, update: UserStatusUpdate): Promise<void> {
    try {
      logger.info(`UserStatusService: Обновление статуса для ${userId}: ${JSON.stringify(update)}`);
      const result = await UserStatusModel.findOneAndUpdate(
        { userId },
        {
          isOnline: update.isOnline,
          lastSeen: update.lastSeen,
        },
        { upsert: true, new: true },
      );
      logger.info(`UserStatusService: Статус пользователя ${userId} обновлен: ${result.isOnline}`);
    } catch (error) {
      logger.error(`UserStatusService: Ошибка обновления статуса для ${userId}:`, error);
      throw ApiError.BadRequest("Ошибка обновления статуса");
    }
  }

  async getStatuses(userIds: string[]): Promise<Record<string, UserStatus>> {
    try {
      if (!userIds.length) {
        return {};
      }

      const statuses = await UserStatusModel.find({
        userId: { $in: userIds },
      }).lean();

      const result: Record<string, UserStatus> = {};
      userIds.forEach((userId) => {
        const status = statuses.find((s) => s.userId === userId);
        result[userId] = {
          isOnline: status?.isOnline ?? false,
          lastSeen: status?.lastSeen ? status.lastSeen.toISOString() : null,
        };
      });

      logger.info(`UserStatusService: Получены статусы для ${userIds.length} пользователей: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      logger.error("UserStatusService: Ошибка получения статусов:", error);
      throw ApiError.BadRequest("Ошибка получения статусов");
    }
  }
}

export default new UserStatusService();
