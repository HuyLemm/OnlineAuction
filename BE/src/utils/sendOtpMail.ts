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

export async function sendSellerBidUpdateMail({
  to,
  sellerName,
  productTitle,
  currentPrice,
  productId,
}: {
  to: string;
  sellerName: string;
  productTitle: string;
  currentPrice: number;
  productId: string;
}) {
  const link = `${env.FRONTEND_URL}/product/${productId}`;

  await mailer.sendMail({
    from: env.MAIL_FROM,
    to,
    subject: `Your product "${productTitle}" received a new bid`,
    html: `
      <div style="font-family: Arial; line-height:1.6">
        <h2>Hello ${sellerName},</h2>

        <p>Your auction item <b>${productTitle}</b> has received a new bid.</p>

        <p>
          <b>Current price:</b>
          <span style="color:#d4a446; font-size:18px">
            ${currentPrice.toLocaleString()}$
          </span>
        </p>

        <a href="${link}" style="display:inline-block;margin-top:16px;
          padding:10px 16px;background:#d4a446;color:black;
          text-decoration:none;font-weight:bold;border-radius:6px;">
          View auction
        </a>

        <p style="margin-top:24px">— LuxeAuction Team</p>
      </div>
    `,
  });
}

export async function sendWinningBidMail({
  to,
  bidderName,
  productTitle,
  currentPrice,
  productId,
}: {
  to: string;
  bidderName: string;
  productTitle: string;
  currentPrice: number;
  productId: string;
}) {
  const link = `${env.FRONTEND_URL}/product/${productId}`;

  await mailer.sendMail({
    from: env.MAIL_FROM,
    to,
    subject: `You're currently winning "${productTitle}"`,
    html: `
      <div style="font-family: Arial; line-height:1.6">
        <h2>Congratulations ${bidderName} 🎉</h2>

        <p>You are currently the <b>highest bidder</b> for:</p>

        <p><b>${productTitle}</b></p>

        <p>
          Current price:
          <b style="color:#d4a446">
            ${currentPrice.toLocaleString()}$
          </b>
        </p>

        <p>Keep an eye on the auction in case someone bids higher.</p>

        <a href="${link}" style="display:inline-block;margin-top:16px;
          padding:10px 16px;background:#d4a446;color:black;
          text-decoration:none;font-weight:bold;border-radius:6px;">
          View auction
        </a>

        <p style="margin-top:24px">— LuxeAuction Team</p>
      </div>
    `,
  });
}

export async function sendOutbidMail({
  to,
  bidderName,
  productTitle,
  currentPrice,
  productId,
}: {
  to: string;
  bidderName: string;
  productTitle: string;
  currentPrice: number;
  productId: string;
}) {
  const link = `${env.FRONTEND_URL}/product/${productId}`;

  await mailer.sendMail({
    from: env.MAIL_FROM,
    to,
    subject: `You've been outbid on "${productTitle}"`,
    html: `
      <div style="font-family: Arial; line-height:1.6">
        <h2>Hello ${bidderName},</h2>

        <p>You have been <b>outbid</b> on:</p>

        <p><b>${productTitle}</b></p>

        <p>
          New current price:
          <b style="color:#d4a446">
            ${currentPrice.toLocaleString()}$
          </b>
        </p>

        <p>You can place a higher bid if you're still interested.</p>

        <a href="${link}" style="display:inline-block;margin-top:16px;
          padding:10px 16px;background:#d4a446;color:black;
          text-decoration:none;font-weight:bold;border-radius:6px;">
          Bid again
        </a>

        <p style="margin-top:24px">— LuxeAuction Team</p>
      </div>
    `,
  });
}

