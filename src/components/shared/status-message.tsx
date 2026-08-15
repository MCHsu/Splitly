import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type StatusTone = "error" | "success" | "warning";

const toneClasses: Record<StatusTone, string> = {
  error: "border-destructive/30 bg-destructive/10 text-destructive",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
};

interface StatusMessageProps extends ComponentProps<"div"> {
  tone?: StatusTone;
}

export function StatusMessage({
  tone = "error",
  className,
  children,
  ...props
}: StatusMessageProps) {
  return (
    <div
      role="status"
      data-slot="status-message"
      className={cn(
        "rounded-md border p-3 text-sm",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
