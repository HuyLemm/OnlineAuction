import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { OTPInput } from "../components/auth/OTPInput";
import { toast } from "sonner";
import "../styles/verify-auth.css";
import { VERIFY_OTP_API, RESEND_OTP_API } from "../components/utils/api";

export function OTPVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const email: string | undefined = location.state?.email;

  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (!email) {
      toast.error("Missing email for verification");
      navigate("/login");
    }
  }, [email, navigate]);

  // ================= VERIFY OTP =================
  const handleOTPComplete = async (otpValue: string) => {
    if (!email) return;

    setError("");
    setIsVerifying(true);

    try {
      const res = await fetch(VERIFY_OTP_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: otpValue,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      toast.success("Email verified successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  // ================= RESEND OTP =================
  const handleResendOTP = async () => {
    if (!email || resendTimer > 0) return;

    setError("");

    try {
      const res = await fetch(RESEND_OTP_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      toast.success("New verification code sent to your email");

      // Start countdown (60s)
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
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6 py-12 bg-[#1a1a1a]">
      <div className="otp-container">
        <div className="curved-shape-otp"></div>
        <div className="curved-shape2-otp"></div>

        {/* Form Panel - Left */}
        <div className="form-box-otp">
          <div className="w-full max-w-md mx-auto">
            <h2
              className="animation text-3xl text-center mb-8 flex items-center justify-center gap-2 text-white"
              style={{ "--S": 21 } as any}
            >
              <Mail className="h-7 w-7 text-[#d4a446]" />
              Verify Email
            </h2>

            <div
              className="text-center mb-8 animation"
              style={{ "--S": 22 } as any}
            >
              <p className="text-sm text-gray-400 mb-2">
                We've sent a 6-digit code to
              </p>
              <p className="text-[#d4a446]">{email}</p>
            </div>

            <div className="animation" style={{ "--S": 23 } as any}>
              <OTPInput
                length={6}
                onComplete={handleOTPComplete}
                error={error}
              />
            </div>

            {isVerifying && (
              <div
                className="text-center mt-4 text-sm text-gray-400 animation"
                style={{ "--S": 24 } as any}
              >
                Verifying...
              </div>
            )}

            <div
              className="text-center text-sm mt-8 animation"
              style={{ "--S": 25 } as any}
            >
              <p className="text-gray-400 mb-2">Didn't receive the code?</p>
              {resendTimer > 0 ? (
                <p className="text-gray-400">
                  Resend in{" "}
                  <span className="text-[#d4a446]">{resendTimer}s</span>
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

            <div
              className="mt-8 text-center animation"
              style={{ "--S": 26 } as any}
            >
              <button
                onClick={() => navigate("/login")}
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
          <h2
            className="animation text-4xl uppercase mb-4 text-white"
            style={{ "--S": 20 } as any}
          >
            VERIFY YOUR EMAIL
          </h2>
          <p
            className="animation text-base text-gray-300"
            style={{ "--S": 21 } as any}
          >
            Please enter the verification code sent to your email to complete
            your registration. The code will expire in 2 minutes.
          </p>
          <div
            className="mt-8 flex justify-end animation"
            style={{ "--S": 22 } as any}
          >
            <Mail className="h-16 w-16 text-[#d4a446]" />
          </div>
        </div>
      </div>
    </div>
  );
}
