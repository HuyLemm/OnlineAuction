import { useState, type FormEvent } from "react";
import { User, Lock, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";

interface LoginPageProps {
  onNavigate?: (page: "dashboard" | "forgot-password") => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
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
  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>(
    {}
  );
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);

  // Login handlers
  const validateLogin = () => {
    const newErrors: Record<string, string> = {};
    if (!loginData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!loginData.password) {
      newErrors.password = "Password is required";
    } else if (loginData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setLoginErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setIsLoginLoading(true);
    setTimeout(() => {
      setIsLoginLoading(false);
      toast.success("Login successful!");
      onNavigate?.("dashboard");
    }, 1500);
  };

  // Register handlers
  const validateRegister = () => {
    const newErrors: Record<string, string> = {};
    if (!registerData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (registerData.fullName.trim().length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters";
    }
    if (!registerData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!registerData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (registerData.address.trim().length < 10) {
      newErrors.address = "Please enter a complete address";
    }
    if (!registerData.password) {
      newErrors.password = "Password is required";
    } else if (registerData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (!registerData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!recaptchaVerified) {
      newErrors.recaptcha = "Please verify that you are not a robot";
    }
    setRegisterErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateRegister()) return;
    setIsRegisterLoading(true);
    setTimeout(() => {
      setIsRegisterLoading(false);
      toast.success("Registration successful!");
      onNavigate?.("dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6 py-12 bg-[#1a1a1a]">
      <style>{`
        .auth-container {
          position: relative;
          width: 950px;
          height: 600px;
          border: 2px solid #d4a446;
          box-shadow: 0 0 25px rgba(212, 164, 70, 0.3);
          overflow: hidden;
        }

        .form-box {
          position: absolute;
          top: 0;
          width: 50%;
          height: 100%;
          display: flex;
          justify-content: center;
          flex-direction: column;
        }

        .form-box.login-form {
          left: 0;
          padding: 0 40px;
        }

        .form-box.login-form .animation {
          transform: translateX(0%);
          transition: 0.7s;
          opacity: 1;
          transition-delay: calc(0.1s * var(--S));
        }

        .auth-container.active .form-box.login-form .animation {
          transform: translateX(-120%);
          opacity: 0;
          transition-delay: calc(0.1s * var(--D));
        }

        .form-box.register-form {
          right: 0;
          padding: 0 40px;
        }

        .form-box.register-form .animation {
          transform: translateX(120%);
          transition: 0.7s ease;
          opacity: 0;
          filter: blur(10px);
          transition-delay: calc(0.1s * var(--S));
        }

        .auth-container.active .form-box.register-form .animation {
          transform: translateX(0%);
          opacity: 1;
          filter: blur(0px);
          transition-delay: calc(0.1s * var(--li));
        }

        .info-content {
          position: absolute;
          top: 0;
          height: 100%;
          width: 50%;
          display: flex;
          justify-content: center;
          flex-direction: column;
        }

        .info-content.login-info {
          right: 0;
          text-align: right;
          padding: 0 40px 60px 150px;
        }

        .info-content.login-info .animation {
          transform: translateX(0);
          transition: 0.7s ease;
          transition-delay: calc(0.1s * var(--S));
          opacity: 1;
          filter: blur(0px);
        }

        .auth-container.active .info-content.login-info .animation {
          transform: translateX(120%);
          opacity: 0;
          filter: blur(10px);
          transition-delay: calc(0.1s * var(--D));
        }

        .info-content.register-info {
          left: 0;
          text-align: left;
          padding: 0 150px 60px 38px;
          pointer-events: none;
        }

        .info-content.register-info .animation {
          transform: translateX(-120%);
          transition: 0.7s ease;
          opacity: 0;
          filter: blur(10px);
          transition-delay: calc(0.1s * var(--S));
        }

        .auth-container.active .info-content.register-info .animation {
          transform: translateX(0%);
          opacity: 1;
          filter: blur(0);
          transition-delay: calc(0.1s * var(--li));
        }

        .curved-shape {
          position: absolute;
          right: 0;
          top: -5px;
          height: 750px;
          width: 950px;
          background: linear-gradient(45deg, #2d2d39, #d4a446);
          transform: rotate(10deg) skewY(40deg);
          transform-origin: bottom right;
          transition: 1.5s ease;
          transition-delay: 1.6s;
        }

        .auth-container.active .curved-shape {
          transform: rotate(0deg) skewY(0deg);
          transition-delay: 0.5s;
        }

        .curved-shape2 {
          position: absolute;
          left: 250px;
          top: 100%;
          height: 750px;
          width: 950px;
          background: #2d2d39;
          border-top: 3px solid #d4a446;
          transform: rotate(0deg) skewY(0deg);
          transform-origin: bottom left;
          transition: 1.5s ease;
          transition-delay: 0.5s;
        }

        .auth-container.active .curved-shape2 {
          transform: rotate(-11deg) skewY(-41deg);
          transition-delay: 1.2s;
        }

        .floating-input {
          position: relative;
          width: 100%;
          height: 50px;
          margin-top: 18px;
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
      `}</style>

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
                required
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
              />
              <label>Email</label>
              <User className="icon h-5 w-5" />
            </div>

            <div
              className="floating-input animation"
              style={{ "--D": 2, "--S": 23 } as any}
            >
              <input
                type="password"
                required
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
              />
              <label>Password</label>
              <Lock className="icon h-5 w-5" />
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
                onClick={() => onNavigate?.("forgot-password")}
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
            className="animation text-3xl text-center mb-4 text-white"
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
                required
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
                required
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
                required
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
                required
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
                required
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
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-4">
                <input
                  type="checkbox"
                  id="recaptcha"
                  checked={recaptchaVerified}
                  onChange={(e) => setRecaptchaVerified(e.target.checked)}
                  className="w-5 h-5 accent-[#d4a446]"
                />
                <label
                  htmlFor="recaptcha"
                  className="text-gray-300 text-sm cursor-pointer"
                >
                  I'm not a robot
                </label>
              </div>
              {registerErrors.recaptcha && (
                <p className="text-red-500 text-xs mt-1">
                  {registerErrors.recaptcha}
                </p>
              )}
            </div>

            <div
              className="floating-input animation"
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
