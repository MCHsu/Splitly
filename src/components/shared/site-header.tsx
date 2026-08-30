import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface SiteHeaderProps {
  children: React.ReactNode;
}

export function SiteHeader({ children }: SiteHeaderProps) {
  return (
    <header className="flex h-(--header-height) min-w-0 shrink-0 items-center gap-2 overflow-hidden border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full min-w-0 items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 shrink-0" />
        <Separator
          orientation="vertical"
          className="mx-2 shrink-0 data-[orientation=vertical]:h-4"
        />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </header>
  );
}