export async function sendBidRejectedMail({
  to,
  bidderName,
  productTitle,
  productId,
  reason,
}: {
  to: string;
  bidderName: string;
  productTitle: string;
  productId: string;
  reason?: string;
}) {
  const link = `${env.FRONTEND_URL}/product/${productId}`;

  await mailer.sendMail({
    from: env.MAIL_FROM,
    to,
    subject: `You can no longer bid on "${productTitle}"`,
    html: `
      <div style="font-family: Arial; line-height:1.6">
        <h2>Hello ${bidderName},</h2>

        <p>
          You are no longer allowed to place bids on the following auction:
        </p>

        <p><b>${productTitle}</b></p>

        ${
          reason
            ? `<p><b>Reason:</b> ${reason}</p>`
            : `<p>The seller has restricted your bidding access.</p>`
        }

        <p>
          You can still view the product, but bidding is disabled for you.
        </p>

        <a href="${link}" style="
          display:inline-block;
          margin-top:16px;
          padding:10px 16px;
          background:#d4a446;
          color:black;
          text-decoration:none;
          font-weight:bold;
          border-radius:6px;">
          View product
        </a>

        <p style="margin-top:24px">
          — LuxeAuction Team
        </p>
      </div>
    `,
  });
}

export async function sendAutoBidUpdatedMail({
  to,
  bidderName,
  productTitle,
  maxBid,
  productId,
}: {
  to: string;
  bidderName: string;
  productTitle: string;
  maxBid: number;
  productId: string;
}) {
  const link = `${env.FRONTEND_URL}/product/${productId}`;

  await mailer.sendMail({
    from: env.MAIL_FROM,
    to,
    subject: `Your auto-bid was updated for "${productTitle}"`,
    html: `
      <div style="font-family: Arial; line-height:1.6">
        <h2>Hello ${bidderName},</h2>

        <p>Your automatic bid has been successfully updated.</p>

        <p>
          <b>Item:</b> ${productTitle}<br/>
          <b>Your new maximum bid:</b>
          <span style="color:#d4a446;font-weight:bold">
            ${maxBid.toLocaleString()}₫
          </span>
        </p>

        <p>
          The current auction price did not change, and you are still protected
          by your automatic bidding limit.
        </p>

        <a href="${link}"
           style="display:inline-block;margin-top:16px;
           padding:10px 16px;background:#d4a446;color:black;
           text-decoration:none;font-weight:bold;border-radius:6px;">
          View auction
        </a>

        <p style="margin-top:24px">— LuxeAuction Team</p>
      </div>
    `,
  });
}

export async function sendAuctionExpiredNoBidMail({
  to,
  sellerName,
  productTitle,
  productId,
}: {
  to: string;
  sellerName: string;
  productTitle: string;
  productId: string;
}) {
  await mailer.sendMail({
    from: env.MAIL_FROM,
    to,
    subject: `Your auction ended without bids – "${productTitle}"`,
    html: `
      <div style="font-family: Arial; line-height:1.6">
        <h2>Hello ${sellerName},</h2>

        <p>Your auction has ended, but unfortunately no bids were placed.</p>

        <p><b>Item:</b> ${productTitle}</p>

        <a href="${env.FRONTEND_URL}/product/${productId}"
           style="display:inline-block;margin-top:16px;
           padding:10px 16px;background:#d4a446;color:black;
           text-decoration:none;font-weight:bold;border-radius:6px;">
          Relist item
        </a>

        <p style="margin-top:24px">— LuxeAuction Team</p>
      </div>
    `,
  });
}

export async function sendAuctionWonMail({
  to,
  buyerName,
  productTitle,
  finalPrice,
  productId,
}: {
  to: string;
  buyerName: string;
  productTitle: string;
  finalPrice: number;
  productId: string;
}) {
  await mailer.sendMail({
    from: env.MAIL_FROM,
    to,
    subject: `You won the auction – "${productTitle}"`,
    html: `
      <div style="font-family: Arial; line-height:1.6">
        <h2>Congratulations ${buyerName} 🎉</h2>

        <p>You won the auction for:</p>
        <p><b>${productTitle}</b></p>

        <p>
          <b>Final price:</b>
          <span style="color:#d4a446;font-weight:bold">
            ${finalPrice.toLocaleString()}₫
          </span>
        </p>

        <a href="${env.FRONTEND_URL}/orders"
           style="display:inline-block;margin-top:16px;
           padding:10px 16px;background:#d4a446;color:black;
           text-decoration:none;font-weight:bold;border-radius:6px;">
          Complete payment
        </a>

        <p style="margin-top:24px">— LuxeAuction Team</p>
      </div>
    `,
  });
}

