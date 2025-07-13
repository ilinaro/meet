FROM node:20.12.1-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

ARG PORT
ENV PORT=$PORT

EXPOSE ${PORT}

CMD ["npm", "run", "start"]