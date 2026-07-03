"use client";

import {
  CalendarPlus,
  CheckCircle2,
  Laptop,
  Clock,
  Bell,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { useAppStore } from "@/lib/app-store";

const iconMap: Record<string, typeof Bell> = {
  leave: CalendarPlus,
  permission: Clock,
  wfh: Laptop,
  approval: CheckCircle2,
  system: Bell,
  chat: MessageCircle,
};

const colorMap: Record<string, string> = {
  leave: "text-status-leave bg-status-leave-bg",
  permission: "text-status-permission bg-status-permission-bg",
  wfh: "text-status-wfh bg-status-wfh-bg",
  approval: "text-status-present bg-status-present-bg",
  system: "text-primary bg-primary/10",
  chat: "text-blue-600 bg-blue-50",
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } =
    useAppStore();

  const role = user?.role || "employee";
  const myId = user?.employee.id;
  const visible = notifications.filter((n) => {
    if (!n.forRoles.includes(role as any)) return false;
    if (role === "employee" && n.employeeId && n.employeeId !== myId) return false;
    return true;
  });
  const unreadCount = visible.filter((n) => !n.read).length;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-medium">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "All caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllNotificationsRead}
          >
            Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {visible.length === 0 && (
          <Card className="p-8 text-center">
            <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No notifications yet
            </p>
          </Card>
        )}
        {visible.map((notif) => {
          const Icon = iconMap[notif.type] || Bell;
          const colors = colorMap[notif.type] || "text-muted-foreground bg-muted";
          const timeAgo = getTimeAgo(notif.time);
          return (
            <Card
              key={notif.id}
              className={`p-4 cursor-pointer transition-colors hover:bg-muted/30 ${
                !notif.read ? "border-l-4 border-l-primary" : ""
              }`}
              onClick={() => markNotificationRead(notif.id)}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${colors}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm ${!notif.read ? "font-medium" : ""}`}
                    >
                      {notif.title}
                    </p>
                    <span className="text-[11px] text-muted-foreground shrink-0 ml-2">
                      {timeAgo}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {notif.message}
                  </p>
                </div>
                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function getTimeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
