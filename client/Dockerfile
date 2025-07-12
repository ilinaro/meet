# Build stage
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
ARG VITE_API_URL
ARG VITE_WS_URL
ARG CLIENT_PORT
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
ARG CLIENT_PORT
ENV CLIENT_PORT=$CLIENT_PORT
EXPOSE $CLIENT_PORT
CMD ["nginx", "-g", "daemon off;"]