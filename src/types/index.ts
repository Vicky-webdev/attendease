export type AttendanceStatus =
  | "present"
  | "absent"
  | "late"
  | "half-day"
  | "wfh"
  | "casual-leave"
  | "sick-leave"
  | "paid-leave"
  | "permission"
  | "holiday"
  | "weekend"
  | "outdoor-duty";

export type LeaveType =
  | "casual"
  | "sick"
  | "earned"
  | "paid"
  | "unpaid"
  | "maternity"
  | "paternity"
  | "compensatory";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export type UserRole = "super-admin" | "hr" | "manager" | "employee";

export type ShiftType =
  | "morning"
  | "general"
  | "evening"
  | "night"
  | "flexible";

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  reportingManager?: string;
  dateOfJoining: string;
  employmentType: "full-time" | "part-time" | "contract" | "intern";
  shift: ShiftType;
  officeLocation: string;
  workingDays: string[];
  status: "active" | "inactive" | "on-notice";
  avatarUrl?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
  workingHours?: number;
  breakHours?: number;
  overtime?: number;
  ipAddress?: string;
  device?: string;
  browser?: string;
  networkValidated: boolean;
}

export interface BreakLog {
  id: string;
  attendanceId: string;
  type: "tea" | "lunch" | "other";
  startTime: string;
  endTime?: string;
  duration?: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  halfDay?: "first" | "second";
  reason: string;
  status: ApprovalStatus;
  approvedBy?: string;
  attachment?: string;
}

export interface PermissionRequest {
  id: string;
  employeeId: string;
  date: string;
  outTime: string;
  inTime?: string;
  duration?: number;
  reason: string;
  status: ApprovalStatus;
}

export interface WfhRequest {
  id: string;
  employeeId: string;
  date: string;
  reason: string;
  status: ApprovalStatus;
}

export interface DashboardStats {
  totalEmployees: number;
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  wfh: number;
  halfDay: number;
}
