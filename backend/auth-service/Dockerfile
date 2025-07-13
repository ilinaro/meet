FROM node:20.12.1-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE ${PORT}
CMD ["npm", "run", "start"]