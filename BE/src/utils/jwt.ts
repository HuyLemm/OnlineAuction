import jwt from "jsonwebtoken";
import { env } from "../config/env";

/* =====================
   CONFIG
===================== */

const ACCESS_SECRET = env.JWT_ACCESS_SECRET as jwt.Secret;
const REFRESH_SECRET = env.JWT_REFRESH_SECRET as jwt.Secret;

const ACCESS_EXPIRES_IN =
  (env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"]) || "15m";

const REFRESH_EXPIRES_IN =
  (env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"]) || "7d";

/* =====================
   PAYLOAD
===================== */

export interface JwtPayload {
  userId: string;   // UUID → dùng string (đúng với Supabase)
  role: string;
}

/* =====================
   SIGN
===================== */

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
  });
}

export function signRefreshToken(payload: Pick<JwtPayload, "userId">): string {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
}

/* =====================
   VERIFY
===================== */

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): { userId: string } {
  return jwt.verify(token, REFRESH_SECRET) as { userId: string };
}
