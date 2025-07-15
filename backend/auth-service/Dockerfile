FROM node:20.12.1-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY src/ ./src/
COPY tsconfig.json ./

RUN npm run build

FROM node:20.12.1-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=build /app/dist/ ./dist/

EXPOSE 5000

CMD ["node", "dist/index.js"]