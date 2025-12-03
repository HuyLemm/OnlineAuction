import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { OTPInput } from "../components/auth/OTPInput";
import { toast } from "sonner";

interface OTPVerificationPageProps {
  onNavigate?: (page: "login" | "dashboard") => void;
  email?: string;
}

export function OTPVerificationPage({ onNavigate, email = "user@example.com" }: OTPVerificationPageProps) {
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const handleOTPComplete = async (otpValue: string) => {
    setError("");
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      
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

    setError("");

    setTimeout(() => {
      toast.success("New verification code sent to your email");
      
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
        .otp-container {
          position: relative;
          width: 850px;
          height: 550px;
          border: 2px solid #d4a446;
          box-shadow: 0 0 25px rgba(212, 164, 70, 0.3);
          overflow: hidden;
        }

        .form-box-otp {
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

        .form-box-otp .animation {
          transform: translateX(0%);
          transition: 0.7s;
          opacity: 1;
          transition-delay: calc(0.1s * var(--S));
        }

        .info-content-otp {
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

        .info-content-otp .animation {
          transform: translateX(0);
          transition: 0.7s ease;
          transition-delay: calc(0.1s * var(--S));
          opacity: 1;
          filter: blur(0px);
        }

        .curved-shape-otp {
          position: absolute;
          right: 0;
          top: -5px;
          height: 600px;
          width: 850px;
          background: linear-gradient(45deg, #2d2d39, #d4a446);
          transform: rotate(10deg) skewY(40deg);
          transform-origin: bottom right;
          transition: 1.5s ease;
          transition-delay: 1.6s;
        }

        .curved-shape2-otp {
          position: absolute;
          left: 250px;
          top: 100%;
          height: 700px;
          width: 850px;
          background: #2d2d39;
          border-top: 3px solid #d4a446;
          transform: rotate(0deg) skewY(0deg);
          transform-origin: bottom left;
          transition: 1.5s ease;
          transition-delay: 0.5s;
        }
      `}</style>

      <div className="otp-container">
        <div className="curved-shape-otp"></div>
        <div className="curved-shape2-otp"></div>

        {/* Form Panel - Left */}
        <div className="form-box-otp">
          <div className="w-full max-w-md mx-auto">
            <h2 className="animation text-3xl text-center mb-8 flex items-center justify-center gap-2 text-white" style={{ '--S': 21 } as any}>
              <Mail className="h-7 w-7 text-[#d4a446]" />
              Verify Email
            </h2>

            <div className="text-center mb-8 animation" style={{ '--S': 22 } as any}>
              <p className="text-sm text-gray-400 mb-2">
                We've sent a 6-digit code to
              </p>
              <p className="text-[#d4a446]">{email}</p>
            </div>

            <div className="animation" style={{ '--S': 23 } as any}>
              <OTPInput
                length={6}
                onComplete={handleOTPComplete}
                error={error}
              />
            </div>

            {isVerifying && (
              <div className="text-center mt-4 text-sm text-gray-400 animation" style={{ '--S': 24 } as any}>
                Verifying...
              </div>
            )}

            <div className="text-center text-sm mt-8 animation" style={{ '--S': 25 } as any}>
              <p className="text-gray-400 mb-2">Didn't receive the code?</p>
              {resendTimer > 0 ? (
                <p className="text-gray-400">
                  Resend in <span className="text-[#d4a446]">{resendTimer}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResendOTP}
                  className="text-[#d4a446] font-semibold hover:underline"
                >
                  Resend verification code
                </button>
              )}
            </div>

            <div className="mt-8 text-center animation" style={{ '--S': 26 } as any}>
              <button
                onClick={() => onNavigate?.("login")}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#d4a446] transition-colors mx-auto"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </button>
            </div>
          </div>
        </div>

        {/* Info Panel - Right */}
        <div className="info-content-otp">
          <h2 className="animation text-4xl uppercase mb-4 text-white" style={{ '--S': 20 } as any}>
            VERIFY YOUR EMAIL
          </h2>
          <p className="animation text-base text-gray-300" style={{ '--S': 21 } as any}>
            Please enter the verification code sent to your email to complete your registration. The code will expire in 10 minutes.
          </p>
          <div className="mt-8 flex justify-end animation" style={{ '--S': 22 } as any}>
            <Mail className="h-16 w-16 text-[#d4a446]" />
          </div>
        </div>
      </div>
    </div>
  );
}