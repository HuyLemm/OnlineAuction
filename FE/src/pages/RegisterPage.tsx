import { useState, type FormEvent } from "react";
import { UserPlus, Gavel, CheckCircle } from "lucide-react";
import { AuthInput } from "../components/auth/AuthInput";
import { AuthButton } from "../components/auth/AuthButton";
import { ValidationMessage } from "../components/auth/ValidationMessage";
import { RecaptchaBox } from "../components/auth/RecaptchaBox";
import { Card } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

interface RegisterPageProps {
  onNavigate?: (page: "login" | "otp-verification") => void;
}

export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  // Mock email check function
  const checkEmailExists = async (email: string) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    setEmailChecking(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock: emails ending with "taken@example.com" are considered taken
      setEmailExists(email.toLowerCase().includes("taken"));
      setEmailChecking(false);
    }, 800);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    } else if (emailExists) {
      newErrors.email = "This email is already registered";
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.trim().length < 10) {
      newErrors.address = "Please enter a complete address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and numbers";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // reCAPTCHA validation
    if (!recaptchaVerified) {
      toast.error("Please verify that you're not a robot");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && recaptchaVerified;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Registration successful! Please verify your email.");
      onNavigate?.("otp-verification");
    }, 1500);
  };

  const getPasswordStrength = () => {
    const password = formData.password;
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
      <Card className="w-full max-w-2xl p-8 bg-card border-border/50">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fbbf24] to-[#f59e0b]">
              <Gavel className="h-8 w-8 text-black" />
            </div>
          </div>
          <h1 className="text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join LuxeAuction and start bidding</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <AuthInput
              label="Full Name"
              type="text"
              icon="user"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              error={errors.fullName}
            />

            {/* Email */}
            <div className="relative">
              <AuthInput
                label="Email Address"
                type="email"
                icon="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setEmailExists(false);
                }}
                onBlur={(e) => checkEmailExists(e.target.value)}
                error={errors.email}
              />
              {emailChecking && (
                <div className="absolute right-3 top-10 text-[#fbbf24]">
                  <div className="h-4 w-4 border-2 border-[#fbbf24] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {formData.email && !emailChecking && !errors.email && !emailExists && (
                <div className="absolute right-3 top-10">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label className="text-foreground">Address</Label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-muted-foreground">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <Textarea
                placeholder="Enter your complete address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={`
                  pl-10 min-h-[80px] bg-secondary/50 border-border/50
                  ${errors.address ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-[#fbbf24]"}
                `}
              />
            </div>
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password */}
            <div>
              <AuthInput
                label="Password"
                type="password"
                icon="password"
                placeholder="Create a strong password"
                showPasswordToggle
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
              />
              {formData.password && (
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

            {/* Confirm Password */}
            <AuthInput
              label="Confirm Password"
              type="password"
              icon="password"
              placeholder="Re-enter your password"
              showPasswordToggle
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
            />
          </div>

          {/* reCAPTCHA */}
          <RecaptchaBox onChange={setRecaptchaVerified} />

          {/* Terms & Conditions */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/30 border border-border/50">
            <input
              type="checkbox"
              id="terms"
              required
              className="w-4 h-4 mt-0.5 rounded border-2 border-border/50 bg-secondary/50 checked:bg-gradient-to-r checked:from-[#fbbf24] checked:to-[#f59e0b] cursor-pointer"
            />
            <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
              I agree to the{" "}
              <a href="#" className="text-[#fbbf24] hover:text-[#f59e0b]">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-[#fbbf24] hover:text-[#f59e0b]">Privacy Policy</a>
            </label>
          </div>

          <AuthButton type="submit" isLoading={isLoading}>
            <span className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Create Account
            </span>
          </AuthButton>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <button
            onClick={() => onNavigate?.("login")}
            className="text-[#fbbf24] hover:text-[#f59e0b] transition-colors"
          >
            Sign in
          </button>
        </p>
      </Card>
    </div>
  );
}
