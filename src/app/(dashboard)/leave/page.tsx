"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Calendar, Clock, Mail, CheckCircle2 } from "lucide-react";
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
import { toast } from "sonner";
import type { LeaveType } from "@/types";

export default function LeavePage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("leave");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [requestType, setRequestType] = useState("leave");

  useEffect(() => {
    const newType = searchParams.get("new");
    if (newType && ["leave", "wfh", "permission"].includes(newType)) {
      setRequestType(newType);
      setDialogOpen(true);
    }
  }, [searchParams]);
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
  const myName = user?.employee.name || "";

  const resetForm = () => {
    setStartDate("");
    setEndDate("");
    setReason("");
    setWfhDate("");
    setWfhReason("");
    setPermOutTime("");
    setPermReason("");
    setLeaveType("casual");
  };

  const handleSubmitLeave = () => {
    if (!startDate || !endDate || !reason) return;
    addLeaveRequest({
      employeeId: myId,
      leaveType,
      startDate,
      endDate,
      reason,
    });
    resetForm();
    setDialogOpen(false);
    toast.success("Leave request submitted", {
      description: `${leaveType} leave from ${format(new Date(startDate), "MMM d")} to ${format(new Date(endDate), "MMM d")} — sent to your manager and HR for approval.`,
    });
    toast("Email notification sent", {
      description: "Admin and HR have been notified via email about your leave request.",
      icon: <Mail className="w-4 h-4" />,
    });
  };

  const handleSubmitWfh = () => {
    if (!wfhDate || !wfhReason) return;
    addWfhRequest({ employeeId: myId, date: wfhDate, reason: wfhReason });
    resetForm();
    setDialogOpen(false);
    toast.success("WFH request submitted", {
      description: `Work from home for ${format(new Date(wfhDate), "MMM d, yyyy")} — sent to your manager and HR for approval.`,
    });
    toast("Email notification sent", {
      description: "Admin and HR have been notified via email about your WFH request.",
      icon: <Mail className="w-4 h-4" />,
    });
  };

  const handleSubmitPermission = () => {
    if (!permOutTime || !permReason) return;
    addPermissionRequest({
      employeeId: myId,
      date: new Date().toISOString().slice(0, 10),
      outTime: permOutTime,
      reason: permReason,
    });
    resetForm();
    setDialogOpen(false);
    toast.success("Permission request submitted", {
      description: `Permission to leave at ${permOutTime} — sent to your manager and HR for approval.`,
    });
    toast("Email notification sent", {
      description: "Admin and HR have been notified via email about your permission request.",
      icon: <Mail className="w-4 h-4" />,
    });
  };

  const handleApprove = (type: "leave" | "wfh" | "permission", id: string, empName: string) => {
    updateRequestStatus(type, id, "approved", myId);
    toast.success(`Request approved`, {
      description: `${empName}'s ${type} request has been approved. They will be notified.`,
    });
    toast("Email notification sent", {
      description: `${empName} has been notified via email about the approval.`,
      icon: <Mail className="w-4 h-4" />,
    });
  };

  const handleReject = (type: "leave" | "wfh" | "permission", id: string, empName: string) => {
    updateRequestStatus(type, id, "rejected", myId);
    toast.error(`Request rejected`, {
      description: `${empName}'s ${type} request has been rejected. They will be notified.`,
    });
  };

  const filteredLeave = isRegularEmployee
    ? leaveRequests.filter((r) => r.employeeId === myId)
    : leaveRequests;
  const filteredWfh = isRegularEmployee
    ? wfhRequests.filter((r) => r.employeeId === myId)
    : wfhRequests;
  const filteredPerm = isRegularEmployee
    ? permissionRequests.filter((r) => r.employeeId === myId)
    : permissionRequests;

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
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium bg-primary hover:bg-teal-600 text-primary-foreground transition-colors cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            New request
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New request</DialogTitle>
            </DialogHeader>

            {/* Approval flow info */}
            <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Approval flow</p>
                <p className="mt-0.5">
                  Your request will be sent to your <strong>reporting manager</strong> and <strong>HR</strong> for approval.
                  Admin will also receive an email notification.
                </p>
              </div>
            </div>

            <Tabs value={requestType} onValueChange={setRequestType} className="mt-1">
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
            {isRegularEmployee ? "My leave" : "Leave requests"} (
            {filteredLeave.length})
          </TabsTrigger>
          <TabsTrigger value="wfh">WFH ({filteredWfh.length})</TabsTrigger>
          <TabsTrigger value="permission">
            Permission ({filteredPerm.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leave" className="mt-4 space-y-2">
          {filteredLeave.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground text-sm">No leave requests yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Click &quot;New request&quot; to apply for leave.</p>
            </Card>
          )}
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
                      onClick={() => handleApprove("leave", req.id, emp.name)}
                      className="h-7 bg-primary hover:bg-teal-600 text-primary-foreground text-xs"
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject("leave", req.id, emp.name)}
                      className="h-7 text-xs"
                    >
                      Reject
                    </Button>
                  </div>
                )}
                {req.status === "approved" && (
                  <p className="text-[11px] text-status-present mt-2 pl-12">
                    Approved
                  </p>
                )}
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="wfh" className="mt-4 space-y-2">
          {filteredWfh.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground text-sm">No WFH requests yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Click &quot;New request&quot; and select the WFH tab to apply.</p>
            </Card>
          )}
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
                      onClick={() => handleApprove("wfh", req.id, emp.name)}
                      className="h-7 bg-primary hover:bg-teal-600 text-primary-foreground text-xs"
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject("wfh", req.id, emp.name)}
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
          {filteredPerm.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground text-sm">No permission requests yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Click &quot;New request&quot; and select the Permission tab to apply.</p>
            </Card>
          )}
          {filteredPerm.map((req) => {
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
                      onClick={() => handleApprove("permission", req.id, emp.name)}
                      className="h-7 bg-primary hover:bg-teal-600 text-primary-foreground text-xs"
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject("permission", req.id, emp.name)}
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
