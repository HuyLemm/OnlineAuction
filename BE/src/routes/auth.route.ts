import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

// ===============================
// User Registration & Verification
// ===============================

router.post("/register", AuthController.register);
router.post("/verify-otp", AuthController.verifyOtp);
router.post("/resend-otp", AuthController.resendOtp);
router.post("/login", AuthController.login);
router.post("/forgot-password", AuthController.forgotPassword);
router.post(
  "/forgot-password/verify-otp",
  AuthController.verifyForgotPasswordOtp
);
router.post("/forgot-password/reset", AuthController.resetForgotPassword);

router.post("/refresh-token", AuthController.refreshToken);

export default router;