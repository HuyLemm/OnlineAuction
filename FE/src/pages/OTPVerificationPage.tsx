import { useState } from "react";
import { Mail, CheckCircle, Gavel } from "lucide-react";
import { OTPInput } from "../components/auth/OTPInput";
import { AuthButton } from "../components/auth/AuthButton";
import { ValidationMessage } from "../components/auth/ValidationMessage";
import { Card } from "../components/ui/card";
import { toast } from "sonner";

interface OTPVerificationPageProps {
  onNavigate?: (page: "login" | "dashboard") => void;
  email?: string;
}

export function OTPVerificationPage({ onNavigate, email = "user@example.com" }: OTPVerificationPageProps) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const handleOTPComplete = async (otpValue: string) => {
    setOtp(otpValue);
    setError("");
    setIsVerifying(true);

    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      
      // Mock validation - accept "123456" as valid OTP
      if (otpValue === "123456") {
        toast.success("Email verified successfully!");
        onNavigate?.("dashboard");
      } else {
        setError("Invalid OTP code. Please try again.");
        toast.error("Invalid OTP code");
      }
    }, 1500);
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setIsResending(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      setIsResending(false);
      toast.success("New verification code sent to your email");
      
      // Start 60 second countdown
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
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6 py-12 bg-gradient-to-b from-background to-background/80">
      <Card className="w-full max-w-md p-8 bg-card border-border/50">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fbbf24] to-[#f59e0b]">
              <Mail className="h-8 w-8 text-black" />
            </div>
          </div>
          <h1 className="text-foreground mb-2">Verify Your Email</h1>
          <p className="text-muted-foreground">
            We've sent a 6-digit verification code to
          </p>
          <p className="text-[#fbbf24] mt-1">{email}</p>
        </div>

        {/* Info Message */}
        <div className="mb-8">
          <ValidationMessage
            type="info"
            message="Please enter the verification code to complete your registration. The code will expire in 10 minutes."
          />
        </div>

        {/* OTP Input */}
        <div className="mb-8">
          <OTPInput
            length={6}
            onComplete={handleOTPComplete}
            error={error}
          />
        </div>

        {/* Verify Button */}
        <AuthButton
          onClick={() => otp.length === 6 && handleOTPComplete(otp)}
          isLoading={isVerifying}
          disabled={otp.length !== 6}
        >
          <span className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Verify Email
          </span>
        </AuthButton>

        {/* Resend Code */}
        <div className="mt-6 text-center">
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
              disabled={isResending}
              className="text-sm text-[#fbbf24] hover:text-[#f59e0b] transition-colors disabled:opacity-50"
            >
              {isResending ? "Sending..." : "Resend verification code"}
            </button>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-8 p-4 rounded-lg bg-secondary/30 border border-border/50">
          <p className="text-sm text-muted-foreground text-center">
            Having trouble? Check your spam folder or{" "}
            <a href="#" className="text-[#fbbf24] hover:text-[#f59e0b]">
              contact support
            </a>
          </p>
        </div>

        {/* Back to Login */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          <button
            onClick={() => onNavigate?.("login")}
            className="text-[#fbbf24] hover:text-[#f59e0b] transition-colors"
          >
            Back to Login
          </button>
        </p>
      </Card>
    </div>
  );
}
