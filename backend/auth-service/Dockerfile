FROM node:20.12.1-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY src/ ./src/
COPY tsconfig.json ./

RUN npm run build || { echo "Build failed, check tsc errors above"; exit 1; }

EXPOSE ${PORT}

CMD ["node", "dist/index.js"]