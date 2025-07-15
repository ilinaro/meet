FROM node:20.12.1-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci
RUN npm install typescript@5.5.3

COPY src/ ./src/
COPY tsconfig.json ./

RUN npm run build

FROM node:20.12.1-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=build /app/dist/ ./dist/

EXPOSE ${PORT}

CMD ["node", "dist/index.js"]