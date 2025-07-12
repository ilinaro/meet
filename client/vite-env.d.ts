/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_WS_URL: string;
  readonly CLIENT_PORT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}