import { useState, type FormEvent } from "react";
import { KeyRound, Mail, Lock, ArrowLeft } from "lucide-react";
import { OTPInput } from "../components/auth/OTPInput";
import { toast } from "sonner";

interface ForgotPasswordPageProps {
  onNavigate?: (page: "login") => void;
}

type Step = "email" | "otp" | "new-password";

export function ForgotPasswordPage({ onNavigate }: ForgotPasswordPageProps) {
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    setIsLoading(true);
    setErrors({});

    setTimeout(() => {
      setIsLoading(false);
      toast.success("Verification code sent to your email");
      setCurrentStep("otp");
      
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
    }, 1500);
  };

  const handleOTPComplete = async (otpValue: string) => {
    setOtp(otpValue);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      
      if (otpValue === "123456") {
        toast.success("Code verified successfully");
        setCurrentStep("new-password");
      } else {
        setErrors({ otp: "Invalid verification code" });
        toast.error("Invalid verification code");
      }
    }, 1500);
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};

    if (!newPassword) {
      newErrors.password = "Password is required";
    } else if (newPassword.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    setTimeout(() => {
      setIsLoading(false);
      toast.success("Password reset successfully!");
      onNavigate?.("login");
    }, 1500);
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast.success("New verification code sent");
      
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
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6 py-12 bg-[#1a1a1a]">
      <style>{`
        .forgot-container {
          position: relative;
          width: 850px;
          height: 600px;
          border: 2px solid #d4a446;
          box-shadow: 0 0 25px rgba(212, 164, 70, 0.3);
          overflow: hidden;
        }

        .form-box-forgot {
          position: absolute;
          top: 0;
          width: 50%;
          height: 100%;
          display: flex;
          justify-content: center;
          flex-direction: column;
          left: 0;
          padding: 0 40px;
        }

        .form-box-forgot .animation {
          transform: translateX(0%);
          transition: 0.7s;
          opacity: 1;
          transition-delay: calc(0.1s * var(--S));
        }

        .info-content-forgot {
          position: absolute;
          top: 0;
          height: 100%;
          width: 50%;
          display: flex;
          justify-content: center;
          flex-direction: column;
          right: 0;
          text-align: right;
          padding: 0 40px 60px 150px;
        }

        .info-content-forgot .animation {
          transform: translateX(0);
          transition: 0.7s ease;
          transition-delay: calc(0.1s * var(--S));
          opacity: 1;
          filter: blur(0px);
        }

        .curved-shape-forgot {
          position: absolute;
          right: 0;
          top: -5px;
          height: 700px;
          width: 850px;
          background: linear-gradient(45deg, #2d2d39, #d4a446);
          transform: rotate(10deg) skewY(40deg);
          transform-origin: bottom right;
          transition: 1.5s ease;
          transition-delay: 1.6s;
        }

        .curved-shape2-forgot {
          position: absolute;
          left: 250px;
          top: 100%;
          height: 800px;
          width: 850px;
          background: #2d2d39;
          border-top: 3px solid #d4a446;
          transform: rotate(0deg) skewY(0deg);
          transform-origin: bottom left;
          transition: 1.5s ease;
          transition-delay: 0.5s;
        }

        .floating-input {
          position: relative;
          width: 100%;
          height: 50px;
          margin-top: 25px;
        }

        .floating-input input {
          width: 100%;
          height: 100%;
          background: transparent;
          border: none;
          outline: none;
          font-size: 16px;
          color: #fff;
          font-weight: 500;
          border-bottom: 2px solid rgba(255, 255, 255, 0.3);
          padding-right: 30px;
          transition: 0.5s;
        }

        .floating-input input:focus,
        .floating-input input:valid {
          border-bottom: 2px solid #d4a446;
        }

        .floating-input label {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          font-size: 16px;
          color: rgba(255, 255, 255, 0.7);
          pointer-events: none;
          transition: 0.5s;
        }

        .floating-input input:focus ~ label,
        .floating-input input:valid ~ label {
          top: -5px;
          color: #d4a446;
          font-size: 13px;
        }

        .floating-input .icon {
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.4);
          transition: 0.5s;
        }

        .floating-input input:focus ~ .icon,
        .floating-input input:valid ~ .icon {
          color: #d4a446;
        }

        .gradient-btn {
          position: relative;
          width: 100%;
          height: 45px;
          background: transparent;
          border-radius: 40px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          border: 2px solid #d4a446;
          overflow: hidden;
          z-index: 1;
          color: #fff;
        }

        .gradient-btn::before {
          content: "";
          position: absolute;
          height: 300%;
          width: 100%;
          background: linear-gradient(#2d2d39, #d4a446, #2d2d39, #d4a446);
          top: -100%;
          left: 0;
          z-index: -1;
          transition: 0.5s;
        }

        .gradient-btn:hover::before {
          top: 0;
        }

        .gradient-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .step-content {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>

      <div className="forgot-container">
        <div className="curved-shape-forgot"></div>
        <div className="curved-shape2-forgot"></div>

        {/* Form Panel - Left */}
        <div className="form-box-forgot">
          <div className="w-full max-w-sm mx-auto">
            <h2 className="animation text-3xl text-center mb-6 flex items-center justify-center gap-2 text-white" style={{ '--S': 21 } as any}>
              <KeyRound className="h-7 w-7 text-[#d4a446]" />
              {currentStep === "email" && "Forgot Password"}
              {currentStep === "otp" && "Verify Email"}
              {currentStep === "new-password" && "New Password"}
            </h2>

            {/* Step 1: Email Input */}
            {currentStep === "email" && (
              <form onSubmit={handleEmailSubmit} className="step-content">
                <div className="text-center mb-6 animation" style={{ '--S': 22 } as any}>
                  <p className="text-sm text-gray-400">
                    Enter your email to receive a verification code
                  </p>
                </div>

                <div className="floating-input animation" style={{ '--S': 23 } as any}>
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
                  <Mail className="icon h-5 w-5" />
                </div>

                {errors.email && (
                  <div className="text-xs text-red-400 text-center mt-2 animation" style={{ '--S': 24 } as any}>
                    {errors.email}
                  </div>
                )}

                <div className="floating-input animation" style={{ '--S': 25 } as any}>
                  <button className="gradient-btn" type="submit" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Code"}
                  </button>
                </div>

                <div className="mt-6 text-center animation" style={{ '--S': 26 } as any}>
                  <button
                    type="button"
                    onClick={() => onNavigate?.("login")}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#d4a446] transition-colors mx-auto"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {currentStep === "otp" && (
              <div className="step-content">
                <div className="text-center mb-6 animation" style={{ '--S': 22 } as any}>
                  <p className="text-sm text-gray-400">
                    Enter the 6-digit code sent to
                  </p>
                  <p className="text-[#d4a446] text-sm mt-1">{email}</p>
                </div>

                <div className="animation" style={{ '--S': 23 } as any}>
                  <OTPInput
                    length={6}
                    onComplete={handleOTPComplete}
                    error={errors.otp}
                  />
                </div>

                <div className="text-center text-sm mt-6 animation" style={{ '--S': 24 } as any}>
                  <p className="text-gray-400 mb-2">Didn't receive the code?</p>
                  {resendTimer > 0 ? (
                    <p className="text-gray-400">
                      Resend in <span className="text-[#d4a446]">{resendTimer}s</span>
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

                <div className="mt-6 text-center animation" style={{ '--S': 25 } as any}>
                  <button
                    onClick={() => onNavigate?.("login")}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#d4a446] transition-colors mx-auto"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: New Password */}
            {currentStep === "new-password" && (
              <form onSubmit={handlePasswordSubmit} className="step-content">
                <div className="text-center mb-6 animation" style={{ '--S': 22 } as any}>
                  <p className="text-sm text-green-400">
                    ✓ Email verified! Create a new password
                  </p>
                </div>

                <div className="floating-input animation" style={{ '--S': 23 } as any}>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setErrors({});
                    }}
                  />
                  <label>New Password</label>
                  <Lock className="icon h-5 w-5" />
                </div>

                <div className="floating-input animation" style={{ '--S': 24 } as any}>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors({});
                    }}
                  />
                  <label>Confirm New Password</label>
                  <Lock className="icon h-5 w-5" />
                </div>

                {(errors.password || errors.confirmPassword) && (
                  <div className="text-xs text-red-400 text-center mt-2 animation" style={{ '--S': 25 } as any}>
                    {errors.password || errors.confirmPassword}
                  </div>
                )}

                <div className="floating-input animation" style={{ '--S': 26 } as any}>
                  <button className="gradient-btn" type="submit" disabled={isLoading}>
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </button>
                </div>

                <div className="mt-6 text-center animation" style={{ '--S': 27 } as any}>
                  <button
                    type="button"
                    onClick={() => onNavigate?.("login")}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#d4a446] transition-colors mx-auto"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Info Panel - Right */}
        <div className="info-content-forgot">
          <h2 className="animation text-4xl uppercase mb-4 text-white" style={{ '--S': 20 } as any}>
            RESET PASSWORD
          </h2>
          <p className="animation text-base text-gray-300" style={{ '--S': 21 } as any}>
            {currentStep === "email" && "Don't worry! Enter your email and we'll send you a code to reset your password."}
            {currentStep === "otp" && "We've sent a verification code to your email. Please check your inbox."}
            {currentStep === "new-password" && "Almost done! Choose a strong password to secure your account."}
          </p>
          <div className="mt-8 flex justify-end animation" style={{ '--S': 22 } as any}>
            <KeyRound className="h-16 w-16 text-[#d4a446]" />
          </div>
        </div>
      </div>
    </div>
  );
}