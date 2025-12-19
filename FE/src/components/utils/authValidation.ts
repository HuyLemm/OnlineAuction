export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  address: string;
  password: string;
  confirmPassword: string;
}

export function validateLogin(data: LoginData): string | null {
  if (!data.email) {
    return "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return "Please enter a valid email address";
  }

  if (!data.password) {
    return "Password is required";
  } else if (data.password.length < 6) {
    return "Password must be at least 8 characters";
  }

  return null;
}

export function validateRegister(data: RegisterData): string | null {
  if (!data.fullName.trim()) {
    return "Full name is required";
  }
  if (data.fullName.trim().length < 5) {
    return "Full name must be at least 5 characters";
  }

  if (!data.email) {
    return "Email is required";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return "Please enter a valid email address";
  }

  if (!data.address.trim()) {
    return "Address is required";
  }
  if (data.address.trim().length < 7) {
    return "Please enter a complete address (more than 7 characters)";
  }

  if (!data.password) {
    return "Password is required";
  }
  if (data.password.length < 8) {
    return "Password must be at least 8 characters";
  }

  if (!data.confirmPassword) {
    return "Please confirm your password";
  }
  if (data.password !== data.confirmPassword) {
    return "Passwords do not match";
  }

  return null;
}
