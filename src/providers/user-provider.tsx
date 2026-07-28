"use client";

import { authClient, signIn } from "@/lib/auth-client";
import { User } from "better-auth";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  use,
  useMemo,
} from "react";

interface UserContextData {
  // user: User;
  user: User | null;
  isAuthenticated: boolean;
  isAnonymous: boolean;
  isLoading: boolean;
}

const UserContext = createContext<UserContextData | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending, error } = authClient.useSession();
  // const [isSigningIn, setIsSigningIn] = useState(false);

  const userContextData: UserContextData = useMemo(
    () => ({
      user: session?.user || null,
      // user: session?.user
      isAuthenticated: !!session?.user && !session?.user.isAnonymous,
      isAnonymous: !!session?.user?.isAnonymous,
      isLoading: isPending, // || isSigningIn,
    }),
    [session, isPending],
  );

  // useEffect(() => {
  //   // If we're not loading, have no session, and aren't already trying to sign in...
  //   if (!isPending && !session && !isSigningIn) {
  //     // Check if we should auto-create an anonymous session
  //     // For now, let's do it immediately for all guests
  //     const createAnonymousSession = async () => {
  //       setIsSigningIn(true);
  //       try {
  //         await authClient.signIn.anonymous();
  //       } catch (err) {
  //         console.error("Failed to create anonymous session:", err);
  //       } finally {
  //         setIsSigningIn(false);
  //       }
  //     };

  //     createAnonymousSession();
  //   }
  // }, [isPending, session, isSigningIn]);

  return <UserContext value={userContextData}>{children}</UserContext>;
}

export function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
