"use client";

import { useState } from "react";
import { Clock, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { employees, getInitials } from "@/lib/mock-data";

const shifts = [
  {
    id: "general",
    name: "General",
    startTime: "09:00",
    endTime: "18:00",
    breakDuration: "1h",
    graceMinutes: 15,
    color: "#1D9E75",
    employees: employees.filter((e) => e.shift === "general"),
  },
  {
    id: "morning",
    name: "Morning",
    startTime: "06:00",
    endTime: "14:00",
    breakDuration: "45m",
    graceMinutes: 10,
    color: "#378ADD",
    employees: employees.filter((e) => e.shift === "morning"),
  },
  {
    id: "evening",
    name: "Evening",
    startTime: "14:00",
    endTime: "22:00",
    breakDuration: "45m",
    graceMinutes: 10,
    color: "#7F77DD",
    employees: [],
  },
  {
    id: "night",
    name: "Night",
    startTime: "22:00",
    endTime: "06:00",
    breakDuration: "1h",
    graceMinutes: 15,
    color: "#D85A30",
    employees: [],
  },
];

export default function ShiftsPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-medium">Shift management</h1>
          <p className="text-sm text-muted-foreground">
            Configure shifts and assign employees
          </p>
        </div>
        <Button className="bg-primary hover:bg-teal-600 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Add shift
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedule">Weekly schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shifts.map((shift) => (
              <Card key={shift.id} className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: shift.color }}
                    />
                    <h3 className="text-sm font-medium">{shift.name} shift</h3>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>{shift.employees.length}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
                      Start
                    </p>
                    <p className="text-sm font-mono font-medium mt-0.5">
                      {shift.startTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
                      End
                    </p>
                    <p className="text-sm font-mono font-medium mt-0.5">
                      {shift.endTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
                      Break
                    </p>
                    <p className="text-sm font-mono font-medium mt-0.5">
                      {shift.breakDuration}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
                      Grace
                    </p>
                    <p className="text-sm font-mono font-medium mt-0.5">
                      {shift.graceMinutes}m
                    </p>
                  </div>
                </div>

                {/* Timeline bar */}
                <div className="relative h-6 bg-muted rounded-full overflow-hidden mb-4">
                  {(() => {
                    const startH = parseInt(shift.startTime.split(":")[0]);
                    const endH = parseInt(shift.endTime.split(":")[0]);
                    const adjustedEnd = endH < startH ? endH + 24 : endH;
                    const left = (startH / 24) * 100;
                    const width = ((adjustedEnd - startH) / 24) * 100;
                    return (
                      <div
                        className="absolute top-0 h-full rounded-full opacity-30"
                        style={{
                          backgroundColor: shift.color,
                          left: `${left}%`,
                          width: `${width}%`,
                        }}
                      />
                    );
                  })()}
                  <div className="absolute inset-0 flex items-center justify-between px-3 text-[10px] text-muted-foreground">
                    <span>12am</span>
                    <span>6am</span>
                    <span>12pm</span>
                    <span>6pm</span>
                    <span>12am</span>
                  </div>
                </div>

                {shift.employees.length > 0 && (
                  <div className="flex -space-x-1.5">
                    {shift.employees.slice(0, 6).map((emp) => (
                      <Avatar
                        key={emp.id}
                        className="w-7 h-7 border-2 border-card"
                      >
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-medium">
                          {getInitials(emp.name)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {shift.employees.length > 6 && (
                      <div className="w-7 h-7 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] text-muted-foreground font-medium">
                        +{shift.employees.length - 6}
                      </div>
                    )}
                  </div>
                )}
                {shift.employees.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No employees assigned
                  </p>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="mt-4">
          <Card className="p-5">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 text-xs text-muted-foreground font-medium">
                      Employee
                    </th>
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day) => (
                        <th
                          key={day}
                          className="text-center py-2 px-2 text-xs text-muted-foreground font-medium"
                        >
                          {day}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {employees.slice(0, 8).map((emp) => {
                    const shift = shifts.find((s) => s.id === emp.shift);
                    return (
                      <tr key={emp.id} className="border-b border-border">
                        <td className="py-2.5 pr-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="bg-primary/10 text-primary text-[9px] font-medium">
                                {getInitials(emp.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{emp.name}</span>
                          </div>
                        </td>
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                          (day) => {
                            const isWorking = emp.workingDays.includes(day);
                            return (
                              <td key={day} className="text-center py-2.5 px-2">
                                {isWorking && shift ? (
                                  <span
                                    className="inline-block text-[10px] px-2 py-0.5 rounded-full font-medium text-white"
                                    style={{
                                      backgroundColor: shift.color,
                                    }}
                                  >
                                    {shift.name.charAt(0)}
                                  </span>
                                ) : (
                                  <span className="text-xs text-muted-foreground">
                                    —
                                  </span>
                                )}
                              </td>
                            );
                          }
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
