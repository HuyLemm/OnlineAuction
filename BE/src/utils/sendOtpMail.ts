import { mailer } from "../config/mailer";
import { env } from "../config/env";

interface QuestionMailParams {
  to: string;
  receiverName: string;
  senderName: string;
  productTitle: string;
  productId: string;
  message: string;
}

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

export async function sendQuestionNotificationMail({
  to,
  receiverName,
  senderName,
  productTitle,
  productId,
  message,
}: QuestionMailParams) {
  const productLink = `${env.FRONTEND_URL}/product/${productId}`;

  await mailer.sendMail({
    from: env.MAIL_FROM,
    to,
    subject: `New message about "${productTitle}"`,
    html: `
      <div style="font-family: Arial; line-height:1.6">
        <h2>Hello ${receiverName},</h2>

        <p><b>${senderName}</b> has sent a new message about your product:</p>

        <blockquote style="border-left:4px solid #d4a446; padding-left:12px; font-size: 16px">
          ${message}
        </blockquote>

        <p>Click this link button below to follow up</p>

        <a href="${productLink}"
           style="
             display:inline-block;
             margin-top:16px;
             padding:10px 16px;
             background:#d4a446;
             color:black;
             text-decoration:none;
             font-weight:bold;
             border-radius:6px;
           ">
          View product & reply
        </a>

        <p style="margin-top:24px">— LuxeAuction Team</p>
      </div>
    `,
  });
}
