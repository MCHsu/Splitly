"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  // 1. 動態計算目前在哪個標籤頁，用來賦予 <Tabs> 正確的 value
  const activeTab =
    TABS.find((tab) => {
      const href = `${base}/${tab.segment}`;
      return pathname === href || pathname.startsWith(`${href}/`);
    })?.segment || TABS[0].segment; // 預設給第一個 tab 防呆

  return (
    <div className="w-full">
      <Tabs
        value={activeTab}
        className={cn("border-b border-gray-200", className)}
      >
        {/* 2. 加上 h-auto 和 flex-wrap，確保手機版畫面太小時標籤可以像原本一樣自然換行 */}
        <TabsList variant="line" className="gap-4 md:gap-6 lg:gap-8">
          {TABS.map((tab) => {
            const href = `${base}/${tab.segment}`;

            return (
              // 3. 使用 asChild，讓 shadcn 的樣式套用到底下的 Next.js Link 元件
              <TabsTrigger
                key={tab.segment}
                value={tab.segment}
                className="border-0 group-data-horizontal/tabs:after:-bottom-[0.5px] text-sm md:text-base font-medium data-[state=active]:font-bold"
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
