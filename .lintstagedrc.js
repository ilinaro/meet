module.exports = {
  "client/src/**/*.{ts,tsx,scss,json}": [
    "cd client && npm run format",
    "cd client && npm run lint",
    "cd client && npm run check",
    "cd client && npm run stylelint:check",
  ],
  "server/src/**/*.{ts,js,json}": [
    "cd server && npm run format",
    "cd server && npm run lint",
  ],
};
