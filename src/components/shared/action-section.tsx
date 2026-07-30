import type { ReactNode } from "react";

import { SectionContainer } from "@/components/shared/section-container";
import { Button } from "@/components/ui/button";

interface ActionSectionProps {
  title: string;
  description: string;
  actionLabel: string;
  icon?: ReactNode;
  onAction?: () => void;
  disabled?: boolean;
}

export function ActionSection({
  title,
  description,
  actionLabel,
  icon,
  onAction,
  disabled,
}: ActionSectionProps) {
  return (
    <SectionContainer>
      <div className="flex items-center justify-between gap-4 md:gap-6">
        {icon && (
          <div className="flex size-4 items-center gap-2 md:size-5 lg:size-6">
            {icon}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <Button
          variant="outline"
          disabled={disabled}
          onClick={onAction}
          className="shrink-0 border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          {actionLabel}
        </Button>
      </div>
    </SectionContainer>
  );
}
