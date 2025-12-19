import ReCAPTCHA from "react-google-recaptcha";
import { useState, type FormEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";
import "../styles/login-auth.css";
import {
  validateLogin,
  validateRegister,
} from "../components/utils/authValidation";
import { RecaptchaBox } from "../components/auth/RecaptchaBox";

import { REGISTER_API, LOGIN_API } from "../components/utils/api";

export function LoginPage() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Register form state
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // ================= LOGIN =================
  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const errorMessage = validateLogin(loginData);

    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    setIsLoginLoading(true);

    try {
      const res = await fetch(LOGIN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      toast.success(data.message);
      navigate("/");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoginLoading(false);
    }
  };

  // ================= REGISTER =================
  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const errorMessage = validateRegister(registerData);

    if (!recaptchaToken) {
      toast.error("Please verify that you are not a robot");
      return;
    }

    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    setIsRegisterLoading(true);

    try {
      const res = await fetch(REGISTER_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: registerData.fullName,
          email: registerData.email,
          password: registerData.password,
          address: registerData.address,
          recaptchaToken,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success(data.message);
      navigate("/verify-otp", {
        state: { email: registerData.email },
      });
    } catch (err: any) {
      toast.error(err.message);
      setRecaptchaToken(null);
      recaptchaRef.current?.reset();
    } finally {
      setIsRegisterLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className={`auth-container ${isActive ? "active" : ""}`}>
        <div className="curved-shape"></div>
        <div className="curved-shape2"></div>

        {/* Login Form */}
        <div className="form-box login-form">
          <h2
            className="animation text-3xl text-center mb-6 text-white"
            style={{ "--D": 0, "--S": 21 } as any}
          >
            Login
          </h2>
          <form onSubmit={handleLoginSubmit}>
            <div
              className="floating-input animation"
              style={{ "--D": 1, "--S": 22 } as any}
            >
              <input
                type="email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
              />
              <label>Email</label>
              <User className="icon h-5 w-5" />
              {loginErrors.email && (
                <p className="text-red-500 text-xs mt-1">{loginErrors.email}</p>
              )}
            </div>

            <div
              className="floating-input animation"
              style={{ "--D": 2, "--S": 23 } as any}
            >
              <input
                type="password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
              />
              <label>Password</label>
              <Lock className="icon h-5 w-5" />
              {loginErrors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {loginErrors.password}
                </p>
              )}
            </div>

            <div
              className="floating-input animation"
              style={{ "--D": 3, "--S": 24 } as any}
            >
              <button
                className="gradient-btn"
                type="submit"
                disabled={isLoginLoading}
              >
                {isLoginLoading ? "Loading..." : "Login"}
              </button>
            </div>

            <div
              className="regi-link animation text-center text-sm mt-5"
              style={{ "--D": 4, "--S": 25 } as any}
            >
              <p className="text-gray-400 mb-2">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsActive(true)}
                  className="text-[#d4a446] font-semibold hover:underline"
                >
                  Sign Up
                </button>
              </p>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-[#d4a446] text-xm hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </div>

        {/* Login Info */}
        <div className="info-content login-info">
          <h2
            className="animation text-4xl uppercase mb-4 text-white"
            style={{ "--D": 0, "--S": 20 } as any}
          >
            WELCOME BACK!
          </h2>
          <p
            className="animation text-lg text-gray-300"
            style={{ "--D": 1, "--S": 21 } as any}
          >
            We are happy to have you back in your LuxeAuction account. Login and
            start bidding on exclusive items.
          </p>
        </div>

        {/* Register Form */}
        <div className="form-box register-form">
          <h2
            className="animation text-4xl text-center mb-8 text-white"
            style={{ "--li": 17, "--S": 0 } as any}
          >
            Register
          </h2>
          <form onSubmit={handleRegisterSubmit}>
            <div
              className="floating-input animation"
              style={{ "--li": 18, "--S": 1 } as any}
            >
              <input
                type="text"
                value={registerData.fullName}
                onChange={(e) =>
                  setRegisterData({ ...registerData, fullName: e.target.value })
                }
              />
              <label>Full Name</label>
              <User className="icon h-5 w-5" />
            </div>

            <div
              className="floating-input animation"
              style={{ "--li": 19, "--S": 2 } as any}
            >
              <input
                type="email"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
              />
              <label>Email</label>
              <Mail className="icon h-5 w-5" />
            </div>

            <div
              className="floating-input animation"
              style={{ "--li": 19, "--S": 3 } as any}
            >
              <input
                type="text"
                value={registerData.address}
                onChange={(e) =>
                  setRegisterData({ ...registerData, address: e.target.value })
                }
              />
              <label>Address</label>
              <MapPin className="icon h-5 w-5" />
            </div>

            <div
              className="floating-input animation"
              style={{ "--li": 19, "--S": 4 } as any}
            >
              <input
                type="password"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
              />
              <label>Password</label>
              <Lock className="icon h-5 w-5" />
            </div>

            <div
              className="floating-input animation"
              style={{ "--li": 20, "--S": 5 } as any}
            >
              <input
                type="password"
                value={registerData.confirmPassword}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    confirmPassword: e.target.value,
                  })
                }
              />
              <label>Confirm Password</label>
              <Lock className="icon h-5 w-5" />
            </div>

            {/* reCAPTCHA */}
            <div
              className="floating-input animation"
              style={{ "--li": 20, "--S": 6 } as any}
            >
              <div className="flex items-center  rounded-lg">
                <div
                  className="floating-input animation"
                  style={{ "--li": 20, "--S": 6 } as any}
                >
                  <RecaptchaBox
                    ref={recaptchaRef}
                    onVerify={setRecaptchaToken}
                  />
                </div>
              </div>
            </div>

            <div
              className="floating-input animation fix-btn"
              style={{ "--li": 20, "--S": 7 } as any}
            >
              <button
                className="gradient-btn"
                type="submit"
                disabled={isRegisterLoading}
              >
                {isRegisterLoading ? "Creating Account..." : "Register"}
              </button>
            </div>

            <div
              className="regi-link animation text-center text-sm mt-3"
              style={{ "--li": 21, "--S": 8 } as any}
            >
              <p className="text-gray-400">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsActive(false)}
                  className="text-[#d4a446] font-semibold hover:underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Register Info */}
        <div className="info-content register-info">
          <h2
            className="animation text-4xl uppercase mb-4 text-white"
            style={{ "--li": 17, "--S": 0 } as any}
          >
            WELCOME!
          </h2>
          <p
            className="animation text-lg text-gray-300"
            style={{ "--li": 18, "--S": 1 } as any}
          >
            Join LuxeAuction now! Create your account today and start bidding on
            exclusive luxury items.
          </p>
        </div>
      </div>
    </div>
  );
}
