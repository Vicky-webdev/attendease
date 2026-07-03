"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Fingerprint,
  Calendar,
  CalendarPlus,
  Coffee,
  Clock4,
  BarChart3,
  TrendingUp,
  Activity,
  Bell,
  UserCog,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth, isAdmin, isManager } from "@/lib/auth-context";
import { useAppStore } from "@/lib/app-store";

type NavAccess = "all" | "admin" | "manager";

const navItems: {
  href: string;
  icon: typeof LayoutDashboard;
  label: string;
  access: NavAccess;
}[] = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard", access: "all" },
  { href: "/employees", icon: Users, label: "Employees", access: "manager" },
  { href: "/attendance", icon: Fingerprint, label: "Attendance", access: "all" },
  { href: "/calendar", icon: Calendar, label: "Calendar", access: "all" },
  { href: "/leave", icon: CalendarPlus, label: "Leave", access: "all" },
  { href: "/shifts", icon: Clock4, label: "Shifts", access: "admin" },
  { href: "/breaks", icon: Coffee, label: "Breaks", access: "manager" },
  { href: "/reports", icon: BarChart3, label: "Reports", access: "manager" },
  { href: "/analytics", icon: TrendingUp, label: "Analytics", access: "admin" },
  { href: "/activity", icon: Activity, label: "Activity", access: "manager" },
  { href: "/users", icon: UserCog, label: "Users", access: "admin" },
  { href: "/notifications", icon: Bell, label: "Notifications", access: "all" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { unreadCount } = useAppStore();

  const role = user?.role || "employee";
  const notifCount = unreadCount(role, user?.employee.id);

  const visibleItems = navItems.filter((item) => {
    if (item.access === "all") return true;
    if (item.access === "manager") return isManager(role);
    if (item.access === "admin") return isAdmin(role);
    return false;
  });

  const navContent = (
    <>
      <nav className="flex flex-col items-center gap-1 flex-1">
        {visibleItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const showBadge = item.href === "/notifications" && notifCount > 0;
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "relative w-9 h-9 flex items-center justify-center rounded-lg transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="w-[18px] h-[18px]" />
                  {showBadge && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8} className="hidden md:block">
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      <div className="flex flex-col items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/settings"
              onClick={() => setMobileOpen(false)}
              className={cn(
                "w-9 h-9 flex items-center justify-center rounded-lg transition-colors",
                pathname === "/settings"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Settings className="w-[18px] h-[18px]" />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8} className="hidden md:block">
            Settings
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => {
                setMobileOpen(false);
                logout();
              }}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="w-[18px] h-[18px]" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8} className="hidden md:block">
            Sign out
          </TooltipContent>
        </Tooltip>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-12 bg-card border-b border-border flex items-center justify-between px-3 z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link
            href="/"
            className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium"
          >
            A
          </Link>
          <span className="text-sm font-medium">AttendEase</span>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-30 pt-12"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="w-14 bg-card border-r border-border h-full flex flex-col items-center py-3 gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {navContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[52px] border-r border-border bg-card flex-col items-center py-3 gap-1 shrink-0">
        <Link
          href="/"
          className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium mb-3"
        >
          A
        </Link>
        {navContent}
      </aside>
    </>
  );
}
