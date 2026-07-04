"use client";

import Link from "next/link";
import {
  CalendarPlus,
  DoorOpen,
  Home,
  FileBarChart,
  Calendar,
} from "lucide-react";

const actions = [
  { href: "/leave?new=leave", icon: CalendarPlus, label: "Apply leave" },
  { href: "/leave?new=permission", icon: DoorOpen, label: "Request permission" },
  { href: "/leave?new=wfh", icon: Home, label: "Apply WFH" },
  { href: "/reports", icon: FileBarChart, label: "View reports" },
  { href: "/calendar", icon: Calendar, label: "Calendar" },
];

export function QuickActions() {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
        Quick actions
      </h3>
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-[13px] font-medium"
        >
          <action.icon className="w-4 h-4 text-muted-foreground" />
          {action.label}
        </Link>
      ))}
    </div>
  );
}
