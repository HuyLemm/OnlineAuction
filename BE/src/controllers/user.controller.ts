import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { verifyRecaptcha } from "../utils/reCaptcha";
import { verifyRefreshToken, signAccessToken } from "../utils/jwt";

export class UserController {
  // ===============================
  // POST /users/login
  // ===============================
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const user = await UserService.login(email, password);

      return res.status(200).json({
        success: true,
        message: "Login successfully!",
        user,
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message || "Login failed",
      });
    }
  }

  // ===============================
  // POST /users/register
  // ===============================
  static async register(req: Request, res: Response) {
    try {
      const { recaptchaToken } = req.body;

      // 1️⃣ Check reCAPTCHA token tồn tại
      if (!recaptchaToken) {
        return res.status(400).json({
          success: false,
          message: "Missing reCAPTCHA token",
        });
      }

      // 2️⃣ Verify với Google
      const recaptchaResult = await verifyRecaptcha(recaptchaToken);
      console.log("recaptcha result:", recaptchaResult);

      if (!recaptchaResult.success) {
        return res.status(403).json({
          success: false,
          message: "reCAPTCHA verification failed",
        });
      }

      // 3️⃣ reCAPTCHA OK → tiếp tục register
      const result = await UserService.register(req.body);

      return res.status(201).json({
        success: true,
        message: result.message,
        email: result.email,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Registration failed",
      });
    }
  }

  // ===============================
  // POST /users/verify-otp
  // ===============================
  static async verifyOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: "Email and OTP are required",
        });
      }

      const result = await UserService.verifyOtp({
        email,
        otp,
        purpose: "verify_email",
      });

      return res.status(200).json({
        success: true,
        message: "OTP verified & logged in",
        ...result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "OTP verification failed",
      });
    }
  }

  // ===============================
  // POST /users/resend-otp
  // ===============================
  static async resendOtp(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      const result = await UserService.resendOtp(email);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Resend OTP failed",
      });
    }
  }

  // ===============================
  // POST /users/refresh-token
  // ===============================
  static async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: "Missing refresh token",
        });
      }

      const result = await UserService.refreshAccessToken(refreshToken);

      return res.status(200).json({
        success: true,
        accessToken: result.accessToken,
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message || "Invalid refresh token",
      });
    }
  }
}
