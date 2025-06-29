# Сборка зависимостей
FROM node:20-alpine AS deps
WORKDIR /app
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm install

# Сборка приложения
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
ARG VITE_API_URL
ARG VITE_WS_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL
RUN npm install -g npm@11.4.2 && npm run build
# Отладка переменных
RUN echo "VITE_API_URL=$VITE_API_URL" > /app/env-debug.txt
RUN echo "VITE_WS_URL=$VITE_WS_URL" >> /app/env-debug.txt

# Финальный образ с Nginx
FROM nginx:alpine AS runner
ARG CLIENT_PORT
ARG API_PORT
ENV CLIENT_PORT=$CLIENT_PORT
ENV API_PORT=$API_PORT
COPY ./nginx.conf.template /etc/nginx/conf.d/nginx.conf.template
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/env-debug.txt /usr/share/nginx/html/env-debug.txt
# Подставляем переменные в nginx.conf
RUN envsubst '${CLIENT_PORT},${API_PORT}' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf
EXPOSE ${CLIENT_PORT}
CMD ["nginx", "-g", "daemon off;"]