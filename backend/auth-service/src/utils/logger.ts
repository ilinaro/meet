export const logger = {
  log: (message: string) => console.log(`[LOG] ${message}`),
  info: (message: any) => console.log(message),
  success: (message: string, ...args: any[]) =>
    console.log(`[SUCCESS] ${message}`, ...args),
  warn: (message: string) => console.warn(`[WARN] ${message}`),
  error: (message: string, error?: any) =>
    console.error(`[ERROR] ${message}`, error),
};
