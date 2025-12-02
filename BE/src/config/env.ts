import dotenv from "dotenv";
dotenv.config();

export const env = {
  DB_URL: process.env.SUPABASE_DB_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
  PORT: Number(process.env.PORT) || 3000,
};
