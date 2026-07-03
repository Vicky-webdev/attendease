"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useAuth, isManager } from "@/lib/auth-context";
import { todayAttendance, getEmployee, getInitials } from "@/lib/mock-data";
import type { AttendanceStatus } from "@/types";

const statusConfig: Record<string, { label: string; bg: string; text: string; avatarBg: string; avatarText: string }> = {
  present: { label: "Present", bg: "bg-status-present-bg", text: "text-status-present-text", avatarBg: "bg-status-present-bg", avatarText: "text-status-present-text" },
  late: { label: "Late", bg: "bg-status-late-bg", text: "text-status-late-text", avatarBg: "bg-status-late-bg", avatarText: "text-status-late-text" },
  wfh: { label: "WFH", bg: "bg-status-wfh-bg", text: "text-status-wfh-text", avatarBg: "bg-status-wfh-bg", avatarText: "text-status-wfh-text" },
  "casual-leave": { label: "On leave", bg: "bg-status-leave-bg", text: "text-status-leave-text", avatarBg: "bg-status-leave-bg", avatarText: "text-status-leave-text" },
  "half-day": { label: "Half day", bg: "bg-status-halfday-bg", text: "text-status-halfday-text", avatarBg: "bg-status-halfday-bg", avatarText: "text-status-halfday-text" },
  absent: { label: "Absent", bg: "bg-status-absent-bg", text: "text-status-absent-text", avatarBg: "bg-status-absent-bg", avatarText: "text-status-absent-text" },
};

function formatCheckIn(time?: string): string {
  if (!time) return "—";
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export function TeamActivity() {
  const { user } = useAuth();
  const role = user?.role || "employee";
  const myId = user?.employee.id;
  const showTeam = isManager(role);

  const records = showTeam
    ? todayAttendance.filter((a) => a.employeeId !== myId)
    : todayAttendance.filter((a) => a.employeeId === myId);

  return (
    <Card className="p-4">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        {showTeam ? "Team activity" : "My attendance today"}
      </h3>
      <div className="space-y-0">
        {records.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">No records</p>
        )}
        {records.map((record) => {
          const emp = getEmployee(record.employeeId);
          if (!emp) return null;
          const config = statusConfig[record.status] || statusConfig.present;
          return (
            <div
              key={record.id}
              className="flex items-center gap-2.5 py-2 border-b border-border last:border-b-0"
            >
              <Avatar className="w-[30px] h-[30px]">
                <AvatarFallback
                  className={`text-[11px] font-medium ${config.avatarBg} ${config.avatarText}`}
                >
                  {getInitials(emp.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium truncate">
                  {emp.name}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {emp.department}
                </p>
              </div>
              <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                {formatCheckIn(record.checkIn)}
              </span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${config.bg} ${config.text}`}
              >
                {config.label}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
