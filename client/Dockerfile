FROM node:20.12.1-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
COPY ../.env ./
ARG VITE_API_URL
ARG VITE_WS_URL
ARG CLIENT_PORT
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL
ENV CLIENT_PORT=$CLIENT_PORT
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/.env /etc/nginx/
EXPOSE ${CLIENT_PORT:-3000}
CMD ["nginx", "-g", "daemon off;"]