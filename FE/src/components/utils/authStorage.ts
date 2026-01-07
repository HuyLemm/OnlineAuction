// src/auth/authStorage.ts
export const authStorage = {
  setAuth(data: {
    accessToken: string;
    refreshToken: string;
    role: string;
  }) {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("role", data.role);
  },

  clear() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
  },

  getAccessToken() {
    return localStorage.getItem("accessToken");
  },

  getRole() {
    return localStorage.getItem("role");
  },

  isLoggedIn() {
    return !!localStorage.getItem("accessToken");
  },
};
