import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  // ===============================
  // POST /users/register
  // ===============================
  static async register(req: Request, res: Response) {
    try {
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
        message: result.message,
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
}
