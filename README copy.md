# ilim_notifier_api - Документация проекта

## Содержание

- [Обзор](#обзор)
- [Структура](#структура)
- [Установка и настройка](#установка-и-настройка)
- [Функциональность](#функциональность)
- [Сборка и запуск](#сборка-и-запуск)
- [Контроль качества](#контроль-качества)

## Обзор

"ilim_notifier_api" (версия 0.0.1) — серверное приложение на Node.js/Express для автоматизации уведомлений. Оно отправляет текстовые сообщения и файлы в чаты через API BotX и Telegram, интегрируется с корпоративными системами и поддерживает управление чатами. 


Ключевые особенности:

- Отправка сообщений и файлов с выбором мессенджера.
- Адаптеры для BotX и Telegram.
- Аутентификация через JWT и API-ключи.
- Обработка ошибок и логирование.

## Структура

```
ilim_notifier_api/
├── src/
│   ├── adapters/        # Адаптеры для мессенджеров
│   ├── api/             # HTTP-клиент
│   ├── controllers/     # Логика контроллеров
│   ├── exceptions/      # Кастомные ошибки
│   ├── middleware/      # Обработчики запросов
│   ├── routes/          # Маршруты API
│   ├── services/        # Сервисы мессенджеров
│   ├── utils/           # Утилиты
│   ├── app.ts           # Точка входа
│   ├── config/          # Конфигурация
│   └── types/           # Типы
├── .env                 # Переменные окружения
├── package.json         # Зависимости
├── tsconfig.json        # Настройки TypeScript
└── node_modules/        # Зависимости
```

## Установка и настройка

### Требования

- Node.js (18+)
- npm (8+)
- API-ключи BotX и Telegram


### Шаги установки

1. Установите зависимости:

   ```bash
   npm install
   ```

2. Создайте файл .env:
   ```bash
   TELEGRAM_TOKEN=***
   BOT_API_TOKEN=***
   BOT_API_HOST=https://
   JWT_SECRET=***
   CLIENT_SECRET=***
   PORT=3000
   LOG_LEVEL=debug
   NODE_TLS_REJECT_UNAUTHORIZED=0
   EXPRESS_API_HOST=https://
   EXPRESS_BOT_ID=***
   EXPRESS_BOT_SIGNATURE=***
   ```

## Функциональность

### Технологии

- Node.js 
- Express (5.1.0)
- TypeScript
- axios
- winston
- multer
- eslint
- prettier
- ts-node-dev

### Основные возможности

- Отправка сообщений: /v1/messages/send_json (текст).

- Отправка файлов: /v1/messages/send_multipart (до 50MB).

- Список мессенджеров: /v1/messages/list.
  Управление чатами: Создание, удаление пользователей.

## Сборка и запуск

### Сборка

```bash
npm run build
```

### Запуск

```bash
npm run dev
```

## Контроль качества

- .nvmrc - файл для установки версии Node.js
- sample.env - образец файла .env
- eslint.config.js - настройки ESLint
- prettierrc - настройки Prettier

