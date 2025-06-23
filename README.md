# Meet - Документация проекта

## Содержание
1. [Обзор проекта](#обзор-проекта)
2. [Структура проекта](#структура-проекта)
3. [Настройка окружения](#настройка-окружения)
4. [Клиентская часть (Frontend)](#клиентская-часть-frontend)
5. [Серверная часть (Backend)](#серверная-часть-backend)
6. [Разработка](#разработка)
7. [Сборка и деплой](#сборка-и-деплой)
8. [Инструменты контроля кода](#инструменты-контроля-кода)

## Обзор проекта

Registration App - это приложение для регистрации пользователей с полноценной клиент-серверной архитектурой. Проект состоит из:
- Frontend: React-приложение, созданное с помощью Vite
- Backend: Node.js/Express API с MongoDB

## Структура проекта

```
meet/
├── client/               # Frontend часть
│   ├── src/              # Исходный код React-приложения
│   ├── public/           # Статические файлы
│   ├── ...               # Конфигурационные файлы
│   └── package.json      # Зависимости клиентской части
├── backend/
|   ├── auth-service/     # Backend часть
│   |    ├── src/         # Исходный код сервера
│   |    ├── ...          # Конфигурационные файлы
│   |    └── package.json # Зависимости серверной части
│   └── peer-service/     # Разарботка p2p для видео соединения WebRTC
├── .husky/               # Хуки Git для контроля качества кода
├── .gitignore            # Исключения для Git
├── package.json          # Зависимости корневого проекта
└── README.md             # Документация проекта
```

## Настройка окружения

### Требования
- Node.js (v18 или выше)
- npm (v8 или выше)
- MongoDB (локальная установка или удаленный кластер)

### Установка

1. **Клонирование репозитория**
   ```bash
   git clone <repository-url>
   cd meet
   ```

2. **Установка зависимостей**
   ```bash
   # Установка зависимостей корневого проекта
   npm install
   
   # Установка зависимостей клиента
   cd client
   npm install
   
   # Установка зависимостей сервера
   cd ../server
   npm install
   ```

3. **Настройка переменных окружения**

   Создайте файл `.env` в директории `server`:
   ```
   PORT=5000
   DB_URL=mongodb
   JWT_ACCESS_SECRET=your_access_secret_key
   JWT_REFRESH_SECRET=your_refresh_secret_key
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your_email@example.com
   SMTP_PASSWORD=your_email_password
   API_URL=localhost
   CLIENT_URL=localhost
   ```

   Создайте файл `.env` в директории `client`:
   ```
   VITE_API_URL=localhost
   VITE_WS_URL=localhost
   ```

## Клиентская часть (Frontend)

### Технологии
- React 19
- TypeScript
- Vite
- Redux Toolkit
- React Query
- Axios
- SCSS
- ESLint и Prettier для форматирования кода

### Запуск в режиме разработки
```bash
cd client
npm run dev:client
```

### Доступные скрипты
- `npm run dev:server` - запуск dev-сервера
- `npm run build` - сборка проекта
- `npm run preview` - предпросмотр собранного проекта
- `npm run lint` - проверка кода ESLint
- `npm run format` - форматирование кода с Prettier
- `npm run check` - проверка форматирования
- `npm run stylelint` - проверка и исправление стилей
- `npm run stylelint:check` - проверка стилей

## Серверная часть (Backend)

### Технологии
- Node.js
- Express
- TypeScript
- MongoDB/Mongoose
- JWT для аутентификации
- Nodemailer для отправки email
- ESLint и Prettier для форматирования кода

### Запуск в режиме разработки
```bash
cd server
npm run dev:server
```

### Доступные скрипты
- `npm run dev:server` - запуск сервера с nodemon для авто-перезагрузки
- `npm run build` - компиляция TypeScript
- `npm run start` - запуск скомпилированного сервера
- `npm run lint` - проверка кода ESLint
- `npm run format` - форматирование кода с Prettier
- `npm run check` - проверка форматирования

## Разработка

### Рабочий процесс
1. Создайте новую ветку из `main` для вашей задачи
2. Внесите необходимые изменения
3. Запустите проверки кода: `lint`, `format` и `check`
4. Создайте коммит (pre-commit хуки запустят проверки автоматически)
5. Отправьте изменения в репозиторий
6. Создайте Pull Request

## Сборка и деплой

### Сборка проекта
```bash
# Сборка клиента
cd client
npm run build

# Сборка сервера
cd ../server/auth-service
npm run build
```

### Запуск в production
```bash
# Запуск сервера
cd server/auth-service
npm run start
```

## Инструменты контроля кода

### Husky
Проект использует Husky для запуска проверок кода перед коммитом. Настройки находятся в директории `.husky/`.

### ESLint
Конфигурация ESLint находится в файлах:
- `client/eslint.config.js`
- `server/eslint.config.js`

### Prettier
Конфигурация Prettier находится в файлах:
- `.prettierrc` в обеих директориях

### Stylelint
Для стилей на клиенте используется Stylelint. Конфигурация в:
- `client/.stylelintrc.json`