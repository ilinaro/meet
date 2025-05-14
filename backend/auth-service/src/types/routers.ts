export enum Routers {
  REGISTRATION = "/registration",
  LOGIN = "/login",
  LOGOUT = "/logout",
  ACTIVE = "/active/:link",
  REFRESH = "/refresh",
  USERS = "/users",
  SEARCH_USERS = "/search-users",
  UPDATE_USER = "/update-user",
  GET_USER = "/user",
  GET_USER_BY_ID = "/users/:id",
  CHAT_START = "/chat/start",
  CHAT_GET = "/chat/:id",
  CHAT_MESSAGE_SEND = "/chat/:id/message",
  CHAT_MESSAGES_GET = "/chat/:id/messages",
  CHAT_MESSAGES = "/chat/messages",
  CHAT_ADD_CONTACT = "/chat/add-contact",
  CHAT_CONTACTS = "/chat/contacts",
  CHAT_REMOVE = "/chat/remove-contact/:id",
}

/*

Поиск и добавление контактов:
Добавляет в контакты (POST /api/chat/add-contact), создаётся запись в ContactModel.
Чаты:
Пользователь начинает чат (POST /api/chat/start), если targetUserId в контактах.
Отправляет сообщения (POST /api/chat/:id/message) через HTTP или WebSocket (sendMessage).
Получает сообщения (GET /api/chat/:id/messages).
WebSocket:
Пользователь подключается с userId, статус обновляется в UserStatusModel.
Присоединяется к чату (joinChat), получает сообщения в реальном времени (newMessage).
При отключении статус обновляется (isOnline: false, lastSeen).
Статус:
UserStatusModel хранит isOnline, lastSeen для каждого пользователя.
GET /api/chat/contacts возвращает контакты с актуальным статусом.

*/