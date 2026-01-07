import bcrypt from "bcrypt";
import crypto from "crypto";
import { db } from "../config/db";
import { RegisterDTO, VerifyOtpDTO } from "../dto/user.dto";
import { sendOtpMail } from "../utils/sendOtpMail";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";

import { getDbNowMs, getDbNow } from "../utils/time";

const SALT_ROUNDS = 10;

const OTP_EXPIRE_MINUTES = 2; // OTP sống 2 phút

export class AuthService {
  // ===============================
  // Login
  // ===============================
  static async login(email: string, password: string) {
    // 1️⃣ Tìm user
    const user = await db("users")
      .select(
        "id",
        "email",
        "password_hash",
        "is_verified",
        "role",
        "is_deleted"
      )
      .where({ email })
      .first();

    if (!user) {
      throw new Error("Email not found.");
    }

    // 🚫 NEW: chặn user bị xóa
    if (user.is_deleted) {
      throw new Error("Account has been disabled. Please contact support.");
    }

    // 2️⃣ Check verify
    if (!user.is_verified) {
      throw new Error("Please verify your email before logging in.");
    }

    // 3️⃣ Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error("Password incorrect.");
    }

    // 4️⃣ Tạo tokens
    const accessToken = signAccessToken({
      userId: user.id, // UUID → string
      role: user.role,
    });

    const refreshToken = signRefreshToken({
      userId: user.id,
    });
    await db("user_sessions").where({ user_id: user.id }).del();
    // 5️⃣ Lưu refresh token vào DB
    await db("user_sessions").insert({
      user_id: user.id,
      refresh_token: refreshToken, // ✅ ĐÚNG
      created_at: db.raw("NOW()"),
      expired_at: db.raw("NOW() + INTERVAL '7 DAYS'"),
    });

