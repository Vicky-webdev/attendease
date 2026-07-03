"use client";

import { useAuth, isManager } from "@/lib/auth-context";
import { todayAttendance, getEmployee } from "@/lib/mock-data";

const companyStats = {
  present: 42,
  absent: 3,
  late: 5,
  onLeave: 4,
  wfh: 6,
};

const statConfig = [
  { key: "present" as const, label: "Present", color: "text-status-present" },
  { key: "absent" as const, label: "Absent", color: "text-status-absent" },
  { key: "late" as const, label: "Late", color: "text-status-late" },
  { key: "onLeave" as const, label: "On leave", color: "text-status-leave" },
  { key: "wfh" as const, label: "WFH", color: "text-status-wfh" },
];

const employeeStatConfig = [
  { key: "status", label: "Status" },
  { key: "hours", label: "Hours today" },
  { key: "breaks", label: "Break time" },
  { key: "overtime", label: "Overtime" },
];

export function StatsGrid() {
  const { user } = useAuth();
  const role = user?.role || "employee";
  const showCompany = isManager(role);

  if (showCompany) {
    return (
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2.5 mb-4">
        {statConfig.map((stat) => (
          <div key={stat.key} className="bg-muted rounded-lg p-3">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
              {stat.label}
            </p>
            <p className={`text-xl font-medium font-mono mt-0.5 ${stat.color}`}>
              {companyStats[stat.key]}
            </p>
          </div>
        ))}
      </div>
    );
  }

  const myRecord = todayAttendance.find((a) => a.employeeId === user?.employee.id);
  const statusLabels: Record<string, { label: string; color: string }> = {
    present: { label: "Present", color: "text-status-present" },
    late: { label: "Late", color: "text-status-late" },
    wfh: { label: "WFH", color: "text-status-wfh" },
    "casual-leave": { label: "On leave", color: "text-status-leave" },
    "half-day": { label: "Half day", color: "text-status-halfday" },
    absent: { label: "Absent", color: "text-status-absent" },
  };
  const st = myRecord ? statusLabels[myRecord.status] || { label: "Not checked in", color: "text-muted-foreground" } : { label: "Not checked in", color: "text-muted-foreground" };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-4">
      <div className="bg-muted rounded-lg p-3">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Status</p>
        <p className={`text-lg font-medium mt-0.5 ${st.color}`}>{st.label}</p>
      </div>
      <div className="bg-muted rounded-lg p-3">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Hours today</p>
        <p className="text-lg font-medium font-mono mt-0.5">{myRecord?.workingHours ?? 0}h</p>
      </div>
      <div className="bg-muted rounded-lg p-3">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Break time</p>
        <p className="text-lg font-medium font-mono mt-0.5">{myRecord?.breakHours ?? 0}h</p>
      </div>
      <div className="bg-muted rounded-lg p-3">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Overtime</p>
        <p className="text-lg font-medium font-mono mt-0.5">{myRecord?.overtime ?? 0}h</p>
      </div>
    </div>
  );
}
