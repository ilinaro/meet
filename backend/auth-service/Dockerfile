FROM node:20.12.1-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci && npm list typescript

COPY src/ ./src/
COPY tsconfig.json ./

RUN ls -la src/

RUN npx tsc --noEmit || { echo "TypeScript check failed, see errors above"; exit 1; }

RUN npm run build || { echo "Build failed, check tsc errors above"; ls -la dist/; cat /app/tsconfig.json; exit 1; }

EXPOSE ${PORT}

CMD ["node", "dist/index.js"]