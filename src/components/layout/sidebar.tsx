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
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/employees", icon: Users, label: "Employees" },
  { href: "/attendance", icon: Fingerprint, label: "Attendance" },
  { href: "/calendar", icon: Calendar, label: "Calendar" },
  { href: "/leave", icon: CalendarPlus, label: "Leave" },
  { href: "/shifts", icon: Clock4, label: "Shifts" },
  { href: "/breaks", icon: Coffee, label: "Breaks" },
  { href: "/reports", icon: BarChart3, label: "Reports" },
  { href: "/analytics", icon: TrendingUp, label: "Analytics" },
  { href: "/activity", icon: Activity, label: "Activity" },
  { href: "/users", icon: UserCog, label: "Users" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <>
      <nav className="flex flex-col items-center gap-1 flex-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "w-9 h-9 flex items-center justify-center rounded-lg transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="w-[18px] h-[18px]" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8} className="hidden md:block">
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

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
