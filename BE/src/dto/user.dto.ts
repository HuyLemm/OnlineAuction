export interface RegisterDTO {
  fullName: string;
  email: string;
  password: string;
  address: string;
}

export interface VerifyOtpDTO {
  email: string;
  otp: string;
  purpose: "verify_email";
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface ResendOtpDTO {
  email: string;
  purpose: "verify_email";
}
