import { PeerServer } from "peer";
import fs from "fs/promises";
import path from "path";

// Минимальные типы для PeerServer и клиента
interface PeerServerClient {
  getId: () => string;
}

const PORT = 9000;

// Асинхронная функция для чтения сертификатов
const getCerts = async () => {
  try {
    // Использование path.resolve для получения абсолютного пути к файлам
    const keyPath = path.resolve(process.cwd(), "certs", "key.pem");
    const certPath = path.resolve(process.cwd(), "certs", "cert.pem");
    
    console.log("Пытаюсь прочитать файлы по путям:");
    console.log("Key path:", keyPath);
    console.log("Cert path:", certPath);
    
    // Проверяем существование файлов перед чтением
    try {
      await fs.access(keyPath);
      await fs.access(certPath);
      console.log("Файлы сертификатов существуют");
    } catch (err) {
      console.error("Ошибка доступа к файлам сертификатов:", err);
      console.log("Запускаем сервер без SSL");
      return null; // Возвращаем null если файлы не найдены
    }
    
    const key = await fs.readFile(keyPath, "utf8");
    const cert = await fs.readFile(certPath, "utf8");
    
    return { key, cert };
  } catch (err) {
    console.error("Ошибка при чтении сертификатов:", err);
    console.log("Запускаем сервер без SSL");
    return null;
  }
};

// Инициализация сервера
const startServer = async () => {
  try {
    // Пробуем получить сертификаты
    const sslOptions = await getCerts();
    
    // Базовые настройки сервера
    const serverOptions = {
      port: PORT,
      path: "/peerjs",
      allow_discovery: true,
    };
    
    // Если сертификаты доступны, добавляем их в настройки
    const peerServerOptions = sslOptions 
      ? { ...serverOptions, ssl: sslOptions }
      : serverOptions;
    
    const peerServer = PeerServer(peerServerOptions);

    peerServer.on("connection", (client: PeerServerClient) => {
      console.log(`Клиент подключился: ${client.getId()}`);
    });

    peerServer.on("disconnect", (client: PeerServerClient) => {
      console.log(`Клиент отключился: ${client.getId()}`);
    });

    console.log(`PeerJS сервер запущен на порту ${PORT}`);
  } catch (err) {
    console.error("Критическая ошибка при запуске сервера:", err);
    process.exit(1);
  }
};

// Запуск сервера
startServer().catch((err) => {
  console.error("Необработанная ошибка при запуске сервера:", err);
  process.exit(1);
});