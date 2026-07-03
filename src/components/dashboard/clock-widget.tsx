"use client";

import { useState, useEffect, useCallback } from "react";
import { Clock, Coffee, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface BreakState {
  tea: boolean;
  lunch: boolean;
}

export function ClockWidget() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [breakState, setBreakState] = useState<BreakState>({
    tea: false,
    lunch: false,
  });
  const [totalBreakMin, setTotalBreakMin] = useState(0);
  const [workedMinutes, setWorkedMinutes] = useState(0);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );

      if (clockedIn && clockInTime) {
        const diff =
          Math.floor((now.getTime() - clockInTime.getTime()) / 60000) -
          totalBreakMin;
        setWorkedMinutes(Math.max(0, diff));
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [clockedIn, clockInTime, totalBreakMin]);

  const handleClockToggle = () => {
    if (clockedIn) {
      setClockedIn(false);
      setClockInTime(null);
      setWorkedMinutes(0);
      setTotalBreakMin(0);
      setBreakState({ tea: false, lunch: false });
    } else {
      setClockedIn(true);
      setClockInTime(new Date());
    }
  };

  const handleBreakToggle = (type: "tea" | "lunch") => {
    if (breakState[type]) {
      setBreakState((prev) => ({ ...prev, [type]: false }));
      setTotalBreakMin((prev) => prev + (type === "lunch" ? 45 : 15));
    } else {
      setBreakState((prev) => ({ ...prev, [type]: true }));
    }
  };

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m.toString().padStart(2, "0")}m`;
  };

  const remainingMinutes = Math.max(0, 540 - workedMinutes);
  const progressPercent = clockedIn
    ? Math.min(
        100,
        ((workedMinutes + totalBreakMin) / 540) * 100
      )
    : 0;

  return (
    <Card className="p-5 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="font-mono text-4xl font-medium tracking-tighter text-foreground">
            {currentTime || "00:00:00"}
          </div>
          <div className="text-sm text-muted-foreground mt-1 font-mono">
            {clockedIn && clockInTime ? (
              <>
                Clocked in at{" "}
                <span className="text-primary font-medium">
                  {clockInTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </>
            ) : (
              "Not clocked in"
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Button
            onClick={handleClockToggle}
            className={
              clockedIn
                ? "bg-coral-400 hover:bg-coral-600 text-white"
                : "bg-primary hover:bg-teal-600 text-primary-foreground"
            }
          >
            <Clock className="w-4 h-4 mr-2" />
            {clockedIn ? "Clock out" : "Clock in"}
          </Button>

          {clockedIn && (
            <div className="flex gap-1.5">
              <button
                onClick={() => handleBreakToggle("tea")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                  breakState.tea
                    ? "bg-status-halfday-bg border-status-halfday text-status-halfday-text"
                    : "bg-muted border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <Coffee className="w-3 h-3" />
                Tea
              </button>
              <button
                onClick={() => handleBreakToggle("lunch")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                  breakState.lunch
                    ? "bg-status-halfday-bg border-status-halfday text-status-halfday-text"
                    : "bg-muted border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <UtensilsCrossed className="w-3 h-3" />
                Lunch
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Day timeline */}
      <div className="mb-3">
        <div className="relative h-2 bg-muted rounded-full overflow-visible">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
          {clockedIn && (
            <div
              className="absolute top-[-3px] w-0.5 h-[14px] bg-foreground rounded-full transition-all duration-500"
              style={{ left: `${progressPercent}%` }}
            />
          )}
        </div>
        <div className="flex justify-between mt-1.5 text-[11px] text-muted-foreground font-mono">
          <span>9:00 AM</span>
          <span>12:00 PM</span>
          <span>3:00 PM</span>
          <span>6:00 PM</span>
        </div>
      </div>

      {/* Status row */}
      <div className="flex gap-4 pt-3 border-t border-border">
        <StatusItem icon={Clock} label="Worked" value={formatDuration(workedMinutes)} />
        <StatusItem icon={Coffee} label="Break" value={formatDuration(totalBreakMin)} />
        <StatusItem icon={Clock} label="Remaining" value={formatDuration(remainingMinutes)} />
        <StatusItem
          icon={Clock}
          label="Overtime"
          value={formatDuration(Math.max(0, workedMinutes - 540))}
        />
      </div>
    </Card>
  );
}

function StatusItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Icon className="w-3.5 h-3.5" />
      {label}:{" "}
      <span className="font-medium text-foreground font-mono">{value}</span>
    </div>
  );
}
