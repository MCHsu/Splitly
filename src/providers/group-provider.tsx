"use client";

import React, { createContext, useContext } from "react";

interface GroupContextData {
  currency: string;
}

const GroupContext = createContext<GroupContextData | undefined>(undefined);

interface GroupProviderProps {
  children: React.ReactNode;
  currency: string;
}

export function GroupProvider({ children, currency }: GroupProviderProps) {
  return <GroupContext value={{ currency }}>{children}</GroupContext>;
}

export function useGroup() {
  const context = useContext(GroupContext);

  if (!context) {
    throw new Error("useGroup must be used within a GroupProvider");
  }

  return context;
}
