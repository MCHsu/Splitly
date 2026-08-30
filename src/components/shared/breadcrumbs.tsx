import Link from "next/link";
import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

export type Crumb = {
  label: string;
  href?: string;
  shrink?: boolean;
};

interface BreadcrumbsProps {
  items: Crumb[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <Breadcrumb className="w-full min-w-0 overflow-hidden">
      <BreadcrumbList className="w-full min-w-0 flex-nowrap overflow-hidden">
        {items.map((crumb, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={`${crumb.label}-${index}`}>
              {index > 0 && <BreadcrumbSeparator className="shrink-0" />}
              <BreadcrumbItem
                className={cn(
                  crumb.shrink
                    ? "max-w-full min-w-0 shrink overflow-hidden"
                    : "shrink-0",
                )}
              >
                {isLast || !crumb.href ? (
                  <BreadcrumbPage
                    className={cn(
                      "first-letter:uppercase",
                      crumb.shrink ? "block min-w-0 truncate" : undefined,
                    )}
                  >
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={crumb.href}
                      className={cn(
                        "first-letter:uppercase",
                        crumb.shrink ? "block min-w-0 truncate" : undefined,
                      )}
                    >
                      {crumb.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
