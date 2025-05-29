import express from "express";
import { body, query, param } from "express-validator";
import chatController from "../controllers/chat-controller";
import contactController from "../controllers/contact-controller";
import authMiddleware from "../middleware/auth-middleware";
import { Routers } from "../types/routers";
import userStatusController from "../controllers/user-status-controller";

const router = express.Router();

router.post(
  Routers.CHAT_START,
  authMiddleware,
  body("targetUserId")
    .notEmpty()
    .withMessage("Не указан ID целевого пользователя"),
  chatController.startChat
);
router.post(
  Routers.CHAT_ADD_CONTACT,
  authMiddleware,
  body("id").notEmpty().withMessage("Не указан ID целевого пользователя"),
  contactController.addContact
);
router.get(
  Routers.CHAT_CONTACTS,
  authMiddleware,
  contactController.getContacts
);
router.delete(
  Routers.CHAT_REMOVE,
  authMiddleware,
  contactController.removeContact
);
router.get(
  Routers.CHAT_MESSAGES,
  authMiddleware,
  query("chatId").notEmpty().withMessage("Не указан chatId"),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit должен быть целым числом >= 1"), // Валидация limit
  query("skip")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Skip должен быть целым числом >= 0"), // Валидация skip
  chatController.getMessages
);
router.post(
  "/users/status",
  authMiddleware,
  body("userIds")
    .isArray()
    .withMessage("userIds должен быть массивом")
    .custom((userIds) => userIds.every((id: unknown) => typeof id === "string"))
    .withMessage("Все userIds должны быть строками"),
  userStatusController.getStatuses
);

export default router;
