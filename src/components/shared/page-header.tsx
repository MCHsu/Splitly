import type { ReactNode } from "react";

import { BackButton } from "@/components/shared/back-button";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  showBackButton?: boolean;
}

export function PageHeader({
  title,
  subtitle,
  actions,
  showBackButton = true,
}: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:mb-12">
      <div
        className={cn(
          "grid gap-2 md:gap-3",
          showBackButton ? "grid-cols-[auto_1fr]" : "grid-cols-1",
        )}
      >
        {showBackButton ? (
          <BackButton className="col-start-1 row-start-1 h-full w-auto" />
        ) : null}

        <div
          className={cn(
            "row-start-1 flex flex-1 items-start justify-between gap-6 sm:gap-8 lg:gap-10",
            showBackButton ? "col-start-2" : "col-start-1",
          )}
        >
          <h1 className="min-w-0 flex-1 text-2xl font-bold wrap-break-word first-letter:uppercase md:text-4xl">
            {title}
          </h1>

          {actions ? (
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              {actions}
            </div>
          ) : null}
        </div>

        {subtitle ? (
          <p
            className={cn(
              "row-start-2 text-sm text-muted-foreground sm:text-base",
              showBackButton ? "col-start-2" : "col-start-1",
            )}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}
