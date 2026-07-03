import { cn } from "@/lib/utils";
import { statusConfig, approvalStatusConfig } from "@/lib/mock-data";
import type { AttendanceStatus, ApprovalStatus } from "@/types";

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || {
    label: status,
    bg: "bg-muted",
    text: "text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "text-[11px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap",
        config.bg,
        config.text
      )}
    >
      {config.label}
    </span>
  );
}

export function ApprovalBadge({ status }: { status: ApprovalStatus }) {
  const config = approvalStatusConfig[status];
  return (
    <span
      className={cn(
        "text-[11px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap",
        config.bg,
        config.text
      )}
    >
      {config.label}
    </span>
  );
}
