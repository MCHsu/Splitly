"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { GroupMemberWithUser } from "@/lib/member";
import { useUser } from "@/providers/user-provider";

interface MembersContextData {
  members: GroupMemberWithUser[];
  activeMembers: GroupMemberWithUser[];
}

const MembersContext = createContext<MembersContextData | undefined>(undefined);

interface MembersProviderProps {
  children: React.ReactNode;
  members: GroupMemberWithUser[];
}

export function MembersProvider({ children, members }: MembersProviderProps) {
  const { user } = useUser();

  const membersContextData: MembersContextData = useMemo(() => {
    const sorted = [...members].sort((a, b) => {
      if (user && a.userId === user.id) return -1;
      if (user && b.userId === user.id) return 1;
      return a.name.localeCompare(b.name);
    });

    return {
      members: sorted,
      activeMembers: sorted.filter((m) => m.isActive),
    };
  }, [members, user]);

  return <MembersContext value={membersContextData}>{children}</MembersContext>;
}

export function useMembers() {
  const context = useContext(MembersContext);

  if (!context) {
    throw new Error("useMembers must be used within a MembersProvider");
  }

  return context;
}
