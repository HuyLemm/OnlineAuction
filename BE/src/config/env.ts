import dotenv from "dotenv";
dotenv.config();

export const env = {
  DB_HOST: process.env.SUPABASE_HOST!,
  DB_PORT: Number(process.env.SUPABASE_PORT!),
  DB_NAME: process.env.SUPABASE_DB!,
  DB_USER: process.env.SUPABASE_USER!,
  DB_PASSWORD: process.env.SUPABASE_PASSWORD!,
  JWT_SECRET: process.env.JWT_SECRET!,
  PORT: Number(process.env.PORT) || 3000,
  MAIL_HOST: process.env.MAIL_HOST!,
  MAIL_PORT: Number(process.env.MAIL_PORT!),
  MAIL_USER: process.env.MAIL_USER!,
  MAIL_PASS: process.env.MAIL_PASS!,
  MAIL_FROM: process.env.MAIL_FROM!,
  RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY!,
};
