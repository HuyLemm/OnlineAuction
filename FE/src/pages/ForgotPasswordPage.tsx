import { useState, type FormEvent } from "react";
import { KeyRound, Mail, Gavel, ArrowLeft, CheckCircle } from "lucide-react";
import { AuthInput } from "../components/auth/AuthInput";
import { AuthButton } from "../components/auth/AuthButton";
import { ValidationMessage } from "../components/auth/ValidationMessage";
import { OTPInput } from "../components/auth/OTPInput";
import { Card } from "../components/ui/card";
import { toast } from "sonner";

interface ForgotPasswordPageProps {
  onNavigate?: (page: "login" | "reset-password") => void;
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

  // Step 1: Email Submission
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

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Verification code sent to your email");
      setCurrentStep("otp");
      
      // Start countdown
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

  // Step 2: OTP Verification
  const handleOTPComplete = async (otpValue: string) => {
    setOtp(otpValue);
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Mock validation - accept "123456" as valid
      if (otpValue === "123456") {
        toast.success("Code verified successfully");
        setCurrentStep("new-password");
      } else {
        setErrors({ otp: "Invalid verification code" });
        toast.error("Invalid verification code");
      }
    }, 1500);
  };

  // Step 3: New Password Submission
  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};

    if (!newPassword) {
      newErrors.password = "Password is required";
    } else if (newPassword.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      newErrors.password = "Password must contain uppercase, lowercase, and numbers";
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

    // Simulate API call
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

  const getPasswordStrength = () => {
    const password = newPassword;
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength: 33, label: "Weak", color: "bg-red-500" };
    if (strength <= 3) return { strength: 66, label: "Medium", color: "bg-[#f59e0b]" };
    return { strength: 100, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6 py-12 bg-gradient-to-b from-background to-background/80">
      <Card className="w-full max-w-md p-8 bg-card border-border/50">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fbbf24] to-[#f59e0b]">
              <KeyRound className="h-8 w-8 text-black" />
            </div>
          </div>
          <h1 className="text-foreground mb-2">
            {currentStep === "email" && "Forgot Password?"}
            {currentStep === "otp" && "Verify Your Email"}
            {currentStep === "new-password" && "Create New Password"}
          </h1>
          <p className="text-muted-foreground">
            {currentStep === "email" && "Enter your email to receive a verification code"}
            {currentStep === "otp" && `Code sent to ${email}`}
            {currentStep === "new-password" && "Enter your new password"}
          </p>
        </div>

        {/* Step 1: Email Input */}
        {currentStep === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <ValidationMessage
              type="info"
              message="We'll send a verification code to your email address to reset your password."
            />

            <AuthInput
              label="Email Address"
              type="email"
              icon="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({});
              }}
              error={errors.email}
            />

            <AuthButton type="submit" isLoading={isLoading}>
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Send Verification Code
              </span>
            </AuthButton>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {currentStep === "otp" && (
          <div className="space-y-6">
            <ValidationMessage
              type="info"
              message="Enter the 6-digit verification code sent to your email."
            />

            <OTPInput
              length={6}
              onComplete={handleOTPComplete}
              error={errors.otp}
            />

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Didn't receive the code?
              </p>
              {resendTimer > 0 ? (
                <p className="text-sm text-muted-foreground">
                  Resend code in <span className="text-[#fbbf24]">{resendTimer}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  className="text-sm text-[#fbbf24] hover:text-[#f59e0b] transition-colors disabled:opacity-50"
                >
                  Resend verification code
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 3: New Password */}
        {currentStep === "new-password" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <ValidationMessage
              type="success"
              message="Email verified! Please create a new password for your account."
            />

            <div>
              <AuthInput
                label="New Password"
                type="password"
                icon="password"
                placeholder="Create a strong password"
                showPasswordToggle
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setErrors({});
                }}
                error={errors.password}
              />
              {newPassword && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Password strength</span>
                    <span className={`text-xs ${
                      passwordStrength.label === "Weak" ? "text-red-500" :
                      passwordStrength.label === "Medium" ? "text-[#f59e0b]" :
                      "text-green-500"
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <AuthInput
              label="Confirm New Password"
              type="password"
              icon="password"
              placeholder="Re-enter your password"
              showPasswordToggle
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors({});
              }}
              error={errors.confirmPassword}
            />

            <AuthButton type="submit" isLoading={isLoading}>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Reset Password
              </span>
            </AuthButton>
          </form>
        )}

        {/* Back to Login */}
        <div className="mt-8 pt-6 border-t border-border/50">
          <button
            onClick={() => onNavigate?.("login")}
            className="flex items-center gap-2 text-sm text-[#fbbf24] hover:text-[#f59e0b] transition-colors mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </button>
        </div>
      </Card>
    </div>
  );
}
