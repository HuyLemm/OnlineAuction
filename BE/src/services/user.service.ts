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

const SALT_ROUNDS = 10;

const OTP_EXPIRE_MINUTES = 2; // OTP sống 2 phút

export class UserService {
  // ===============================
  // Login
  // ===============================
  static async login(email: string, password: string) {
    // 1️⃣ Tìm user
    const user = await db("users")
      .select("id", "email", "password_hash", "is_verified", "role")
      .where({ email })
      .first();

    if (!user) {
      throw new Error("Email not found.");
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
      created_at: new Date(),
      expired_at: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 ngày
      ),
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
    const now = new Date();

    return await db.transaction(async (trx) => {
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
          last_otp_sent_at: now, // ⏱ mốc xoá account
        })
        .returning(["id", "email"]);

      // 4. Generate OTP
      const otp = UserService.generateOTP();
      const expiredAt = new Date(
        now.getTime() + OTP_EXPIRE_MINUTES * 60 * 1000
      );

      // 5. Insert OTP
      await trx("user_otps").insert({
        user_id: user.id,
        otp_code: otp,
        purpose: "verify_email",
        expired_at: expiredAt,
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
    if (new Date(otpRow.expired_at) < new Date()) {
      throw new Error("OTP expired");
    }

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
      expired_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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
    const otp = UserService.generateOTP();
    const expiredAt = new Date(now.getTime() + OTP_EXPIRE_MINUTES * 60 * 1000);

    await db("user_otps").insert({
      user_id: user.id,
      otp_code: otp,
      purpose: "verify_email",
      expired_at: expiredAt,
    });

    // Gia hạn account
    await db("users").where({ id: user.id }).update({ last_otp_sent_at: now });

    // await sendOtpMail(email, otp);
    console.log(`OTP RESEND ${email}: ${otp}`);

    return { message: "OTP resent successfully" };
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
      .andWhere("expired_at", ">", new Date())
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
