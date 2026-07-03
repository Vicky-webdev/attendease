"use client";

import Link from "next/link";
import { Bell, Sun, Moon, Wifi, WifiOff } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/lib/auth-context";
import { useAppStore } from "@/lib/app-store";
import { getInitials } from "@/lib/mock-data";
import { format } from "date-fns";

export function Header() {
  const today = new Date();
  const greeting = getGreeting();
  const { theme, setTheme } = useTheme();
  const { user, presence } = useAuth();
  const { unreadCount } = useAppStore();

  const name = user?.employee.name.split(" ")[0] || "User";
  const role = user?.role || "employee";
  const initials = user ? getInitials(user.employee.name) : "??";
  const notifCount = unreadCount(role, user?.employee.id);

  const presenceColor =
    presence === "online"
      ? "bg-status-present"
      : presence === "idle"
        ? "bg-status-halfday"
        : "bg-muted-foreground";

  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-base font-medium">
          {format(today, "EEEE, MMMM d")}
        </h1>
        <p className="text-sm text-muted-foreground">{greeting}, {name}</p>
      </div>
      <div className="flex items-center gap-2">
        {/* Network indicator */}
        {user && (
          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-muted-foreground mr-1">
            {user.isOfficeNetwork ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-status-present" />
                <span>Office ({user.ipAddress})</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-status-late" />
                <span>{user.ipAddress === "detecting..." ? "Detecting..." : `External (${user.ipAddress})`}</span>
              </>
            )}
          </div>
        )}

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
        <Link
          href="/notifications"
          className="relative w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors"
        >
          <Bell className="w-4 h-4" />
          {notifCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-[10px] font-medium flex items-center justify-center px-1">
              {notifCount > 9 ? "9+" : notifCount}
            </span>
          )}
        </Link>
        <div className="relative">
          <Avatar className="w-9 h-9">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-card ${presenceColor}`}
          />
        </div>
      </div>
    </header>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
