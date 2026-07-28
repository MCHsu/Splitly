import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/shared/site-header";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { PageContainer } from "@/components/shared/page-container";

export default function GeneralLayout({
  children,
  breadcrumb,
}: {
  children: React.ReactNode;
  breadcrumb: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader>{breadcrumb}</SiteHeader>
        <div className="flex flex-1 flex-col">
          <PageContainer>{children}</PageContainer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
