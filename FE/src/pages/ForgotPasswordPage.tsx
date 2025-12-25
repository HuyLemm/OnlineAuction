import { useState, type FormEvent } from "react";
import { KeyRound, Mail, Lock, ArrowLeft } from "lucide-react";
import { OTPInput } from "../components/auth/OTPInput";
import { toast } from "sonner";
import styles from "../styles/ForgotPassword.module.css";
import { useNavigate } from "react-router-dom";
import {
  FORGOT_PASSWORD_API,
  RESET_FORGOT_PASSWORD_API,
  VERIFY_FORGOT_PASSWORD_OTP_API,
} from "../components/utils/api";

type Step = "email" | "otp" | "new-password";

export function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  /* ===============================
   * STEP 1: SEND EMAIL
   * =============================== */
  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const res = await fetch(FORGOT_PASSWORD_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      toast.success("Verification code sent to your email");
      setCurrentStep("otp");

      // resend timer
      setResendTimer(60);
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  /* ===============================
   * STEP 2: VERIFY OTP
   * =============================== */
  const handleOTPComplete = async (otpValue: string) => {
    setOtp(otpValue);
    setIsLoading(true);

    try {
      const res = await fetch(VERIFY_FORGOT_PASSWORD_OTP_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      toast.success("OTP verified successfully");
      setUserId(json.userId);
      setCurrentStep("new-password");
    } catch (err: any) {
      toast.error(err.message || "Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  /* ===============================
   * STEP 3: RESET PASSWORD
   * =============================== */
  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 8) {
      setErrors({ password: "Password must be at least 8 characters" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    if (!userId) {
      toast.error("Invalid session");
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const res = await fetch(RESET_FORGOT_PASSWORD_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          newPassword,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  /* ===============================
   * RESEND OTP
   * =============================== */
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    handleEmailSubmit({ preventDefault() {} } as any);
  };

  return (
    <div className={styles.forgotPageWrapper}>
      <div className={styles.forgotContainer}>
        <div className={styles.curvedShapeForgot} />
        <div className={styles.curvedShape2Forgot} />

        {/* LEFT */}
        <div className={styles.formBoxForgot}>
          <div className="w-full max-w-sm mx-auto">
            <h2
              className={`${styles.animation} text-3xl text-center mb-6 flex items-center justify-center gap-2 text-white`}
              style={{ "--S": 21 } as any}
            >
              <KeyRound className="h-7 w-7 text-[#d4a446]" />
              {currentStep === "email" && "Forgot Password"}
              {currentStep === "otp" && "Verify Email"}
              {currentStep === "new-password" && "New Password"}
            </h2>

            {/* EMAIL */}
            {currentStep === "email" && (
              <form onSubmit={handleEmailSubmit} className={styles.stepContent}>
                <div
                  className={`${styles.animation} text-center mb-6`}
                  style={{ "--S": 22 } as any}
                >
                  <p className="text-sm text-gray-400">
                    Enter your email to receive a verification code
                  </p>
                </div>

                <div
                  className={`${styles.floatingInput} ${styles.animation}`}
                  style={{ "--S": 23 } as any}
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors({});
                    }}
                  />
                  <label>Email Address</label>
                  <Mail className={`${styles.icon} h-5 w-5`} />
                </div>

                {errors.email && (
                  <div
                    className={`${styles.animation} text-xs text-red-400 text-center mt-2`}
                    style={{ "--S": 24 } as any}
                  >
                    {errors.email}
                  </div>
                )}

                <div
                  className={`${styles.floatingInput} ${styles.animation}`}
                  style={{ "--S": 25 } as any}
                >
                  <button
                    className={styles.gradientBtn}
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Code"}
                  </button>
                </div>

                <div
                  className={`${styles.animation} mt-6 text-center`}
                  style={{ "--S": 26 } as any}
                >
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#d4a446] mx-auto"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </button>
                </div>
              </form>
            )}

            {/* OTP */}
            {currentStep === "otp" && (
              <div className={styles.stepContent}>
                <div
                  className={`${styles.animation} text-center mb-6`}
                  style={{ "--S": 22 } as any}
                >
                  <p className="text-sm text-gray-400">
                    Enter the 6-digit code sent to
                  </p>
                  <p className="text-[#d4a446] text-sm mt-1">{email}</p>
                </div>

                <div className={styles.animation} style={{ "--S": 23 } as any}>
                  <OTPInput
                    length={6}
                    onComplete={handleOTPComplete}
                    error={errors.otp}
                  />
                </div>

                <div
                  className={`${styles.animation} text-center text-sm mt-6`}
                  style={{ "--S": 24 } as any}
                >
                  {resendTimer > 0 ? (
                    <p className="text-gray-400">
                      Resend in{" "}
                      <span className="text-[#d4a446]">{resendTimer}s</span>
                    </p>
                  ) : (
                    <button
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="text-[#d4a446] font-semibold hover:underline"
                    >
                      Resend Code
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* NEW PASSWORD */}
            {currentStep === "new-password" && (
              <form
                onSubmit={handlePasswordSubmit}
                className={styles.stepContent}
              >
                <div
                  className={`${styles.animation} text-center mb-6`}
                  style={{ "--S": 22 } as any}
                >
                  <p className="text-sm text-green-400">
                    ✓ Email verified! Create a new password
                  </p>
                </div>

                <div
                  className={`${styles.floatingInput} ${styles.animation}`}
                  style={{ "--S": 23 } as any}
                >
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <label>New Password</label>
                  <Lock className={`${styles.icon} h-5 w-5`} />
                </div>

                <div
                  className={`${styles.floatingInput} ${styles.animation}`}
                  style={{ "--S": 24 } as any}
                >
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <label>Confirm New Password</label>
                  <Lock className={`${styles.icon} h-5 w-5`} />
                </div>

                {(errors.password || errors.confirmPassword) && (
                  <div
                    className={`${styles.animation} text-xs text-red-400 text-center mt-2`}
                    style={{ "--S": 25 } as any}
                  >
                    {errors.password || errors.confirmPassword}
                  </div>
                )}

                <div
                  className={`${styles.floatingInput} ${styles.animation}`}
                  style={{ "--S": 26 } as any}
                >
                  <button
                    className={styles.gradientBtn}
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className={styles.infoContentForgot}>
          <h2
            className={`${styles.animation} text-4xl uppercase mb-4 text-white`}
            style={{ "--S": 20 } as any}
          >
            RESET PASSWORD
          </h2>

          <p
            className={`${styles.animation} text-base text-gray-300`}
            style={{ "--S": 21 } as any}
          >
            {currentStep === "email" &&
              "Don't worry! Enter your email and we'll send you a code."}
            {currentStep === "otp" &&
              "We've sent a verification code to your email."}
            {currentStep === "new-password" &&
              "Almost done! Choose a strong password."}
          </p>

          <div
            className={`${styles.animation} mt-8 flex justify-end`}
            style={{ "--S": 22 } as any}
          >
            <KeyRound className="h-16 w-16 text-[#d4a446]" />
          </div>
        </div>
      </div>
    </div>
  );
}
