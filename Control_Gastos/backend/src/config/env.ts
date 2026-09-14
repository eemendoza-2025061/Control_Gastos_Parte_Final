import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    database: process.env.DATABASE_NAME || 'control_gastos',
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'admin',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'admin',
    expiresIn: process.env.JWT_EXPIRES_IN || '20m',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '151548182237-vi2kofa5tfob9quhv59o607a97g21veh.apps.googleusercontent.com',
  }
};