    // 6️⃣ Trả kết quả
    return {
      accessToken,
      refreshToken,
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  // ===============================
  // Register
  // ===============================
  static async register(dto: RegisterDTO) {
    return await db.transaction(async (trx) => {
      const dbNow = await getDbNow(trx);
      // 1. Check user theo email
      const existingUser = await trx("users")
        .select("id", "is_verified")
        .where({ email: dto.email })
        .first();

      if (existingUser?.is_verified) {
        throw new Error("Email already exists");
      }

      // Nếu user pending → xoá sạch
      if (existingUser && !existingUser.is_verified) {
        await trx("user_otps").where({ user_id: existingUser.id }).del();
        await trx("users").where({ id: existingUser.id }).del();
      }

      // 2. Hash password
      const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

      // 3. Insert user
      const [user] = await trx("users")
        .insert({
          full_name: dto.fullName,
          email: dto.email,
          password_hash: passwordHash,
          address: dto.address,
          role: "bidder",
          is_verified: false,
          last_otp_sent_at: dbNow, // ⏱ mốc xoá account
          created_at: dbNow,
        })
        .returning(["id", "email"]);

      // 4. Generate OTP
      const otp = AuthService.generateOTP();

      // 5. Insert OTP
      await trx("user_otps").insert({
        user_id: user.id,
        otp_code: otp,
        purpose: "verify_email",
        expired_at: db.raw(`NOW() + INTERVAL '${OTP_EXPIRE_MINUTES} MINUTES'`),
      });

      // 6. Gửi mail (thay console.log sau)
      await sendOtpMail(user.email, otp);
      console.log(`OTP REGISTER ${user.email}: ${otp}`);

      return {
        message: "OTP sent to your email.",
        email: user.email,
      };
    });
  }

  // ===============================
  // Verify OTP
  // ===============================
  static async verifyOtp(dto: VerifyOtpDTO) {
    const user = await db("users")
      .select("id", "email", "is_verified", "role")
      .where({ email: dto.email })
      .first();

    if (!user) throw new Error("User not found");
    if (user.is_verified) throw new Error("User already verified");

    const otpRow = await db("user_otps")
      .where({
        user_id: user.id,
        otp_code: dto.otp,
        purpose: dto.purpose, // verify_email
      })
      .first();

    if (!otpRow) throw new Error("Invalid OTP");
    const expired = await db("user_otps")
      .where({ id: otpRow.id })
      .andWhere("expired_at", "<", db.raw("NOW()"))
      .first();

    if (expired) throw new Error("OTP expired");

    // Verify user
    await db("users").where({ id: user.id }).update({
      is_verified: true,
      last_otp_sent_at: null, // ✅ clear timer
    });

    // Xoá toàn bộ OTP
    await db("user_otps").where({ user_id: user.id }).del();

    // ✅ TẠO TOKEN
    const accessToken = signAccessToken({
      userId: user.id,
      role: user.role,
    });

    const refreshToken = signRefreshToken({
      userId: user.id,
    });

    await db("user_sessions").where({ user_id: user.id }).del();

    // ✅ LƯU refresh token
    await db("user_sessions").insert({
      user_id: user.id,
      refresh_token: refreshToken,
      created_at: new Date(),
      expired_at: db.raw("NOW() + INTERVAL '7 DAYS'"),
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  // ===============================
  // Resend OTP
  // ===============================
  static async resendOtp(email: string) {
    const now = new Date();

    const user = await db("users")
      .select("id", "is_verified")
      .where({ email })
      .first();

    if (!user) throw new Error("User not found");
    if (user.is_verified) throw new Error("User already verified");

    // Xoá OTP cũ
    await db("user_otps")
      .where({ user_id: user.id, purpose: "verify_email" })
      .del();

    // Tạo OTP mới
    const otp = AuthService.generateOTP();

    await db("user_otps").insert({
      user_id: user.id,
      otp_code: otp,
      purpose: "verify_email",
      expired_at: db.raw(`NOW() + INTERVAL '${OTP_EXPIRE_MINUTES} MINUTES'`),
    });

    // Gia hạn account
    await db("users").where({ id: user.id }).update({ last_otp_sent_at: now });

    // await sendOtpMail(email, otp);
    console.log(`OTP RESEND ${email}: ${otp}`);

    return { message: "OTP resent successfully" };
  }

  // ===============================
  // Forgot Password - Request OTP
  // ===============================
  static async requestForgotPassword(email: string) {
    const now = new Date();

    const user = await db("users")
      .select("id", "email", "is_verified")
      .where({ email })
      .first();

    if (!user) {
      throw new Error("Email not found");
    }

    if (!user.is_verified) {
      throw new Error("Email is not verified");
    }

    // ❌ xoá OTP reset cũ
    await db("user_otps")
      .where({
        user_id: user.id,
        purpose: "reset_password",
      })
      .del();

    // ✅ tạo OTP mới
    const otp = AuthService.generateOTP();

    await db("user_otps").insert({
      user_id: user.id,
      otp_code: otp,
      purpose: "reset_password",
      expired_at: db.raw(`NOW() + INTERVAL '${OTP_EXPIRE_MINUTES} MINUTES'`),
    });

    // gửi mail
    await sendOtpMail(user.email, otp);
    console.log(`OTP RESET PASSWORD ${email}: ${otp}`);

    return {
      message: "Password reset OTP sent to email",
    };
  }

  // ===============================
  // Forgot Password - Verify OTP
  // ===============================
  static async verifyForgotPasswordOtp(email: string, otp: string) {
    const user = await db("users").select("id").where({ email }).first();

    if (!user) {
      throw new Error("User not found");
    }

    const otpRow = await db("user_otps")
      .where({
        user_id: user.id,
        otp_code: otp,
        purpose: "reset_password",
      })
      .first();

    if (!otpRow) {
      throw new Error("Invalid OTP");
    }

    const expired = await db("user_otps")
      .where({ id: otpRow.id })
      .andWhere("expired_at", "<", db.raw("NOW()"))
      .first();

    if (expired) throw new Error("OTP expired");

    return {
      message: "OTP verified",
      userId: user.id, // dùng cho bước set password
    };
  }

  // ===============================
  // Forgot Password - Reset Password
  // ===============================
  static async resetPassword(userId: string, newPassword: string) {
    if (!newPassword || newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await db("users").where({ id: userId }).update({ password_hash: hash });

    // ❌ xoá OTP reset
    await db("user_otps")
      .where({
        user_id: userId,
        purpose: "reset_password",
      })
      .del();

    // ❌ revoke tất cả session
    await db("user_sessions").where({ user_id: userId }).del();

    return {
      message: "Password reset successfully",
    };
  }

  // ===============================
  // Refresh access token
  // ===============================
  static async refreshAccessToken(refreshToken: string) {
    // 1️⃣ Verify refresh token (JWT)
    const payload = verifyRefreshToken(refreshToken);

    // 2️⃣ Check session trong DB
    const session = await db("user_sessions")
      .where({ refresh_token: refreshToken })
      .andWhere("expired_at", ">", db.raw("NOW()"))
      .first();

    if (!session) {
      throw new Error("Refresh token expired or revoked");
    }

    // 3️⃣ Lấy role user
    const user = await db("users")
      .select("id", "role")
      .where({ id: payload.userId })
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // 4️⃣ Cấp access token mới
    const newAccessToken = signAccessToken({
      userId: user.id,
      role: user.role,
    });

    return {
      accessToken: newAccessToken,
    };
  }

  // ===============================
  // Helpers
  // ===============================
  private static generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString();
  }
}
