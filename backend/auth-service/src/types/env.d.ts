declare namespace NodeJS {
  export interface ProcessEnv {
    DB_URL: string;
    CLIENT_URL: string;
    ROUTER_API: string;
    JWT_ACCESS_SECRET_KEY: string;
    JWT_REFRESH_SECRET_KEY: string;
    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_USER: string;
    SMTP_PASSWORD: string;
    PORT: number;
    API_URL: string;
  }
}
