import { forwardRef, useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, MapPin } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: "email" | "password" | "user" | "address";
  showPasswordToggle?: boolean;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, icon, showPasswordToggle, type, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const getIcon = () => {
      switch (icon) {
        case "email":
          return <Mail className="h-4 w-4 text-muted-foreground" />;
        case "password":
          return <Lock className="h-4 w-4 text-muted-foreground" />;
        case "user":
          return <User className="h-4 w-4 text-muted-foreground" />;
        case "address":
          return <MapPin className="h-4 w-4 text-muted-foreground" />;
        default:
          return null;
      }
    };

    const inputType = showPasswordToggle && type === "password" 
      ? (showPassword ? "text" : "password")
      : type;

    return (
      <div className="space-y-2">
        <Label className="text-foreground">{label}</Label>
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              {getIcon()}
            </div>
          )}
          <Input
            ref={ref}
            type={inputType}
            className={`
              bg-secondary/50 border-border/50 
              ${icon ? "pl-10" : ""} 
              ${showPasswordToggle ? "pr-10" : ""}
              ${error ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-[#fbbf24]"}
              ${className}
            `}
            {...props}
          />
          {showPasswordToggle && type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";
