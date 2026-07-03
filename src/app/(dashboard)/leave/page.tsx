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
import { getEmployee, getInitials } from "@/lib/mock-data";
import { useAuth, isManager } from "@/lib/auth-context";
import { useAppStore } from "@/lib/app-store";
import { format } from "date-fns";
import type { LeaveType } from "@/types";

export default function LeavePage() {
  const [activeTab, setActiveTab] = useState("leave");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<LeaveType>("casual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [wfhDate, setWfhDate] = useState("");
  const [wfhReason, setWfhReason] = useState("");
  const [permOutTime, setPermOutTime] = useState("");
  const [permReason, setPermReason] = useState("");

  const { user } = useAuth();
  const {
    leaveRequests,
    wfhRequests,
    permissionRequests,
    addLeaveRequest,
    addWfhRequest,
    addPermissionRequest,
    updateRequestStatus,
  } = useAppStore();

  const canApprove = user ? isManager(user.role) : false;
  const isRegularEmployee = user ? user.role === "employee" : true;
  const myId = user?.employee.id || "";

  const handleSubmitLeave = () => {
    if (!startDate || !endDate || !reason) return;
    addLeaveRequest({
      employeeId: myId,
      leaveType,
      startDate,
      endDate,
      reason,
    });
    setStartDate("");
    setEndDate("");
    setReason("");
    setDialogOpen(false);
  };

  const handleSubmitWfh = () => {
    if (!wfhDate || !wfhReason) return;
    addWfhRequest({ employeeId: myId, date: wfhDate, reason: wfhReason });
    setWfhDate("");
    setWfhReason("");
    setDialogOpen(false);
  };

  const handleSubmitPermission = () => {
    if (!permOutTime || !permReason) return;
    addPermissionRequest({
      employeeId: myId,
      date: new Date().toISOString().slice(0, 10),
      outTime: permOutTime,
      reason: permReason,
    });
    setPermOutTime("");
    setPermReason("");
    setDialogOpen(false);
  };

  const filteredLeave = isRegularEmployee ? leaveRequests.filter(r => r.employeeId === myId) : leaveRequests;
  const filteredWfh = isRegularEmployee ? wfhRequests.filter(r => r.employeeId === myId) : wfhRequests;
  const filteredPerm = isRegularEmployee ? permissionRequests.filter(r => r.employeeId === myId) : permissionRequests;

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
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium bg-primary hover:bg-teal-600 text-primary-foreground transition-colors cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            New request
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New request</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="leave" className="mt-2">
              <TabsList className="w-full">
                <TabsTrigger value="leave" className="flex-1">
                  Leave
                </TabsTrigger>
                <TabsTrigger value="wfh" className="flex-1">
                  WFH
                </TabsTrigger>
                <TabsTrigger value="permission" className="flex-1">
                  Permission
                </TabsTrigger>
              </TabsList>
              <TabsContent value="leave" className="space-y-4 pt-2">
                <div>
                  <Label>Leave type</Label>
                  <Select
                    value={leaveType}
                    onValueChange={(v) => setLeaveType(v as LeaveType)}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
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
                    <Input
                      type="date"
                      className="mt-1.5"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>End date</Label>
                    <Input
                      type="date"
                      className="mt-1.5"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label>Reason</Label>
                  <Textarea
                    placeholder="Briefly describe the reason..."
                    className="mt-1.5"
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleSubmitLeave}
                  disabled={!startDate || !endDate || !reason}
                  className="w-full bg-primary hover:bg-teal-600 text-primary-foreground"
                >
                  Submit leave request
                </Button>
              </TabsContent>
              <TabsContent value="wfh" className="space-y-4 pt-2">
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    className="mt-1.5"
                    value={wfhDate}
                    onChange={(e) => setWfhDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Reason</Label>
                  <Textarea
                    placeholder="Why do you need to work from home?"
                    className="mt-1.5"
                    rows={3}
                    value={wfhReason}
                    onChange={(e) => setWfhReason(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleSubmitWfh}
                  disabled={!wfhDate || !wfhReason}
                  className="w-full bg-primary hover:bg-teal-600 text-primary-foreground"
                >
                  Submit WFH request
                </Button>
              </TabsContent>
              <TabsContent value="permission" className="space-y-4 pt-2">
                <div>
                  <Label>Out time</Label>
                  <Input
                    type="time"
                    className="mt-1.5"
                    value={permOutTime}
                    onChange={(e) => setPermOutTime(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Reason</Label>
                  <Textarea
                    placeholder="Reason for permission..."
                    className="mt-1.5"
                    rows={3}
                    value={permReason}
                    onChange={(e) => setPermReason(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleSubmitPermission}
                  disabled={!permOutTime || !permReason}
                  className="w-full bg-primary hover:bg-teal-600 text-primary-foreground"
                >
                  Submit permission request
                </Button>
              </TabsContent>
            </Tabs>
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
                style={{ width: `${(lb.used / lb.total) * 100}%` }}
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
            {isRegularEmployee ? "My leave" : "Leave requests"} ({filteredLeave.length})
          </TabsTrigger>
          <TabsTrigger value="wfh">WFH ({filteredWfh.length})</TabsTrigger>
          <TabsTrigger value="permission">
            Permission ({filteredPerm.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leave" className="mt-4 space-y-2">
          {filteredLeave.map((req) => {
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
                        <span className="capitalize">
                          {req.leaveType} leave
                        </span>
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
                {req.status === "pending" && canApprove && (
                  <div className="flex gap-2 mt-3 pl-12">
                    <Button
                      size="sm"
                      onClick={() =>
                        updateRequestStatus("leave", req.id, "approved", myId)
                      }
                      className="h-7 bg-primary hover:bg-teal-600 text-primary-foreground text-xs"
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateRequestStatus("leave", req.id, "rejected", myId)
                      }
                      className="h-7 text-xs"
                    >
                      Reject
                    </Button>
                  </div>
                )}
                {req.status !== "pending" && req.status === "approved" && (
                  <p className="text-[11px] text-status-present mt-2 pl-12">
                    Approved
                  </p>
                )}
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="wfh" className="mt-4 space-y-2">
          {filteredWfh.map((req) => {
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
                {req.status === "pending" && canApprove && (
                  <div className="flex gap-2 mt-3 pl-12">
                    <Button
                      size="sm"
                      onClick={() =>
                        updateRequestStatus("wfh", req.id, "approved", myId)
                      }
                      className="h-7 bg-primary hover:bg-teal-600 text-primary-foreground text-xs"
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateRequestStatus("wfh", req.id, "rejected", myId)
                      }
                      className="h-7 text-xs"
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="permission" className="mt-4 space-y-2">
          {filteredPerm.map((req) => {
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
                {req.status === "pending" && canApprove && (
                  <div className="flex gap-2 mt-3 pl-12">
                    <Button
                      size="sm"
                      onClick={() =>
                        updateRequestStatus(
                          "permission",
                          req.id,
                          "approved",
                          myId
                        )
                      }
                      className="h-7 bg-primary hover:bg-teal-600 text-primary-foreground text-xs"
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateRequestStatus(
                          "permission",
                          req.id,
                          "rejected",
                          myId
                        )
                      }
                      className="h-7 text-xs"
                    >
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
