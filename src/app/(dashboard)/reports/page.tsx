"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { employees, getInitials } from "@/lib/mock-data";

const monthlyData = employees.slice(0, 8).map((emp) => ({
  employee: emp,
  present: Math.floor(Math.random() * 4) + 18,
  absent: Math.floor(Math.random() * 3),
  late: Math.floor(Math.random() * 4),
  leave: Math.floor(Math.random() * 3),
  wfh: Math.floor(Math.random() * 4),
  halfDay: Math.floor(Math.random() * 2),
  workingHours: `${150 + Math.floor(Math.random() * 30)}h`,
  overtime: `${Math.floor(Math.random() * 10)}h`,
}));

export default function ReportsPage() {
  const [period, setPeriod] = useState("monthly");
  const [month, setMonth] = useState("july-2026");

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-medium">Reports</h1>
          <p className="text-sm text-muted-foreground">
            Attendance and workforce reports
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Avg attendance
          </p>
          <p className="text-2xl font-medium font-mono text-primary mt-1">
            92%
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Total working hrs
          </p>
          <p className="text-2xl font-medium font-mono mt-1">1,847h</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Total overtime
          </p>
          <p className="text-2xl font-medium font-mono text-status-halfday mt-1">
            42h
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Leave taken
          </p>
          <p className="text-2xl font-medium font-mono text-status-leave mt-1">
            18
          </p>
        </Card>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <Tabs value={period} onValueChange={setPeriod} className="flex-1">
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="july-2026">July 2026</SelectItem>
            <SelectItem value="june-2026">June 2026</SelectItem>
            <SelectItem value="may-2026">May 2026</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead className="text-center">Present</TableHead>
              <TableHead className="text-center">Absent</TableHead>
              <TableHead className="text-center">Late</TableHead>
              <TableHead className="text-center">Leave</TableHead>
              <TableHead className="text-center">WFH</TableHead>
              <TableHead className="text-center">Working hrs</TableHead>
              <TableHead className="text-center">Overtime</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {monthlyData.map((row) => (
              <TableRow key={row.employee.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                        {getInitials(row.employee.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {row.employee.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {row.employee.department}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center font-mono text-sm text-status-present">
                  {row.present}
                </TableCell>
                <TableCell className="text-center font-mono text-sm text-status-absent">
                  {row.absent}
                </TableCell>
                <TableCell className="text-center font-mono text-sm text-status-late">
                  {row.late}
                </TableCell>
                <TableCell className="text-center font-mono text-sm text-status-leave">
                  {row.leave}
                </TableCell>
                <TableCell className="text-center font-mono text-sm text-status-wfh">
                  {row.wfh}
                </TableCell>
                <TableCell className="text-center font-mono text-sm">
                  {row.workingHours}
                </TableCell>
                <TableCell className="text-center font-mono text-sm">
                  {row.overtime}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
