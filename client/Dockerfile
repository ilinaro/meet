# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build arguments (будут переданы из GitHub Actions)
ARG VITE_API_URL
ARG VITE_WS_URL
ARG CLIENT_PORT

# Set environment variables for build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Install envsubst for template substitution
RUN apk add --no-cache gettext

# Copy built application
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration template
COPY nginx.template /etc/nginx/templates/default.conf.template

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Set environment variables
ENV CLIENT_PORT=${CLIENT_PORT:-3009}
ENV API_PORT=${API_PORT:-4001}
ENV WS_PORT=${WS_PORT:-5001}

# Expose port
EXPOSE $CLIENT_PORT

# Start nginx with template substitution
CMD ["sh", "-c", "envsubst '${CLIENT_PORT} ${API_PORT} ${WS_PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]