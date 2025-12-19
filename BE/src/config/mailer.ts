import nodemailer from "nodemailer";
import { env } from "./env";

export const mailer = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  secure: false,
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS,
  },
});
