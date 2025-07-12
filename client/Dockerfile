# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Копируем исходный код
COPY . .

# Получаем аргументы сборки
ARG VITE_API_URL
ARG VITE_WS_URL
ARG CLIENT_PORT

# Устанавливаем переменные окружения для сборки
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL

# Собираем приложение
RUN npm run build

# Production stage
FROM nginx:alpine

# Копируем собранное приложение
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Получаем порт из аргументов
ARG CLIENT_PORT
ENV CLIENT_PORT=$CLIENT_PORT

# Экспонируем порт
EXPOSE $CLIENT_PORT

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]