"use client";

import { useState } from "react";
import { Plus, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApprovalBadge } from "@/components/ui/status-badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  leaveRequests,
  wfhRequests,
  permissionRequests,
  getEmployee,
  getInitials,
} from "@/lib/mock-data";
import { format } from "date-fns";

export default function LeavePage() {
  const [activeTab, setActiveTab] = useState("leave");

  const leaveBalance = [
    { type: "Casual", total: 12, used: 4, remaining: 8 },
    { type: "Sick", total: 10, used: 2, remaining: 8 },
    { type: "Earned", total: 15, used: 0, remaining: 15 },
    { type: "Paid", total: 10, used: 1, remaining: 9 },
  ];

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-medium">Leave management</h1>
          <p className="text-sm text-muted-foreground">
            Manage leave, WFH, and permission requests
          </p>
        </div>
        <Dialog>
          <DialogTrigger className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium bg-primary hover:bg-teal-600 text-primary-foreground transition-colors cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            New request
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New leave request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Leave type</Label>
                <Select>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">Casual leave</SelectItem>
                    <SelectItem value="sick">Sick leave</SelectItem>
                    <SelectItem value="earned">Earned leave</SelectItem>
                    <SelectItem value="paid">Paid leave</SelectItem>
                    <SelectItem value="unpaid">Unpaid leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Start date</Label>
                  <Input type="date" className="mt-1.5" />
                </div>
                <div>
                  <Label>End date</Label>
                  <Input type="date" className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label>Reason</Label>
                <Textarea
                  placeholder="Briefly describe the reason..."
                  className="mt-1.5"
                  rows={3}
                />
              </div>
              <Button className="w-full bg-primary hover:bg-teal-600 text-primary-foreground">
                Submit request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Leave balance cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {leaveBalance.map((lb) => (
          <Card key={lb.type} className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {lb.type} leave
            </p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-medium font-mono text-primary">
                {lb.remaining}
              </span>
              <span className="text-xs text-muted-foreground">
                / {lb.total}
              </span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full mt-2">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{
                  width: `${(lb.used / lb.total) * 100}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {lb.used} used
            </p>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="leave">
            Leave requests ({leaveRequests.length})
          </TabsTrigger>
          <TabsTrigger value="wfh">
            WFH ({wfhRequests.length})
          </TabsTrigger>
          <TabsTrigger value="permission">
            Permission ({permissionRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leave" className="mt-4 space-y-2">
          {leaveRequests.map((req) => {
            const emp = getEmployee(req.employeeId);
            if (!emp) return null;
            return (
              <Card key={req.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                        {getInitials(emp.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{emp.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {emp.department} &middot;{" "}
                        <span className="capitalize">{req.leaveType} leave</span>
                      </p>
                    </div>
                  </div>
                  <ApprovalBadge status={req.status} />
                </div>
                <div className="flex items-center gap-4 mt-3 pl-12 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(req.startDate), "MMM d")}
                    {req.startDate !== req.endDate &&
                      ` — ${format(new Date(req.endDate), "MMM d")}`}
                  </span>
                  <span>&middot;</span>
                  <span>{req.reason}</span>
                </div>
                {req.status === "pending" && (
                  <div className="flex gap-2 mt-3 pl-12">
                    <Button
                      size="sm"
                      className="h-7 bg-primary hover:bg-teal-600 text-primary-foreground text-xs"
                    >
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      Reject
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="wfh" className="mt-4 space-y-2">
          {wfhRequests.map((req) => {
            const emp = getEmployee(req.employeeId);
            if (!emp) return null;
            return (
              <Card key={req.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9">
                      <AvatarFallback className="bg-status-wfh-bg text-status-wfh-text text-xs font-medium">
                        {getInitials(emp.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{emp.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {emp.department} &middot; Work from home
                      </p>
                    </div>
                  </div>
                  <ApprovalBadge status={req.status} />
                </div>
                <div className="flex items-center gap-4 mt-3 pl-12 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(req.date), "MMM d, yyyy")}
                  </span>
                  <span>&middot;</span>
                  <span>{req.reason}</span>
                </div>
                {req.status === "pending" && (
                  <div className="flex gap-2 mt-3 pl-12">
                    <Button
                      size="sm"
                      className="h-7 bg-primary hover:bg-teal-600 text-primary-foreground text-xs"
                    >
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      Reject
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="permission" className="mt-4 space-y-2">
          {permissionRequests.map((req) => {
            const emp = getEmployee(req.employeeId);
            if (!emp) return null;
            return (
              <Card key={req.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9">
                      <AvatarFallback className="bg-status-permission-bg text-status-permission-text text-xs font-medium">
                        {getInitials(emp.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{emp.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {emp.department} &middot; Permission
                      </p>
                    </div>
                  </div>
                  <ApprovalBadge status={req.status} />
                </div>
                <div className="flex items-center gap-4 mt-3 pl-12 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {req.outTime}
                    {req.inTime && ` — ${req.inTime}`}
                  </span>
                  {req.duration && (
                    <>
                      <span>&middot;</span>
                      <span>{req.duration} min</span>
                    </>
                  )}
                  <span>&middot;</span>
                  <span>{req.reason}</span>
                </div>
                {req.status === "pending" && (
                  <div className="flex gap-2 mt-3 pl-12">
                    <Button
                      size="sm"
                      className="h-7 bg-primary hover:bg-teal-600 text-primary-foreground text-xs"
                    >
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      Reject
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
