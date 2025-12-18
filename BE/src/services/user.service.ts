import bcrypt from "bcrypt";
import crypto from "crypto";
import { db } from "../config/db";
import { RegisterDTO, VerifyOtpDTO } from "../dto/user.dto";

const SALT_ROUNDS = 10;
const OTP_EXPIRE_MINUTES = 5;

export class UserService {
  // ===============================
  // Register
  // ===============================
  static async register(dto: RegisterDTO) {
    // 1. Check user theo email
    const existingUser = await db("users")
      .select("id", "is_verified")
      .where({ email: dto.email })
      .first();

    // Nếu user tồn tại nhưng CHƯA verify → cho đăng ký lại
    if (existingUser && !existingUser.is_verified) {
      await db("user_otps").where({ user_id: existingUser.id }).del();

      await db("users").where({ id: existingUser.id }).del();
    }

    // Nếu user đã verify → chặn
    if (existingUser && existingUser.is_verified) {
      throw new Error("Email already exists");
    }

    // 2. Hash password
    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    // 3. Insert user (pending)
    const [user] = await db("users")
      .insert({
        full_name: dto.fullName,
        email: dto.email,
        password_hash: passwordHash,
        address: dto.address,
        role: "bidder",
        is_verified: false,
      })
      .returning(["id", "email"]);

    // 4. Generate OTP
    const otp = UserService.generateOTP();
    const expiredAt = new Date(Date.now() + OTP_EXPIRE_MINUTES * 60 * 1000);

    // 5. Insert OTP
    await db("user_otps").insert({
      user_id: user.id,
      otp_code: otp,
      purpose: "verify_email",
      expired_at: expiredAt,
    });

    // 6. Send OTP (demo)
    console.log(`Verification code: ${otp}`);

    return {
      message: "Registration successful. Please verify OTP.",
      email: user.email,
    };
  }

  // ===============================
  // Verify OTP
  // ===============================
  static async verifyOtp(dto: VerifyOtpDTO) {
    // 1. Find user
    const user = await db("users")
      .select("id", "is_verified")
      .where({ email: dto.email })
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    if (user.is_verified) {
      throw new Error("User already verified");
    }

    // 2. Find OTP
    const otpRow = await db("user_otps")
      .where({
        user_id: user.id,
        otp_code: dto.otp,
        purpose: dto.purpose, // "verify_email"
      })
      .first();

    if (!otpRow) {
      throw new Error("Invalid OTP");
    }

    if (new Date(otpRow.expired_at) < new Date()) {
      throw new Error("OTP expired");
    }

    // 3. Activate user
    await db("users").where({ id: user.id }).update({ is_verified: true });

    // 4. Delete OTP
    await db("user_otps").where({ id: otpRow.id }).del();

    return {
      message: "OTP verified successfully",
    };
  }

  // ===============================
  // Resend OTP
  // ===============================
  static async resendOtp(email: string) {
    // 1. Find user
    const user = await db("users")
      .select("id", "is_verified")
      .where({ email })
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    if (user.is_verified) {
      throw new Error("User already verified");
    }

    // 2. Delete old OTPs (verify_email)
    await db("user_otps")
      .where({
        user_id: user.id,
        purpose: "verify_email",
      })
      .del();

    // 3. Generate new OTP
    const otp = UserService.generateOTP();
    const expiredAt = new Date(Date.now() + OTP_EXPIRE_MINUTES * 60 * 1000);

    // 4. Insert new OTP
    await db("user_otps").insert({
      user_id: user.id,
      otp_code: otp,
      purpose: "verify_email",
      expired_at: expiredAt,
    });

    // 5. Send OTP (demo)
    console.log(`RESEND OTP for ${email}: ${otp}`);

    return {
      message: "OTP resent successfully",
    };
  }

  // ===============================
  // Helpers
  // ===============================
  private static generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString();
  }
}
