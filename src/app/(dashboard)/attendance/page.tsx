"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  employees,
  todayAttendance,
  getEmployee,
  getInitials,
} from "@/lib/mock-data";
import { format } from "date-fns";

export default function AttendancePage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentDate, setCurrentDate] = useState(new Date());

  const records = todayAttendance.filter((rec) => {
    const emp = getEmployee(rec.employeeId);
    if (!emp) return false;
    const matchesSearch = emp.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || rec.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-medium">Attendance</h1>
          <p className="text-sm text-muted-foreground">
            Daily attendance records
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1 bg-card border border-border rounded-lg px-2">
          <button
            onClick={() =>
              setCurrentDate(
                (d) => new Date(d.getTime() - 86400000)
              )
            }
            className="p-1.5 hover:bg-muted rounded"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium px-3 min-w-[140px] text-center">
            {format(currentDate, "EEE, MMM d, yyyy")}
          </span>
          <button
            onClick={() =>
              setCurrentDate(
                (d) => new Date(d.getTime() + 86400000)
              )
            }
            className="p-1.5 hover:bg-muted rounded"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="present">Present</SelectItem>
            <SelectItem value="absent">Absent</SelectItem>
            <SelectItem value="late">Late</SelectItem>
            <SelectItem value="half-day">Half day</SelectItem>
            <SelectItem value="wfh">WFH</SelectItem>
            <SelectItem value="casual-leave">On leave</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Check in</TableHead>
              <TableHead>Check out</TableHead>
              <TableHead>Working hrs</TableHead>
              <TableHead>Break hrs</TableHead>
              <TableHead>Overtime</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((rec) => {
              const emp = getEmployee(rec.employeeId);
              if (!emp) return null;
              return (
                <TableRow key={rec.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                          {getInitials(emp.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Link href={`/employees/${emp.id}`} className="text-sm font-medium hover:text-primary transition-colors">{emp.name}</Link>
                        <p className="text-xs text-muted-foreground">
                          {emp.department}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {rec.checkIn || "—"}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {rec.checkOut || "—"}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {rec.workingHours ? `${rec.workingHours}h` : "—"}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {rec.breakHours ? `${rec.breakHours}h` : "—"}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {rec.overtime ? `${rec.overtime}h` : "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={rec.status} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
