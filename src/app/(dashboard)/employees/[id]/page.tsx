"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Building2,
  User,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  employees,
  todayAttendance,
  leaveRequests,
  getInitials,
  statusConfig,
} from "@/lib/mock-data";
import { format } from "date-fns";

const monthlyStats = {
  present: 19,
  absent: 1,
  late: 2,
  leave: 1,
  wfh: 2,
  halfDay: 0,
  avgWorkHours: "8.2h",
  totalOvertime: "4h",
};

const recentAttendance = [
  { date: "2026-07-03", checkIn: "09:00", checkOut: "18:05", status: "present" as const, hours: "8h 05m" },
  { date: "2026-07-02", checkIn: "09:12", checkOut: "18:30", status: "late" as const, hours: "8h 18m" },
  { date: "2026-07-01", checkIn: "08:55", checkOut: "18:00", status: "present" as const, hours: "8h 05m" },
  { date: "2026-06-30", checkIn: "09:00", checkOut: "18:00", status: "present" as const, hours: "8h 00m" },
  { date: "2026-06-27", checkIn: "09:05", checkOut: "18:10", status: "present" as const, hours: "8h 05m" },
  { date: "2026-06-26", checkIn: null, checkOut: null, status: "casual-leave" as const, hours: "-" },
  { date: "2026-06-25", checkIn: "08:50", checkOut: "18:00", status: "present" as const, hours: "8h 10m" },
];

export default function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const employee = employees.find((e) => e.id === id);

  if (!employee) {
    return (
      <div className="max-w-5xl">
        <Link
          href="/employees"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to employees
        </Link>
        <p className="text-muted-foreground">Employee not found.</p>
      </div>
    );
  }

  const todayRecord = todayAttendance.find(
    (a) => a.employeeId === employee.id
  );
  const empLeaves = leaveRequests.filter(
    (l) => l.employeeId === employee.id
  );

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/employees"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to employees
        </Link>
        <Button variant="outline" size="sm">
          <Edit className="w-3.5 h-3.5 mr-2" />
          Edit profile
        </Button>
      </div>

      {/* Profile header */}
      <Card className="p-6 mb-4">
        <div className="flex flex-col md:flex-row md:items-center gap-5">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-medium">
              {getInitials(employee.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-medium">{employee.name}</h1>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-status-present-bg text-status-present-text capitalize">
                {employee.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {employee.designation} &middot; {employee.department}
            </p>
            <p className="text-xs text-muted-foreground font-mono mt-1">
              {employee.employeeId}
            </p>
          </div>
          {todayRecord && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Today
              </p>
              <StatusBadge status={todayRecord.status} />
              {todayRecord.checkIn && (
                <p className="text-xs text-muted-foreground mt-1">
                  Checked in{" "}
                  <span className="font-mono">{todayRecord.checkIn}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-4">
        {/* Left column */}
        <div className="space-y-4">
          {/* Contact & details */}
          <Card className="p-5">
            <h3 className="text-sm font-medium mb-4">Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-3.5 h-3.5" />
                <span>{employee.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-3.5 h-3.5" />
                <span>{employee.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span>{employee.officeLocation}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="w-3.5 h-3.5" />
                <span className="capitalize">{employee.employmentType}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  Joined{" "}
                  {format(new Date(employee.dateOfJoining), "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span className="capitalize">{employee.shift} shift</span>
              </div>
              {employee.reportingManager && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-3.5 h-3.5" />
                  <span>Reports to {employee.reportingManager}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Recent attendance */}
          <Card className="p-5">
            <h3 className="text-sm font-medium mb-4">Recent attendance</h3>
            <div className="space-y-2">
              {recentAttendance.map((day) => {
                const sc = statusConfig[day.status];
                return (
                  <div
                    key={day.date}
                    className="flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-20">
                        {format(new Date(day.date), "EEE, MMM d")}
                      </span>
                      {sc && (
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${sc.bg} ${sc.text}`}
                        >
                          {sc.label}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {day.checkIn && (
                        <span className="font-mono">
                          {day.checkIn} - {day.checkOut}
                        </span>
                      )}
                      <span className="font-mono w-16 text-right">
                        {day.hours}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Monthly stats */}
          <Card className="p-5">
            <h3 className="text-sm font-medium mb-3">This month</h3>
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Present</span>
                <span className="font-mono font-medium text-status-present">
                  {monthlyStats.present}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Absent</span>
                <span className="font-mono font-medium text-status-absent">
                  {monthlyStats.absent}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Late</span>
                <span className="font-mono font-medium text-status-late">
                  {monthlyStats.late}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Leave</span>
                <span className="font-mono font-medium text-status-leave">
                  {monthlyStats.leave}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">WFH</span>
                <span className="font-mono font-medium text-status-wfh">
                  {monthlyStats.wfh}
                </span>
              </div>
              <div className="border-t border-border pt-2.5 mt-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg work hours</span>
                  <span className="font-mono font-medium">
                    {monthlyStats.avgWorkHours}
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total overtime</span>
                <span className="font-mono font-medium text-status-halfday">
                  {monthlyStats.totalOvertime}
                </span>
              </div>
            </div>
          </Card>

          {/* Leave balance */}
          <Card className="p-5">
            <h3 className="text-sm font-medium mb-3">Leave balance</h3>
            <div className="space-y-3">
              {[
                { type: "Casual", used: 4, total: 12 },
                { type: "Sick", used: 2, total: 10 },
                { type: "Earned", used: 0, total: 15 },
              ].map((lb) => (
                <div key={lb.type}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{lb.type}</span>
                    <span className="font-mono">
                      {lb.total - lb.used}/{lb.total}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{
                        width: `${(lb.used / lb.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Pending requests */}
          {empLeaves.filter((l) => l.status === "pending").length > 0 && (
            <Card className="p-5">
              <h3 className="text-sm font-medium mb-3">Pending requests</h3>
              <div className="space-y-2">
                {empLeaves
                  .filter((l) => l.status === "pending")
                  .map((req) => (
                    <div
                      key={req.id}
                      className="text-xs p-2.5 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="capitalize font-medium">
                          {req.leaveType} leave
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-status-halfday-bg text-status-halfday-text">
                          Pending
                        </span>
                      </div>
                      <p className="text-muted-foreground mt-1">
                        {format(new Date(req.startDate), "MMM d")}
                        {req.startDate !== req.endDate &&
                          ` - ${format(new Date(req.endDate), "MMM d")}`}
                      </p>
                    </div>
                  ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
