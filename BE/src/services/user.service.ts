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
  private static baseQuery() {
    return db("products as p")
      .leftJoin("product_images as pi", function () {
        this.on("pi.product_id", "=", "p.id").andOn(
          "pi.is_main",
          "=",
          db.raw("true")
        );
      })
      .leftJoin("categories as c", "c.id", "p.category_id")
      .leftJoin("users as u", "u.id", "p.highest_bidder_id")
      .leftJoin("bids as b", "b.product_id", "p.id")
      .select(
        "p.id",
        "p.title",
        "p.auction_type as auctionType",
        "p.highest_bidder_id as highestBidderId",
        "u.full_name as highestBidderName",
        "p.buy_now_price as buyNowPrice",
        "p.created_at as postedDate",
        "p.description",
        "p.end_time",
        "p.category_id as categoryId",
        "c.name as category",

        db.raw(`COALESCE(p.current_price, p.start_price)::int AS "currentBid"`),
        db.raw(`COALESCE(pi.image_url, '') AS "image"`),
        db.raw("COUNT(b.id) AS bids")
      )
      .where("p.status", "active")
      .groupBy("p.id", "pi.image_url", "c.name", "u.full_name");
  }

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
  // Watchlist - Get all
  // ===============================
  // ===============================
  // Watchlist - Get all (reuse baseQuery)
  // ===============================
  static async getWatchlist(userId: string) {
    const rows = await this.baseQuery()
      .join("watchlists as w", "w.product_id", "p.id")
      .where("w.user_id", userId)
      .select(db.raw("MAX(w.created_at) as watchlisted_at"))
      .groupBy("p.id", "pi.image_url", "c.name", "u.full_name")
      .orderBy("watchlisted_at", "desc");

    const TEN_YEARS_MS = 10 * 365 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    return rows.map((p) => {
      const endTime = new Date(p.end_time).getTime();
      const timeLeft = endTime - now;

      return {
        id: p.id,
        title: p.title,
        category: p.category,
        categoryId: p.categoryId,
        image: p.image,
        description: p.description,
        postedDate: p.postedDate,
        end_time: p.end_time,

        auctionType: p.auctionType,
        buyNowPrice: p.buyNowPrice,

        currentBid: p.currentBid,
        bids: Number(p.bids),

        highestBidderId: p.highestBidderId,
        highestBidderName: p.highestBidderName,

        // ✅ LOGIC MỚI
        isHot: Number(p.currentBid) > 4000,
        endingSoon: timeLeft > 0 && timeLeft < TEN_YEARS_MS,
      };
    });
  }

  // ===============================
  // Watchlist - Add
  // ===============================
  static async addToWatchlist(userId: string, productId: string) {
    await db("watchlists")
      .where({ user_id: userId, product_id: productId })
      .del();

    try {
      await db("watchlists").insert({
        user_id: userId,
        product_id: productId,
        created_at: new Date(),
      });
    } catch (err: any) {
      // PostgreSQL unique_violation
      if (err.code === "23505") {
        return;
      }
      throw err;
    }
  }

  // ===============================
  // Watchlist - Remove
  // ===============================
  static async removeFromWatchlist(userId: string, productId: string) {
    await db("watchlists")
      .where({
        user_id: userId,
        product_id: productId,
      })
      .del();
  }

  // ===============================
  // Watchlist - Get product ids only
  // ===============================
  static async getWatchlistProductIds(userId: string): Promise<string[]> {
    const rows = await db("watchlists")
      .select("product_id")
      .where({ user_id: userId });

    return rows.map((r) => r.product_id);
  }

  static async removeManyFromWatchlist(userId: string, productIds: string[]) {
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return { deleted: 0 };
    }

    const deletedCount = await db("watchlists")
      .where("user_id", userId)
      .whereIn("product_id", productIds)
      .del();

    return {
      deleted: deletedCount,
    };
  }

  // ===============================
  // Profile - Get
  // ===============================
  static async getProfile(userId: string) {
    const user = await db("users")
      .select(
        "id",
        "email",
        "full_name",
        "dob",
        "address",
        "role",
        "created_at"
      )
      .where({ id: userId })
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  // ===============================
  // Profile - Update
  // ===============================
  static async updateProfile(
    userId: string,
    payload: {
      email?: string;
      fullName?: string;
      dob?: string;
      address?: string;
    }
  ) {
    const updateData: any = {};

    if (payload.email) updateData.email = payload.email;
    if (payload.fullName) updateData.full_name = payload.fullName;
    if (payload.dob) updateData.dob = payload.dob;
    if (payload.address) updateData.address = payload.address;

    if (Object.keys(updateData).length === 0) {
      throw new Error("No data to update");
    }

    await db("users").where({ id: userId }).update(updateData);

    return this.getProfile(userId);
  }

  // ===============================
  // Profile - Change Password
  // ===============================
  static async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ) {
    const user = await db("users")
      .select("password_hash")
      .where({ id: userId })
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) {
      throw new Error("Current password is incorrect");
    }

    const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await db("users").where({ id: userId }).update({ password_hash: newHash });

    return { success: true };
  }

  // ===============================
  // Helpers
  // ===============================
  private static generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString();
  }
}
