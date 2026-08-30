import type { ReactNode } from "react";

import { SectionContainer } from "@/components/shared/section-container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActionSectionProps {
  title: string;
  description: string;
  actionLabel: string;
  icon?: ReactNode;
  onAction?: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive";
}

export function ActionSection({
  title,
  description,
  actionLabel,
  icon,
  onAction,
  disabled,
  variant = "destructive",
}: ActionSectionProps) {
  return (
    <SectionContainer>
      <div className="flex items-center justify-between gap-4 md:gap-6">
        {icon && (
          <div className="flex size-4 shrink-0 items-center gap-2 md:size-5 lg:size-6">
            {icon}
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3 className="text-lg font-semibold md:text-xl">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <Button
          variant={variant === "destructive" ? "destructive" : "outline"}
          disabled={disabled}
          onClick={onAction}
          className="shrink-0"
        >
          {actionLabel}
        </Button>
      </div>
    </SectionContainer>
  );
}
