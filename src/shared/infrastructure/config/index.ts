declare const process: { env: Record<string, string> };

export const PROJECT = {
  name: process.env.PROJECT_NAME,
  port: process.env.PROJECT_PORT,
  production:
    !process.env.TS_NODE ||
    process.env.NODE_ENV == 'production' ||
    process.env.PROJECT_MODE == 'production',
};

export const DATABASE = {
  postgresql: {
    user: process.env.POSTGRES_USER,
    rol: process.env.POSTGRES_ROL,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    logging: process.env.PROJECT_MODE == 'development',
  },
};
