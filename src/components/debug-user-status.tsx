"use client";

import { useUser } from "@/providers/user-provider";

export function DebugUserStatus() {
  const { user, isAuthenticated, isAnonymous, isLoading } = useUser();

  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="fixed right-4 bottom-4 z-50 rounded-lg bg-black/80 p-4 font-mono text-xs text-white">
      <div>Loading: {isLoading ? "true" : "false"}</div>
      <div>Auth: {isAuthenticated ? "true" : "false"}</div>
      <div>Anon: {isAnonymous ? "true" : "false"}</div>
      <div>ID: {user?.id}</div>
      <div>Email: {user?.email}</div>
    </div>
  );
}
