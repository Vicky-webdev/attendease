"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  getDay,
  startOfWeek,
  endOfWeek,
  isSameDay,
  isWeekend,
} from "date-fns";
import { holidays, todayAttendance, getEmployee } from "@/lib/mock-data";
import type { AttendanceStatus } from "@/types";

const statusColors: Record<string, { bg: string; text: string }> = {
  present: { bg: "bg-status-present", text: "text-white" },
  late: { bg: "bg-status-late", text: "text-white" },
  "half-day": { bg: "bg-status-halfday", text: "text-white" },
  wfh: { bg: "bg-status-wfh", text: "text-white" },
  "casual-leave": { bg: "bg-status-leave", text: "text-white" },
  "sick-leave": { bg: "bg-status-leave", text: "text-white" },
  absent: { bg: "bg-status-absent", text: "text-white" },
  holiday: { bg: "bg-status-holiday", text: "text-white" },
  weekend: { bg: "bg-muted", text: "text-muted-foreground" },
};

const statusDots: Record<string, string> = {
  present: "bg-status-present",
  late: "bg-status-late",
  "half-day": "bg-status-halfday",
  wfh: "bg-status-wfh",
  "casual-leave": "bg-status-leave",
  "sick-leave": "bg-status-leave",
  absent: "bg-status-absent",
  holiday: "bg-status-holiday",
};

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const prevMonth = () =>
    setCurrentMonth(
      (d) => new Date(d.getFullYear(), d.getMonth() - 1, 1)
    );
  const nextMonth = () =>
    setCurrentMonth(
      (d) => new Date(d.getFullYear(), d.getMonth() + 1, 1)
    );

  const getDateStatus = (date: Date): AttendanceStatus | "holiday" | "weekend" | null => {
    const dateStr = format(date, "yyyy-MM-dd");
    const holiday = holidays.find((h) => h.date === dateStr);
    if (holiday) return "holiday";
    if (isWeekend(date)) return "weekend";
    const record = todayAttendance.find(
      (a) => a.date === dateStr && a.employeeId === "1"
    );
    if (record) return record.status;
    if (date < new Date() && isSameMonth(date, currentMonth)) return "present";
    return null;
  };

  const selectedDateDetails = useMemo(() => {
    if (!selectedDate) return null;
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const holiday = holidays.find((h) => h.date === dateStr);
    if (holiday) return { type: "holiday" as const, holiday };
    const records = todayAttendance.filter((a) => a.date === dateStr);
    return { type: "attendance" as const, records };
  }, [selectedDate]);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-medium">Calendar</h1>
          <p className="text-sm text-muted-foreground">
            Monthly attendance overview
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-medium">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-1.5 hover:bg-muted rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1.5 hover:bg-muted rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
            {calendarDays.map((day) => {
              const status = getDateStatus(day);
              const inMonth = isSameMonth(day, currentMonth);
              const today = isToday(day);
              const selected =
                selectedDate && isSameDay(day, selectedDate);
              const dotColor = status ? statusDots[status] : null;

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-colors
                    ${!inMonth ? "text-muted-foreground/30" : ""}
                    ${today ? "ring-2 ring-primary ring-offset-1" : ""}
                    ${selected ? "bg-primary text-primary-foreground" : "hover:bg-muted"}
                    ${isWeekend(day) && inMonth && !selected ? "text-muted-foreground" : ""}
                  `}
                >
                  {format(day, "d")}
                  {dotColor && inMonth && !selected && (
                    <span
                      className={`absolute bottom-1 w-1 h-1 rounded-full ${dotColor}`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border">
            {[
              { label: "Present", color: "bg-status-present" },
              { label: "Late", color: "bg-status-late" },
              { label: "WFH", color: "bg-status-wfh" },
              { label: "Leave", color: "bg-status-leave" },
              { label: "Half day", color: "bg-status-halfday" },
              { label: "Holiday", color: "bg-status-holiday" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <span
                  className={`w-2 h-2 rounded-full ${item.color}`}
                />
                {item.label}
              </div>
            ))}
          </div>
        </Card>

        {/* Side panel */}
        <div className="space-y-3">
          <Card className="p-4">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              {selectedDate
                ? format(selectedDate, "EEEE, MMM d")
                : "Select a date"}
            </h3>
            {selectedDate ? (
              selectedDateDetails?.type === "holiday" ? (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-status-holiday" />
                  <span className="text-sm font-medium">
                    {selectedDateDetails.holiday.name}
                  </span>
                </div>
              ) : isWeekend(selectedDate) ? (
                <p className="text-sm text-muted-foreground">Weekend</p>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Check in</p>
                    <p className="text-sm font-mono font-medium">09:00 AM</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Check out</p>
                    <p className="text-sm font-mono font-medium">06:15 PM</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Working hours
                    </p>
                    <p className="text-sm font-mono font-medium">8h 15m</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Break</p>
                    <p className="text-sm font-mono font-medium">1h 00m</p>
                  </div>
                </div>
              )
            ) : (
              <p className="text-sm text-muted-foreground">
                Click on a date to see details
              </p>
            )}
          </Card>

          <Card className="p-4">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Upcoming holidays
            </h3>
            <div className="space-y-2">
              {holidays
                .filter((h) => new Date(h.date) >= new Date())
                .slice(0, 4)
                .map((h) => (
                  <div
                    key={h.date}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">{h.name}</span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {format(new Date(h.date), "MMM d")}
                    </span>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