export async function sendAuctionSoldMail({
  to,
  sellerName,
  productTitle,
  finalPrice,
  productId,
}: {
  to: string;
  sellerName: string;
  productTitle: string;
  finalPrice: number;
  productId: string;
}) {
  await mailer.sendMail({
    from: env.MAIL_FROM,
    to,
    subject: `Your item has been sold – "${productTitle}"`,
    html: `
      <div style="font-family: Arial; line-height:1.6">
        <h2>Hello ${sellerName},</h2>

        <p>Your auction has ended successfully.</p>

        <p>
          <b>Item:</b> ${productTitle}<br/>
          <b>Final price:</b>
          <span style="color:#d4a446;font-weight:bold">
            ${finalPrice.toLocaleString()}₫
          </span>
        </p>

        <a href="${env.FRONTEND_URL}/seller/orders"
           style="display:inline-block;margin-top:16px;
           padding:10px 16px;background:#d4a446;color:black;
           text-decoration:none;font-weight:bold;border-radius:6px;">
          View order
        </a>

        <p style="margin-top:24px">— LuxeAuction Team</p>
      </div>
    `,
  });
}

export async function sendPasswordChangedByAdminMail({
  to,
  userName,
}: {
  to: string;
  userName: string;
}) {
  await mailer.sendMail({
    from: env.MAIL_FROM,
    to,
    subject: "Your password has been changed – LuxeAuction",
    html: `
      <div style="font-family: Arial; line-height:1.6">
        <h2>Hello ${userName},</h2>

        <p>
          Your account password has been <b>changed by an administrator</b>.
        </p>

        <p>
          If you recognize this action, no further steps are required.
        </p>

        <p style="color:#b91c1c">
          ⚠️ If you did <b>NOT</b> request this change, please reset your password
          immediately and contact our support team.
        </p>

        <a href="${env.FRONTEND_URL}/forgot-password"
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
          Secure my account
        </a>

        <p style="margin-top:24px">
          — LuxeAuction Security Team
        </p>
      </div>
    `,
  });
}

export async function sendAutoBidProductUpdatedMail({
  to,
  bidderName,
  productTitle,
  productId,
  updateContent,
}: {
  to: string;
  bidderName: string;
  productTitle: string;
  productId: string;
  updateContent: string;
}) {
  const link = `${env.FRONTEND_URL}/product/${productId}`;

  await mailer.sendMail({
    from: env.MAIL_FROM,
    to,
    subject: `Update on auction you're auto-bidding – "${productTitle}"`,
    html: `
      <div style="font-family: Arial; line-height:1.6">
        <h2>Hello ${bidderName},</h2>

        <p>
          The seller has <b>updated the product description</b> for an auction
          you are currently auto-bidding on:
        </p>

        <p><b>${productTitle}</b></p>

        <blockquote style="
          border-left:4px solid #d4a446;
          padding-left:12px;
          margin:16px 0;
        ">
          ${updateContent}
        </blockquote>

        <p>Please review the update to decide if you want to continue bidding.</p>

        <a href="${link}"
           style="display:inline-block;margin-top:16px;
           padding:10px 16px;background:#d4a446;color:black;
           text-decoration:none;font-weight:bold;border-radius:6px;">
          View auction
        </a>

        <p style="margin-top:24px">— LuxeAuction Team</p>
      </div>
    `,
  });
}
