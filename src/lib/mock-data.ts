import type {
  Employee,
  AttendanceRecord,
  LeaveRequest,
  PermissionRequest,
  WfhRequest,
  BreakLog,
  AttendanceStatus,
  ApprovalStatus,
} from "@/types";

export const departments = [
  "Development",
  "Design",
  "QA",
  "HR",
  "Marketing",
  "Sales",
  "Finance",
  "Operations",
];

export const employees: Employee[] = [
  {
    id: "1",
    employeeId: "EMP001",
    name: "Vignesh Kumar",
    email: "vignesh@company.com",
    phone: "+91 98765 43210",
    department: "Development",
    designation: "Senior Developer",
    reportingManager: "Arjun Mehta",
    dateOfJoining: "2022-03-15",
    employmentType: "full-time",
    shift: "general",
    officeLocation: "Chennai",
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    status: "active",
  },
  {
    id: "2",
    employeeId: "EMP002",
    name: "Sara Kumar",
    email: "sara@company.com",
    phone: "+91 98765 43211",
    department: "Design",
    designation: "UI/UX Designer",
    reportingManager: "Vignesh Kumar",
    dateOfJoining: "2022-06-01",
    employmentType: "full-time",
    shift: "general",
    officeLocation: "Chennai",
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    status: "active",
  },
  {
    id: "3",
    employeeId: "EMP003",
    name: "Raj Patel",
    email: "raj@company.com",
    phone: "+91 98765 43212",
    department: "Development",
    designation: "Full Stack Developer",
    reportingManager: "Vignesh Kumar",
    dateOfJoining: "2023-01-10",
    employmentType: "full-time",
    shift: "general",
    officeLocation: "Chennai",
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    status: "active",
  },
  {
    id: "4",
    employeeId: "EMP004",
    name: "Maya Jayaram",
    email: "maya@company.com",
    phone: "+91 98765 43213",
    department: "QA",
    designation: "QA Lead",
    reportingManager: "Arjun Mehta",
    dateOfJoining: "2021-11-20",
    employmentType: "full-time",
    shift: "general",
    officeLocation: "Chennai",
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    status: "active",
  },
  {
    id: "5",
    employeeId: "EMP005",
    name: "Arun Singh",
    email: "arun@company.com",
    phone: "+91 98765 43214",
    department: "Development",
    designation: "Backend Developer",
    reportingManager: "Vignesh Kumar",
    dateOfJoining: "2023-04-01",
    employmentType: "full-time",
    shift: "general",
    officeLocation: "Chennai",
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    status: "active",
  },
  {
    id: "6",
    employeeId: "EMP006",
    name: "Priya Desai",
    email: "priya@company.com",
    phone: "+91 98765 43215",
    department: "HR",
    designation: "HR Manager",
    dateOfJoining: "2021-08-15",
    employmentType: "full-time",
    shift: "general",
    officeLocation: "Chennai",
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    status: "active",
  },
  {
    id: "7",
    employeeId: "EMP007",
    name: "Naveen Krishnan",
    email: "naveen@company.com",
    phone: "+91 98765 43216",
    department: "Marketing",
    designation: "Marketing Executive",
    reportingManager: "Priya Desai",
    dateOfJoining: "2023-07-01",
    employmentType: "full-time",
    shift: "general",
    officeLocation: "Chennai",
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    status: "active",
  },
  {
    id: "8",
    employeeId: "EMP008",
    name: "Deepa Francis",
    email: "deepa@company.com",
    phone: "+91 98765 43217",
    department: "Finance",
    designation: "Accountant",
    reportingManager: "Priya Desai",
    dateOfJoining: "2022-09-10",
    employmentType: "full-time",
    shift: "general",
    officeLocation: "Chennai",
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    status: "active",
  },
  {
    id: "9",
    employeeId: "EMP009",
    name: "Arjun Mehta",
    email: "arjun@company.com",
    phone: "+91 98765 43218",
    department: "Development",
    designation: "Tech Lead",
    dateOfJoining: "2020-05-01",
    employmentType: "full-time",
    shift: "general",
    officeLocation: "Chennai",
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    status: "active",
  },
  {
    id: "10",
    employeeId: "EMP010",
    name: "Lakshmi Rajan",
    email: "lakshmi@company.com",
    phone: "+91 98765 43219",
    department: "Sales",
    designation: "Sales Manager",
    dateOfJoining: "2021-02-01",
    employmentType: "full-time",
    shift: "general",
    officeLocation: "Chennai",
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    status: "active",
  },
  {
    id: "11",
    employeeId: "EMP011",
    name: "Karthik Sundaram",
    email: "karthik@company.com",
    phone: "+91 98765 43220",
    department: "Operations",
    designation: "Operations Manager",
    dateOfJoining: "2022-01-15",
    employmentType: "full-time",
    shift: "morning",
    officeLocation: "Chennai",
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    status: "active",
  },
  {
    id: "12",
    employeeId: "EMP012",
    name: "Ananya Sharma",
    email: "ananya@company.com",
    phone: "+91 98765 43221",
    department: "Design",
    designation: "Graphic Designer",
    reportingManager: "Sara Kumar",
    dateOfJoining: "2024-01-08",
    employmentType: "full-time",
    shift: "general",
    officeLocation: "Chennai",
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    status: "active",
  },
];

