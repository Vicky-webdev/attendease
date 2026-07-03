"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { LeaveRequest, PermissionRequest, WfhRequest, ApprovalStatus } from "@/types";
import { leaveRequests as initialLeave, wfhRequests as initialWfh, permissionRequests as initialPerm } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";

interface ChatMessage {
  id: string;
  from: string;
  fromName: string;
  to: string;
  text: string;
  time: string;
  read: boolean;
}

interface Notification {
  id: string;
  type: "leave" | "permission" | "wfh" | "approval" | "system" | "chat";
  title: string;
  message: string;
  time: string;
  read: boolean;
  forRoles: ("super-admin" | "hr" | "manager" | "employee")[];
  employeeId?: string;
}

interface AppStoreValue {
  leaveRequests: LeaveRequest[];
  wfhRequests: WfhRequest[];
  permissionRequests: PermissionRequest[];
  addLeaveRequest: (req: Omit<LeaveRequest, "id" | "status">) => void;
  addWfhRequest: (req: Omit<WfhRequest, "id" | "status">) => void;
  addPermissionRequest: (req: Omit<PermissionRequest, "id" | "status">) => void;
  updateRequestStatus: (type: "leave" | "wfh" | "permission", id: string, status: ApprovalStatus, approvedBy?: string) => void;
  notifications: Notification[];
  addNotification: (n: Omit<Notification, "id" | "time" | "read">) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: (role: string, empId?: string) => number;
  chatMessages: ChatMessage[];
  addChatMessage: (msg: Omit<ChatMessage, "id" | "time" | "read">) => void;
  markChatRead: (fromId: string, toId: string) => void;
  onlineUsers: Set<string>;
  setUserOnline: (id: string, online: boolean) => void;
}

const AppStoreContext = createContext<AppStoreValue>(null!);

