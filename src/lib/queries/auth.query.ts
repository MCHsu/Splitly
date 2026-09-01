import "server-only";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { cache } from "react";

import { User } from "@/generated/prisma/client";

export const getAuthSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
});

export const getCurrentUserId = cache(async (): Promise<string | null> => {
  const session = await getAuthSession();
  return session?.user.id ?? null;
});

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const userId = await getCurrentUserId();

  if (!userId) {
    return null;
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!currentUser) {
    return null;
  }

  return currentUser;
});
