import { Request, Response } from "express";
import { verifyRecaptcha } from "../utils/reCaptcha";
import { verifyRefreshToken, signAccessToken } from "../utils/jwt";
import { AuthService } from "../services/auth.service";

export class AuthController {
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

      const user = await AuthService.login(email, password);

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
      const result = await AuthService.register(req.body);

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

      const result = await AuthService.verifyOtp({
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

      const result = await AuthService.resendOtp(email);

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
  // POST /users/forgot-password
  // ===============================
  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      const result = await AuthService.requestForgotPassword(email);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to request password reset",
      });
    }
  }

  // ===============================
  // POST /users/forgot-password/verify-otp
  // ===============================
  static async verifyForgotPasswordOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message: "Email and OTP are required",
        });
      }

      const result = await AuthService.verifyForgotPasswordOtp(email, otp);

      return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
        userId: result.userId, // FE giữ lại để reset password
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "OTP verification failed",
      });
    }
  }

  // ===============================
  // POST /users/forgot-password/reset
  // ===============================
  static async resetForgotPassword(req: Request, res: Response) {
    try {
      const { userId, newPassword } = req.body;

      if (!userId || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "userId and newPassword are required",
        });
      }

      const result = await AuthService.resetPassword(userId, newPassword);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to reset password",
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

      const result = await AuthService.refreshAccessToken(refreshToken);

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
