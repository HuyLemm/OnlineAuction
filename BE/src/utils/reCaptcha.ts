import { env } from "../config/env";
import { RecaptchaV2VerifyResponseDTO } from "../dto/user.dto";

/**
 * Verify reCAPTCHA token with Google
 */

export async function verifyRecaptcha(
  token: string
): Promise<RecaptchaV2VerifyResponseDTO> {
  const response = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    }
  );

  return (await response.json()) as RecaptchaV2VerifyResponseDTO;
}
