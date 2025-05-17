import express, { Router } from "express";
import userRouter from "./user-router";
import chatRouter from "./chat-router";

const router: Router = express.Router();

router.use(userRouter);
router.use(chatRouter);

export default router;
