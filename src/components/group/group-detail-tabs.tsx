"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TABS = [
  { label: "Expense", segment: "expenses" },
  { label: "Balance", segment: "balance" },
  { label: "Member", segment: "members" },
  { label: "Group", segment: "group" },
] as const;

interface GroupDetailTabsProps {
  groupId: string;
  className?: string;
}

export function GroupDetailTabs({ groupId, className }: GroupDetailTabsProps) {
  const pathname = usePathname();
  const base = `/groups/${groupId}`;

  const activeTab =
    TABS.find((tab) => {
      const href = `${base}/${tab.segment}`;
      return pathname === href || pathname.startsWith(`${href}/`);
    })?.segment || TABS[0].segment;

  return (
    <div className="w-full">
      <Tabs value={activeTab} className={cn("border-b", className)}>
        <TabsList variant="line" className="gap-4 md:gap-6 lg:gap-8">
          {TABS.map((tab) => {
            const href = `${base}/${tab.segment}`;

            return (
              <TabsTrigger
                key={tab.segment}
                value={tab.segment}
                className="border-0 text-sm font-medium group-data-horizontal/tabs:after:-bottom-[0.5px] data-[state=active]:font-bold md:text-base"
                asChild
              >
                <Link href={href}>{tab.label}</Link>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
}
