"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CalendarCheck,
  CalendarX,
  Home,
  AlertTriangle,
  Gift,
  Megaphone,
  Check,
} from "lucide-react";

const notifications = [
  {
    id: 1,
    icon: AlertTriangle,
    iconColor: "text-status-late",
    iconBg: "bg-status-late-bg",
    title: "Late check-in reminder",
    description: "Raj Patel checked in at 9:18 AM, 18 minutes late",
    time: "9:18 AM",
    unread: true,
  },
  {
    id: 2,
    icon: CalendarCheck,
    iconColor: "text-status-present-text",
    iconBg: "bg-status-present-bg",
    title: "Leave approved",
    description: "Your casual leave for Jun 30 has been approved by Arjun Mehta",
    time: "Yesterday",
    unread: true,
  },
  {
    id: 3,
    icon: Home,
    iconColor: "text-status-wfh-text",
    iconBg: "bg-status-wfh-bg",
    title: "WFH request pending",
    description: "Raj Patel has requested WFH for Jul 4",
    time: "Yesterday",
    unread: true,
  },
  {
    id: 4,
    icon: Clock,
    iconColor: "text-status-halfday-text",
    iconBg: "bg-status-halfday-bg",
    title: "Missing checkout",
    description:
      "Naveen Krishnan didn't check out yesterday. Please update attendance.",
    time: "Jul 2",
    unread: false,
  },
  {
    id: 5,
    icon: CalendarX,
    iconColor: "text-status-absent-text",
    iconBg: "bg-status-absent-bg",
    title: "Leave rejected",
    description:
      "Lakshmi Rajan's casual leave for Jun 20 was rejected due to team availability",
    time: "Jun 19",
    unread: false,
  },
  {
    id: 6,
    icon: Gift,
    iconColor: "text-status-leave-text",
    iconBg: "bg-status-leave-bg",
    title: "Birthday reminder",
    description: "Sara Kumar's birthday is on Jul 8. Don't forget to wish!",
    time: "Jun 30",
    unread: false,
  },
  {
    id: 7,
    icon: Megaphone,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    title: "Company announcement",
    description: "Independence Day celebration and office closure on Aug 15",
    time: "Jun 28",
    unread: false,
  },
];

export default function NotificationsPage() {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-medium">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Check className="w-4 h-4 mr-2" />
          Mark all read
        </Button>
      </div>

      <div className="space-y-2">
        {notifications.map((n) => (
          <Card
            key={n.id}
            className={`p-4 transition-colors ${
              n.unread ? "border-primary/20 bg-primary/[0.02]" : ""
            }`}
          >
            <div className="flex gap-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${n.iconBg}`}
              >
                <n.icon className={`w-4 h-4 ${n.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={`text-sm ${
                      n.unread ? "font-medium" : ""
                    }`}
                  >
                    {n.title}
                  </p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {n.time}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {n.description}
                </p>
              </div>
              {n.unread && (
                <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
