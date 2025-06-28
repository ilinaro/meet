# Сборка зависимостей
FROM node:20-alpine AS deps
WORKDIR /app
COPY ./package.json ./package-lock.json ./
RUN npm install -g npm@11.4.2 && npm install

# Сборка приложения
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm install -g npm@11.4.2 && npm run build

# Финальный образ
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
RUN npm install --production
EXPOSE 4001
CMD ["npm", "run", "start"]