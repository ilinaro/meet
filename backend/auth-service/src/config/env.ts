import dotenv from "dotenv";
import path from "path";

const result = dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

if (result.error) {
  console.error("Error loading .env file:", result.error);
  process.exit(1);
}

const requiredEnvVars = [
  "PORT",
  "DB_URL",
  "CLIENT_URL",
  "ROUTER_API",
  "JWT_ACCESS_SECRET_KEY",
  "JWT_REFRESH_SECRET_KEY",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "API_URL",
];

const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName],
);

if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`,
  );
  process.exit(1);
}

export default process.env;