const todayStr = new Date().toISOString().slice(0, 10);

export const todayAttendance: AttendanceRecord[] = [
  { id: "a1", employeeId: "1", date: todayStr, checkIn: "09:00", checkOut: undefined, status: "present", workingHours: 8, breakHours: 1, overtime: 0, networkValidated: true },
  { id: "a2", employeeId: "2", date: todayStr, checkIn: "09:02", checkOut: undefined, status: "present", workingHours: 7.5, breakHours: 1, overtime: 0, networkValidated: true },
  { id: "a3", employeeId: "3", date: todayStr, checkIn: "09:18", checkOut: undefined, status: "late", workingHours: 7, breakHours: 1, overtime: 0, networkValidated: true },
  { id: "a4", employeeId: "4", date: todayStr, checkIn: "08:55", checkOut: undefined, status: "present", workingHours: 8.5, breakHours: 1, overtime: 0.5, networkValidated: true },
  { id: "a5", employeeId: "5", date: todayStr, status: "wfh", networkValidated: false },
  { id: "a6", employeeId: "6", date: todayStr, status: "casual-leave", networkValidated: false },
  { id: "a7", employeeId: "7", date: todayStr, checkIn: "09:05", checkOut: undefined, status: "present", workingHours: 8, breakHours: 1, overtime: 0, networkValidated: true },
  { id: "a8", employeeId: "8", date: todayStr, checkIn: "09:32", checkOut: undefined, status: "half-day", workingHours: 4, breakHours: 0.5, overtime: 0, networkValidated: true },
  { id: "a9", employeeId: "9", date: todayStr, checkIn: "08:45", checkOut: undefined, status: "present", workingHours: 9, breakHours: 1, overtime: 1, networkValidated: true },
  { id: "a10", employeeId: "10", date: todayStr, checkIn: "09:10", checkOut: undefined, status: "present", workingHours: 8, breakHours: 1, overtime: 0, networkValidated: true },
  { id: "a11", employeeId: "11", date: todayStr, checkIn: "06:00", checkOut: undefined, status: "present", workingHours: 8, breakHours: 1, overtime: 0, networkValidated: true },
  { id: "a12", employeeId: "12", date: todayStr, status: "wfh", networkValidated: false },
];

export const leaveRequests: LeaveRequest[] = [
  { id: "l1", employeeId: "3", leaveType: "casual", startDate: "2026-07-07", endDate: "2026-07-08", reason: "Personal work", status: "pending" },
  { id: "l2", employeeId: "6", leaveType: "casual", startDate: "2026-07-03", endDate: "2026-07-03", reason: "Family function", status: "approved", approvedBy: "9" },
  { id: "l3", employeeId: "7", leaveType: "sick", startDate: "2026-07-10", endDate: "2026-07-11", reason: "Doctor appointment and recovery", status: "pending" },
  { id: "l4", employeeId: "2", leaveType: "earned", startDate: "2026-07-14", endDate: "2026-07-18", reason: "Vacation", status: "pending" },
  { id: "l5", employeeId: "12", leaveType: "casual", startDate: "2026-06-30", endDate: "2026-06-30", reason: "Personal errands", status: "approved", approvedBy: "9" },
  { id: "l6", employeeId: "8", leaveType: "sick", startDate: "2026-06-25", endDate: "2026-06-26", reason: "Fever", status: "approved", approvedBy: "6" },
  { id: "l7", employeeId: "10", leaveType: "casual", startDate: "2026-06-20", endDate: "2026-06-20", reason: "Bank work", status: "rejected" },
];

