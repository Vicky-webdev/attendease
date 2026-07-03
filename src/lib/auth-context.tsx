"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Employee } from "@/types";
import { employees } from "@/lib/mock-data";

export type UserRole = "super-admin" | "hr" | "manager" | "employee";
export type PresenceStatus = "online" | "offline" | "idle";

export interface AuthUser {
  employee: Employee;
  role: UserRole;
  presence: PresenceStatus;
  loginTime: string;
  ipAddress: string;
  officeIp: string;
  isOfficeNetwork: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  presence: PresenceStatus;
  setPresence: (status: PresenceStatus) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: () => ({ success: false }),
  logout: () => {},
  presence: "offline",
  setPresence: () => {},
});

const OFFICE_NETWORK_PREFIX = "192.168.1.";

const userCredentials: Record<string, { password: string; role: UserRole }> = {
  "arjun@company.com": { password: "admin123", role: "super-admin" },
  "priya@company.com": { password: "admin123", role: "hr" },
  "vignesh@company.com": { password: "emp123", role: "manager" },
  "maya@company.com": { password: "emp123", role: "manager" },
  "lakshmi@company.com": { password: "emp123", role: "manager" },
  "karthik@company.com": { password: "emp123", role: "manager" },
  "sara@company.com": { password: "emp123", role: "employee" },
  "raj@company.com": { password: "emp123", role: "employee" },
  "arun@company.com": { password: "emp123", role: "employee" },
  "naveen@company.com": { password: "emp123", role: "employee" },
  "deepa@company.com": { password: "emp123", role: "employee" },
  "ananya@company.com": { password: "emp123", role: "employee" },
};

async function detectRealIp(): Promise<string> {
  try {
    const res = await fetch("https://api.ipify.org?format=json", { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    return data.ip || "unknown";
  } catch {
    return "unknown";
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [presence, setPresenceState] = useState<PresenceStatus>("offline");

  useEffect(() => {
    const stored = localStorage.getItem("auth_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AuthUser;
        setUser(parsed);
        setPresenceState("online");
      } catch {}
    }
    setLoading(false);
  }, []);

  // Idle detection
  useEffect(() => {
    if (!user) return;

    let idleTimer: ReturnType<typeof setTimeout>;

    const resetIdle = () => {
      if (presence === "idle") setPresenceState("online");
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        setPresenceState("idle");
      }, 5 * 60 * 1000);
    };

    window.addEventListener("mousemove", resetIdle);
    window.addEventListener("keydown", resetIdle);
    window.addEventListener("click", resetIdle);
    resetIdle();

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener("mousemove", resetIdle);
      window.removeEventListener("keydown", resetIdle);
      window.removeEventListener("click", resetIdle);
    };
  }, [user, presence]);

  const login = useCallback(
    (email: string, password: string): { success: boolean; error?: string } => {
      const cred = userCredentials[email.toLowerCase()];
      if (!cred) return { success: false, error: "Account not found" };
      if (cred.password !== password)
        return { success: false, error: "Invalid password" };

      const emp = employees.find(
        (e) => e.email.toLowerCase() === email.toLowerCase()
      );
      if (!emp) return { success: false, error: "Employee record not found" };

      const authUser: AuthUser = {
        employee: emp,
        role: cred.role,
        presence: "online",
        loginTime: new Date().toISOString(),
        ipAddress: "detecting...",
        officeIp: OFFICE_NETWORK_PREFIX,
        isOfficeNetwork: false,
      };

      setUser(authUser);
      setPresenceState("online");
      localStorage.setItem("auth_user", JSON.stringify(authUser));

      detectRealIp().then((ip) => {
        const isOffice = ip.startsWith(OFFICE_NETWORK_PREFIX);
        const updated: AuthUser = { ...authUser, ipAddress: ip, isOfficeNetwork: isOffice };
        setUser(updated);
        localStorage.setItem("auth_user", JSON.stringify(updated));
      });

      return { success: true };
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    setPresenceState("offline");
    localStorage.removeItem("auth_user");
  }, []);

  const setPresence = useCallback((status: PresenceStatus) => {
    setPresenceState(status);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        presence,
        setPresence,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function isAdmin(role: UserRole): boolean {
  return role === "super-admin" || role === "hr";
}

export function isManager(role: UserRole): boolean {
  return role === "super-admin" || role === "hr" || role === "manager";
}
