import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "@/lib/api";
import type { User, LoginCredentials, SignupCredentials, AuthResponse } from "@/types/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isDemo: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  loginDemo: (role?: "admin" | "faculty" | "student") => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Record<string, User> = {
  admin: { _id: "demo-admin", name: "Demo Admin", email: "admin@college.edu", role: "admin" },
  faculty: { _id: "demo-faculty", name: "Dr. Sarah Wilson", email: "sarah@college.edu", role: "faculty" },
  student: { _id: "demo-student", name: "Alex Johnson", email: "alex@college.edu", role: "student" },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const demoMode = localStorage.getItem("demoMode");
    if (demoMode && DEMO_USERS[demoMode]) {
      setUser(DEMO_USERS[demoMode]);
      setToken("demo-token");
      setIsDemo(true);
    } else {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const { data } = await api.post<AuthResponse>("/auth/login", credentials);
    localStorage.removeItem("demoMode");
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    setIsDemo(false);
  };

  const signup = async (credentials: SignupCredentials) => {
    const { data } = await api.post<AuthResponse>("/auth/signup", credentials);
    localStorage.removeItem("demoMode");
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    setIsDemo(false);
  };

  const loginDemo = (role: "admin" | "faculty" | "student" = "admin") => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.setItem("demoMode", role);
    setUser(DEMO_USERS[role]);
    setToken("demo-token");
    setIsDemo(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("demoMode");
    setToken(null);
    setUser(null);
    setIsDemo(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, isDemo, login, signup, loginDemo, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
