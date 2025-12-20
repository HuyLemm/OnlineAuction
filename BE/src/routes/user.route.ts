import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const router = Router();

// ===============================
// User Registration & Verification
// ===============================

router.post("/register", UserController.register);
router.post("/verify-otp", UserController.verifyOtp);
router.post("/resend-otp", UserController.resendOtp);
router.post("/login", UserController.login);
router.post("/refresh-token", UserController.refreshToken);

export default router;
