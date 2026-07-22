import type { Status } from "@/lib/constants";
import { STATUS_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_COLORS[status]
      )}
    >
      {status}
    </span>
  );
}