let idCounter = 100;
function nextId(prefix: string) {
  return `${prefix}${++idCounter}`;
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const { user, presence } = useAuth();
  const [leaveReqs, setLeaveReqs] = useState<LeaveRequest[]>(initialLeave);
  const [wfhReqs, setWfhReqs] = useState<WfhRequest[]>(initialWfh);
  const [permReqs, setPermReqs] = useState<PermissionRequest[]>(initialPerm);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "n1",
      type: "leave",
      title: "Leave request",
      message: "Raj Patel applied for casual leave (Jul 7–8)",
      time: new Date(Date.now() - 3600000).toISOString(),
      read: false,
      forRoles: ["super-admin", "hr", "manager"],
      employeeId: "3",
    },
    {
      id: "n2",
      type: "leave",
      title: "Leave request",
      message: "Naveen Krishnan applied for sick leave (Jul 10–11)",
      time: new Date(Date.now() - 7200000).toISOString(),
      read: false,
      forRoles: ["super-admin", "hr", "manager"],
      employeeId: "7",
    },
    {
      id: "n3",
      type: "leave",
      title: "Leave request",
      message: "Sara Kumar applied for earned leave (Jul 14–18)",
      time: new Date(Date.now() - 10800000).toISOString(),
      read: false,
      forRoles: ["super-admin", "hr", "manager"],
      employeeId: "2",
    },
    {
      id: "n4",
      type: "system",
      title: "System",
      message: "Welcome to AttendEase! Configure your company settings to get started.",
      time: new Date(Date.now() - 86400000).toISOString(),
      read: true,
      forRoles: ["super-admin", "hr", "manager", "employee"],
    },
  ]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "c1", from: "9", fromName: "Arjun Mehta", to: "1", text: "Please review the sprint tasks for this week", time: new Date(Date.now() - 3600000).toISOString(), read: true },
    { id: "c2", from: "1", fromName: "Vignesh Kumar", to: "9", text: "Sure, I'll check and update by EOD", time: new Date(Date.now() - 3000000).toISOString(), read: true },
    { id: "c3", from: "6", fromName: "Priya Desai", to: "1", text: "Hi Vignesh, your leave balance has been updated", time: new Date(Date.now() - 1800000).toISOString(), read: false },
  ]);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        if (presence === "online" || presence === "idle") {
          next.add(user.employee.id);
        } else {
          next.delete(user.employee.id);
        }
        return next;
      });
    }
  }, [user, presence]);

  const addLeaveRequest = useCallback((req: Omit<LeaveRequest, "id" | "status">) => {
    const newReq: LeaveRequest = { ...req, id: nextId("l"), status: "pending" };
    setLeaveReqs((prev) => [newReq, ...prev]);
    setNotifications((prev) => [
      {
        id: nextId("n"),
        type: "leave",
        title: "New leave request",
        message: `Leave request submitted: ${req.leaveType} leave (${req.startDate} to ${req.endDate})`,
        time: new Date().toISOString(),
        read: false,
        forRoles: ["super-admin", "hr", "manager"],
        employeeId: req.employeeId,
      },
      ...prev,
    ]);
  }, []);

  const addWfhRequest = useCallback((req: Omit<WfhRequest, "id" | "status">) => {
    const newReq: WfhRequest = { ...req, id: nextId("w"), status: "pending" };
    setWfhReqs((prev) => [newReq, ...prev]);
    setNotifications((prev) => [
      {
        id: nextId("n"),
        type: "wfh",
        title: "New WFH request",
        message: `WFH request for ${req.date}: ${req.reason}`,
        time: new Date().toISOString(),
        read: false,
        forRoles: ["super-admin", "hr", "manager"],
        employeeId: req.employeeId,
      },
      ...prev,
    ]);
  }, []);

  const addPermissionRequest = useCallback((req: Omit<PermissionRequest, "id" | "status">) => {
    const newReq: PermissionRequest = { ...req, id: nextId("p"), status: "pending" };
    setPermReqs((prev) => [newReq, ...prev]);
    setNotifications((prev) => [
      {
        id: nextId("n"),
        type: "permission",
        title: "Permission request",
        message: `Permission request: ${req.outTime} — ${req.reason}`,
        time: new Date().toISOString(),
        read: false,
        forRoles: ["super-admin", "hr", "manager"],
        employeeId: req.employeeId,
      },
      ...prev,
    ]);
  }, []);

  const updateRequestStatus = useCallback(
    (type: "leave" | "wfh" | "permission", id: string, status: ApprovalStatus, approvedBy?: string) => {
      if (type === "leave") {
        setLeaveReqs((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status, approvedBy } : r))
        );
      } else if (type === "wfh") {
        setWfhReqs((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        );
      } else {
        setPermReqs((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        );
      }
      const actionLabel = status === "approved" ? "approved" : "rejected";
      let targetEmployeeId: string | undefined;
      if (type === "leave") {
        targetEmployeeId = leaveReqs.find((r) => r.id === id)?.employeeId;
      } else if (type === "wfh") {
        targetEmployeeId = wfhReqs.find((r) => r.id === id)?.employeeId;
      } else {
        targetEmployeeId = permReqs.find((r) => r.id === id)?.employeeId;
      }
      setNotifications((prev) => [
        {
          id: nextId("n"),
          type: "approval",
          title: `Request ${actionLabel}`,
          message: `Your ${type} request has been ${actionLabel}`,
          time: new Date().toISOString(),
          read: false,
          forRoles: ["super-admin", "hr", "manager", "employee"],
          employeeId: targetEmployeeId,
        },
        ...prev,
      ]);
    },
    []
  );

  const addNotification = useCallback(
    (n: Omit<Notification, "id" | "time" | "read">) => {
      setNotifications((prev) => [
        { ...n, id: nextId("n"), time: new Date().toISOString(), read: false },
        ...prev,
      ]);
    },
    []
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadCount = useCallback(
    (role: string, empId?: string) => {
      return notifications.filter((n) => {
        if (n.read) return false;
        if (!n.forRoles.includes(role as any)) return false;
        if (role === "employee" && n.employeeId && n.employeeId !== empId) return false;
        return true;
      }).length;
    },
    [notifications]
  );

  const addChatMessage = useCallback(
    (msg: Omit<ChatMessage, "id" | "time" | "read">) => {
      setChatMessages((prev) => [
        ...prev,
        { ...msg, id: nextId("c"), time: new Date().toISOString(), read: false },
      ]);
    },
    []
  );

  const markChatRead = useCallback((fromId: string, toId: string) => {
    setChatMessages((prev) =>
      prev.map((m) =>
        m.from === fromId && m.to === toId ? { ...m, read: true } : m
      )
    );
  }, []);

  const setUserOnline = useCallback((id: string, online: boolean) => {
    setOnlineUsers((prev) => {
      const next = new Set(prev);
      if (online) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  return (
    <AppStoreContext.Provider
      value={{
        leaveRequests: leaveReqs,
        wfhRequests: wfhReqs,
        permissionRequests: permReqs,
        addLeaveRequest,
        addWfhRequest,
        addPermissionRequest,
        updateRequestStatus,
        notifications,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        unreadCount,
        chatMessages,
        addChatMessage,
        markChatRead,
        onlineUsers,
        setUserOnline,
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore() {
  return useContext(AppStoreContext);
}
