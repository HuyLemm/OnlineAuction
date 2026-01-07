import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "outline";
  fullWidth?: boolean;
}

export function AuthButton({ 
  children, 
  isLoading, 
  variant = "primary", 
  fullWidth = true,
  disabled,
  className,
  ...props 
}: AuthButtonProps) {
  const getVariantClass = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-black hover:opacity-90";
      case "secondary":
        return "bg-secondary/50 hover:bg-secondary text-foreground";
      case "outline":
        return "border-2 border-border/50 hover:border-[#fbbf24]/50 hover:bg-[#fbbf24]/5 text-foreground";
      default:
        return "";
    }
  };

  return (
    <Button
      disabled={disabled || isLoading}
      className={`
        ${fullWidth ? "w-full" : ""}
        ${getVariantClass()}
        h-11 transition-all
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </Button>
  );
}
