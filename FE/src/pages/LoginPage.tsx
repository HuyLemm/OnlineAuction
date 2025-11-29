import { useState, type FormEvent } from "react";
import { LogIn, Gavel } from "lucide-react";
import { AuthInput } from "../components/auth/AuthInput";
import { AuthButton } from "../components/auth/AuthButton";
import { ValidationMessage } from "../components/auth/ValidationMessage";
import { Card } from "../components/ui/card";
import { toast } from "sonner";

interface LoginPageProps {
  onNavigate?: (page: "register" | "forgot-password" | "dashboard") => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Mock successful login
      toast.success("Login successful!");
      onNavigate?.("dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6 py-12 bg-gradient-to-b from-background to-background/80">
      <Card className="w-full max-w-md p-8 bg-card border-border/50">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fbbf24] to-[#f59e0b]">
              <Gavel className="h-8 w-8 text-black" />
            </div>
          </div>
          <h1 className="text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your LuxeAuction account</p>
        </div>

        {/* Login Error */}
        {loginError && (
          <div className="mb-6">
            <ValidationMessage type="error" message={loginError} />
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <AuthInput
            label="Email Address"
            type="email"
            icon="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />

          <AuthInput
            label="Password"
            type="password"
            icon="password"
            placeholder="Enter your password"
            showPasswordToggle
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-2 border-border/50 bg-secondary/50 checked:bg-gradient-to-r checked:from-[#fbbf24] checked:to-[#f59e0b] cursor-pointer"
              />
              <span className="text-sm text-muted-foreground">Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => onNavigate?.("forgot-password")}
              className="text-sm text-[#fbbf24] hover:text-[#f59e0b] transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          <AuthButton type="submit" isLoading={isLoading}>
            <span className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Sign In
            </span>
          </AuthButton>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-card text-muted-foreground">or</span>
          </div>
        </div>

        {/* Social Login */}
        <div className="space-y-3">
          <AuthButton variant="outline" type="button">
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </span>
          </AuthButton>
        </div>

        {/* Register Link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <button
            onClick={() => onNavigate?.("register")}
            className="text-[#fbbf24] hover:text-[#f59e0b] transition-colors"
          >
            Sign up
          </button>
        </p>
      </Card>
    </div>
  );
}
