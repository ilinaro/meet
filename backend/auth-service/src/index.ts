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
  })
);
app.use("/api", router);
app.use(errorMiddleware);

const httpServer = createServer(app);

initWebSocket(httpServer);

const start = async () => {
  const PORT = process.env.PORT;
  const DB_URL = process.env.DB_URL;
  const CLIENT_URL = process.env.CLIENT_URL;
  const ROUTER_API = process.env.ROUTER_API;
  const JWT_ACCESS_SECRET_KEY = process.env.JWT_ACCESS_SECRET_KEY;
  const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;
  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_PORT = process.env.SMTP_PORT;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
  const API_URL = process.env.API_URL;
  const WS_PORT = process.env.WS_PORT;

  console.log("PORT", PORT);
  console.log("DB_URL", DB_URL);
  console.log("CLIENT_URL", CLIENT_URL);
  console.log("ROUTER_API", ROUTER_API);
  console.log("JWT_ACCESS_SECRET_KEY", JWT_ACCESS_SECRET_KEY);
  console.log("JWT_REFRESH_SECRET_KEY", JWT_REFRESH_SECRET_KEY);
  console.log("SMTP_HOST", SMTP_HOST);
  console.log("SMTP_PORT", SMTP_PORT); 
  console.log("SMTP_USER", SMTP_USER);
  console.log("SMTP_PASSWORD", SMTP_PASSWORD);
  console.log("API_URL", API_URL);
  console.log("WS_PORT", WS_PORT);

  try {
    await mongoose.connect(DB_URL);
    httpServer.listen(PORT, () =>
      logger.success("Server started on port", PORT)
    );
  } catch (e) {
    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error:", err);
    });
    logger.error("Caught error mongoose:", e);
  }
};

start();
