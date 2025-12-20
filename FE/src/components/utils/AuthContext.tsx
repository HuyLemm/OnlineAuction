import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Role = "bidder" | "seller" | "admin";

interface AuthContextType {
  isLoggedIn: boolean;
  role: Role | null;
  login: (data: {
    accessToken: string;
    refreshToken: string;
    role: Role;
  }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* =====================
   PROVIDER
===================== */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<Role | null>(null);

  /* =====================
     HYDRATE FROM STORAGE
  ===================== */
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setIsLoggedIn(true);
      setRole(payload.role);
    } catch {
      logout();
    }
  }, []);

  /* =====================
     LOGIN
  ===================== */
  const login = (data: {
    accessToken: string;
    refreshToken: string;
    role: Role;
  }) => {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    setIsLoggedIn(true);
    setRole(data.role);
  };

  /* =====================
     LOGOUT
  ===================== */
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setIsLoggedIn(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/* =====================
   HOOK
===================== */

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