export const wfhRequests: WfhRequest[] = [
  { id: "w1", employeeId: "5", date: "2026-07-03", reason: "Internet installation at home", status: "approved" },
  { id: "w2", employeeId: "12", date: "2026-07-03", reason: "Plumber visit scheduled", status: "approved" },
  { id: "w3", employeeId: "3", date: "2026-07-04", reason: "Expecting a delivery", status: "pending" },
];

export const permissionRequests: PermissionRequest[] = [
  { id: "p1", employeeId: "2", date: "2026-07-02", outTime: "14:30", inTime: "15:15", duration: 45, reason: "Bank visit", status: "approved" },
  { id: "p2", employeeId: "7", date: "2026-07-03", outTime: "11:00", inTime: undefined, duration: undefined, reason: "Courier pickup", status: "pending" },
];

export const holidays = [
  { date: "2026-01-01", name: "New Year", type: "national" as const },
  { date: "2026-01-15", name: "Pongal", type: "festival" as const },
  { date: "2026-01-26", name: "Republic Day", type: "national" as const },
  { date: "2026-03-30", name: "Holi", type: "festival" as const },
  { date: "2026-04-14", name: "Tamil New Year", type: "festival" as const },
  { date: "2026-05-01", name: "May Day", type: "national" as const },
  { date: "2026-08-15", name: "Independence Day", type: "national" as const },
  { date: "2026-10-02", name: "Gandhi Jayanti", type: "national" as const },
  { date: "2026-10-20", name: "Diwali", type: "festival" as const },
  { date: "2026-11-01", name: "Diwali Holiday", type: "company" as const },
  { date: "2026-12-25", name: "Christmas", type: "national" as const },
];

export function getEmployee(id: string): Employee | undefined {
  return employees.find((e) => e.id === id);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const statusConfig: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  present: { label: "Present", bg: "bg-status-present-bg", text: "text-status-present-text" },
  absent: { label: "Absent", bg: "bg-status-absent-bg", text: "text-status-absent-text" },
  late: { label: "Late", bg: "bg-status-late-bg", text: "text-status-late-text" },
  "half-day": { label: "Half day", bg: "bg-status-halfday-bg", text: "text-status-halfday-text" },
  wfh: { label: "WFH", bg: "bg-status-wfh-bg", text: "text-status-wfh-text" },
  "casual-leave": { label: "Casual leave", bg: "bg-status-leave-bg", text: "text-status-leave-text" },
  "sick-leave": { label: "Sick leave", bg: "bg-status-leave-bg", text: "text-status-leave-text" },
  "paid-leave": { label: "Paid leave", bg: "bg-status-leave-bg", text: "text-status-leave-text" },
  permission: { label: "Permission", bg: "bg-status-permission-bg", text: "text-status-permission-text" },
  holiday: { label: "Holiday", bg: "bg-status-holiday-bg", text: "text-status-holiday-text" },
  weekend: { label: "Weekend", bg: "bg-muted", text: "text-muted-foreground" },
  "outdoor-duty": { label: "Outdoor duty", bg: "bg-status-wfh-bg", text: "text-status-wfh-text" },
};

export const approvalStatusConfig: Record<
  ApprovalStatus,
  { label: string; bg: string; text: string }
> = {
  pending: { label: "Pending", bg: "bg-status-halfday-bg", text: "text-status-halfday-text" },
  approved: { label: "Approved", bg: "bg-status-present-bg", text: "text-status-present-text" },
  rejected: { label: "Rejected", bg: "bg-status-absent-bg", text: "text-status-absent-text" },
};
