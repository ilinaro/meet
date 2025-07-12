# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
COPY .env ./
ARG VITE_WS_URL
ENV VITE_WS_URL=$VITE_WS_URL
ENV CLIENT_PORT=$CLIENT_PORT
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE CLIENT_PORT
CMD ["nginx", "-g", "daemon off;"]