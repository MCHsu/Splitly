"use client";

import { useRouter } from "next/navigation";
import { LogOutIcon, ChevronsUpDown } from "lucide-react";

import { UserAvatar } from "@/components/shared/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut, useSession } from "@/lib/auth-client";

function GuestIdentityRow() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="pointer-events-none">
          <UserAvatar name="Guest" />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">Guest</span>
            <span className="truncate text-xs text-muted-foreground">
              Not signed in
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function AvatarDropdown() {
  const { isMobile } = useSidebar();
  const { data: session } = useSession();
  const user = session?.user ?? null;
  const isAnonymous = !!user?.isAnonymous;
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    router.push("/auth");
  };

  if (isAnonymous) {
    return <GuestIdentityRow />;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvatar name={user?.name} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "top"}
            align="center"
            sideOffset={4}
          >
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOutIcon />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
