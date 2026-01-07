import ReCAPTCHA from "react-google-recaptcha";
import { forwardRef } from "react";

export const RecaptchaBox = forwardRef<
  ReCAPTCHA,
  { onVerify: (t: string | null) => void }
>(({ onVerify }, ref) => {
  return (
    <ReCAPTCHA
      ref={ref}
      sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
      onChange={onVerify}
      onExpired={() => onVerify(null)}
      theme="dark"
    />
  );
});
