import dotenv from "dotenv";
dotenv.config();

export const env = {
  DB_HOST: process.env.SUPABASE_HOST!,
  DB_PORT: Number(process.env.SUPABASE_PORT!),
  DB_NAME: process.env.SUPABASE_DB!,
  DB_USER: process.env.SUPABASE_USER!,
  DB_PASSWORD: process.env.SUPABASE_PASSWORD!,
  PORT: Number(process.env.PORT) || 3000,

  SUPABASE_URL: process.env.SUPABASE_URL!,  
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,

  MAIL_USER: process.env.MAIL_USER!,
  MAIL_PASS: process.env.MAIL_PASS!,
  MAIL_FROM: process.env.MAIL_FROM!,

  RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY!,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
};
