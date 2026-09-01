"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { GroupMemberWithUser } from "@/types/member";

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
  const membersContextData: MembersContextData = useMemo(
    () => ({
      members,
      activeMembers: members.filter((m) => m.isActive),
    }),
    [members],
  );

  return <MembersContext value={membersContextData}>{children}</MembersContext>;
}

export function useMembers() {
  const context = useContext(MembersContext);

  if (!context) {
    throw new Error("useMembers must be used within a MembersProvider");
  }

  return context;
}
