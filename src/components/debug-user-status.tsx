"use client";

import { useUser } from "@/providers/user-provider";

export function DebugUserStatus() {
  const { user, isAuthenticated, isAnonymous, isLoading } = useUser();

  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white rounded-lg text-xs z-50 font-mono">
      <div>Loading: {isLoading ? "true" : "false"}</div>
      <div>Auth: {isAuthenticated ? "true" : "false"}</div>
      <div>Anon: {isAnonymous ? "true" : "false"}</div>
      <div>ID: {user?.id}</div>
      <div>Email: {user?.email}</div>
    </div>
  );
}
