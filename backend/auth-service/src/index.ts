import "./config/env";
import express, { Express } from "express";
import { createServer } from "http"; // Импортируем http для создания сервера
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import router from "./router";
import { logger } from "./utils/logger";
import errorMiddleware from "./middleware/error-middleware";
import { initWebSocket } from "./websocket/websocket";
// test
const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);
app.use("/api", router);
app.use(errorMiddleware);

const httpServer = createServer(app);

initWebSocket(httpServer);

const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;

const start = async () => {
  try {
    await mongoose.connect(DB_URL);
    httpServer.listen(PORT, () =>
      logger.success("Server started on port", PORT),
    );
  } catch (e) {
    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error:", err);
    });
    logger.error("Caught error mongoose:", e);
  }
};

start();
