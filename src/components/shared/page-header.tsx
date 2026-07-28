import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    href: string;
    label: string;
    icon?: LucideIcon;
    className?: string;
  };
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  const Icon = action?.icon;

  return (
    <div className="flex flex-col gap-4 mb-6 lg:mb-12">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl md:text-4xl font-bold">{title}</h1>

        {action ? (
          <Button asChild className={cn("shrink-0", action.className)}>
            <Link href={action.href}>
              {Icon ? <Icon /> : null}
              {action.label}
            </Link>
          </Button>
        ) : null}
      </div>
      {subtitle ? <p className="text-gray-600">{subtitle}</p> : null}
    </div>
  );
}
