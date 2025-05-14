import express from "express";
import { body } from "express-validator";
import userController from "../controllers/user-controller";
import authMiddleware from "../middleware/auth-middleware";
import { Routers } from "../types/routers";

const router = express.Router();

router.post(
  Routers.REGISTRATION,
  body("email").isEmail(),
  body("password").isLength({ min: 8, max: 32 }),
  body("nickname").isLength({ min: 3, max: 20 }),
  userController.registration
);
router.post(Routers.LOGIN, userController.login);
router.post(Routers.LOGOUT, userController.logout);
router.get(Routers.ACTIVE, userController.active);
router.get(Routers.REFRESH, userController.refresh);
router.get(Routers.USERS, authMiddleware, userController.getUsers);
router.get(Routers.SEARCH_USERS, authMiddleware, userController.searchUsers);
router.get(Routers.GET_USER, authMiddleware, userController.getUser);
router.put(Routers.UPDATE_USER, authMiddleware, userController.updateUser)
router.get(Routers.GET_USER_BY_ID, authMiddleware, userController.getUserById);

export default router;

