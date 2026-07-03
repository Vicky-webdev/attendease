"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import type { AttendanceStatus } from "@/types";

interface TeamMember {
  name: string;
  initials: string;
  department: string;
  checkIn?: string;
  status: AttendanceStatus;
}

const teamData: TeamMember[] = [
  { name: "Sara Kumar", initials: "SK", department: "Design", checkIn: "9:02 AM", status: "present" },
  { name: "Raj Patel", initials: "RP", department: "Development", checkIn: "9:18 AM", status: "late" },
  { name: "Maya Jayaram", initials: "MJ", department: "QA", checkIn: "8:55 AM", status: "present" },
  { name: "Arun Singh", initials: "AS", department: "Development", status: "wfh" },
  { name: "Priya Desai", initials: "PD", department: "HR", status: "casual-leave" },
  { name: "Naveen Krishnan", initials: "NK", department: "Marketing", checkIn: "9:05 AM", status: "present" },
  { name: "Deepa Francis", initials: "DF", department: "Finance", checkIn: "9:32 AM", status: "half-day" },
];

const statusConfig: Record<string, { label: string; bg: string; text: string; avatarBg: string; avatarText: string }> = {
  present: { label: "Present", bg: "bg-status-present-bg", text: "text-status-present-text", avatarBg: "bg-status-present-bg", avatarText: "text-status-present-text" },
  late: { label: "Late", bg: "bg-status-late-bg", text: "text-status-late-text", avatarBg: "bg-status-late-bg", avatarText: "text-status-late-text" },
  wfh: { label: "WFH", bg: "bg-status-wfh-bg", text: "text-status-wfh-text", avatarBg: "bg-status-wfh-bg", avatarText: "text-status-wfh-text" },
  "casual-leave": { label: "On leave", bg: "bg-status-leave-bg", text: "text-status-leave-text", avatarBg: "bg-status-leave-bg", avatarText: "text-status-leave-text" },
  "half-day": { label: "Half day", bg: "bg-status-halfday-bg", text: "text-status-halfday-text", avatarBg: "bg-status-halfday-bg", avatarText: "text-status-halfday-text" },
  absent: { label: "Absent", bg: "bg-status-absent-bg", text: "text-status-absent-text", avatarBg: "bg-status-absent-bg", avatarText: "text-status-absent-text" },
};

export function TeamActivity() {
  return (
    <Card className="p-4">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        Team activity
      </h3>
      <div className="space-y-0">
        {teamData.map((member) => {
          const config = statusConfig[member.status] || statusConfig.present;
          return (
            <div
              key={member.name}
              className="flex items-center gap-2.5 py-2 border-b border-border last:border-b-0"
            >
              <Avatar className="w-[30px] h-[30px]">
                <AvatarFallback
                  className={`text-[11px] font-medium ${config.avatarBg} ${config.avatarText}`}
                >
                  {member.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium truncate">
                  {member.name}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {member.department}
                </p>
              </div>
              <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                {member.checkIn || "—"}
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
