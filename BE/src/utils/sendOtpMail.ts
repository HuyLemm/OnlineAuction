import { mailer } from "../config/mailer";
import { env } from "../config/env";

export async function sendOtpMail(email: string, otp: string) {
  await mailer.sendMail({
    from: env.MAIL_FROM,
    to: email,
    subject: "Verify your email - LuxeAuction",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6">
        <h2>Verify your email</h2>
        <p>Your verification code is:</p>
        <h1 style="letter-spacing: 6px; color: #d4a446">${otp}</h1>
        <p>This code will expire in <b>2 minutes</b>.</p>
        <p>— LuxeAuction Team</p>
      </div>
    `,
  });
}
