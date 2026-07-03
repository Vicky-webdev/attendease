"use client";

import type { DashboardStats } from "@/types";

const mockStats: DashboardStats = {
  totalEmployees: 60,
  present: 42,
  absent: 3,
  late: 5,
  onLeave: 4,
  wfh: 6,
  halfDay: 2,
};

const statConfig = [
  { key: "present" as const, label: "Present", color: "text-status-present" },
  { key: "absent" as const, label: "Absent", color: "text-status-absent" },
  { key: "late" as const, label: "Late", color: "text-status-late" },
  { key: "onLeave" as const, label: "On leave", color: "text-status-leave" },
  { key: "wfh" as const, label: "WFH", color: "text-status-wfh" },
];

export function StatsGrid() {
  return (
    <div className="grid grid-cols-3 md:grid-cols-5 gap-2.5 mb-4">
      {statConfig.map((stat) => (
        <div key={stat.key} className="bg-muted rounded-lg p-3">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
            {stat.label}
          </p>
          <p className={`text-xl font-medium font-mono mt-0.5 ${stat.color}`}>
            {mockStats[stat.key]}
          </p>
        </div>
      ))}
    </div>
  );
}
