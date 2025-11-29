import { Shield } from "lucide-react";

interface RecaptchaBoxProps {
  onChange?: (verified: boolean) => void;
}

export function RecaptchaBox({ onChange }: RecaptchaBoxProps) {
  const handleVerify = () => {
    // Simulate reCAPTCHA verification
    // In a real app, this would integrate with Google reCAPTCHA
    onChange?.(true);
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border-2 border-border/50 bg-secondary/30 hover:border-[#fbbf24]/30 transition-all">
      <input
        type="checkbox"
        id="recaptcha"
        onChange={(e) => onChange?.(e.target.checked)}
        className="w-5 h-5 rounded border-2 border-border/50 bg-secondary/50 checked:bg-gradient-to-r checked:from-[#fbbf24] checked:to-[#f59e0b] cursor-pointer"
      />
      <label htmlFor="recaptcha" className="flex items-center gap-2 cursor-pointer flex-1">
        <span className="text-foreground">I'm not a robot</span>
      </label>
      <div className="flex flex-col items-end gap-1">
        <Shield className="h-6 w-6 text-[#fbbf24]" />
        <span className="text-xs text-muted-foreground">reCAPTCHA</span>
      </div>
    </div>
  );
}
