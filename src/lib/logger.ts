const logger = {
  log: (level: string, data: unknown) => {
    console.log(`[${level}]`, data);
  },
  info: (...args: unknown[]) => console.log('[info]', ...args),
  error: (...args: unknown[]) => console.error('[error]', ...args),
  warn: (...args: unknown[]) => console.warn('[warn]', ...args),
};

export default logger;
