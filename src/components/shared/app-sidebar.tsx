import { Plus, Users } from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { AvatarDropdown } from "@/components/shared/avatar-dropdown";
import { GuestAuthCta } from "@/components/shared/guest-auth-cta";
import { LogoText } from "@/components/shared/logo-text";
import { getAuthSession } from "@/lib/queries/auth.query";

const allNavItems = [
  {
    title: "New Group",
    url: "/groups/new",
    icon: Plus,
    guestHidden: true,
  },
  {
    title: "My Groups",
    url: "/groups",
    icon: Users,
    guestHidden: false,
  },
] as const;

export async function AppSidebar() {
  const session = await getAuthSession();
  const isGuest = Boolean(session?.user?.isAnonymous);

  const navItems = allNavItems.filter((item) => !isGuest || !item.guestHidden);

  return (
    <Sidebar>
      <SidebarHeader className="pb4 px-4 pt-6">
        <LogoText />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon strokeWidth={2.5} />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-3 p-2">
        {isGuest ? <GuestAuthCta /> : null}
        <AvatarDropdown />
      </SidebarFooter>
    </Sidebar>
  );
}
