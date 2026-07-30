"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { joinGroup } from "@/app/actions/member.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

interface JoinGroupClientProps {
  inviteCode: string;
  groupName: string;
}

export function JoinGroupClient({
  inviteCode,
  groupName,
}: JoinGroupClientProps) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isPending && !session && !isSigningIn) {
      const createAnonymousSession = async () => {
        setIsSigningIn(true);
        try {
          await authClient.signIn.anonymous();
        } catch (err) {
          console.error("Failed to create anonymous session:", err);
          setError("Failed to start guest session. Please try again.");
        } finally {
          setIsSigningIn(false);
        }
      };

      void createAnonymousSession();
    }
  }, [isPending, session, isSigningIn]);

  useEffect(() => {
    if (session?.user?.name && session.user.name !== "Anonymous") {
      setDisplayName(session.user.name);
    }
  }, [session?.user?.name]);

  const isReady = !isPending && !isSigningIn && !!session;
  const isLoading = isPending || isSigningIn;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!displayName.trim()) {
      setError("Please enter your name");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await joinGroup(inviteCode, displayName.trim());

      if (result.success && result.groupId) {
        router.push(`/groups/${result.groupId}`);
      } else {
        setError(result.error ?? "Failed to join group");
      }
    } catch {
      setError("Failed to join group");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="fixed inset-0 bg-black/40" aria-hidden />

      <Card className="relative z-10 w-full max-w-md">
        <CardHeader>
          <CardTitle>Join {groupName}</CardTitle>
          <CardDescription>
            Enter your name to start splitting bills
          </CardDescription>
        </CardHeader>

        {isLoading ? (
          <CardContent className="flex justify-center py-8">
            <Spinner className="size-8" />
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Your name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Alex"
                  disabled={!isReady || isSubmitting}
                  autoFocus
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={!isReady || isSubmitting}
              >
                {isSubmitting ? "Joining..." : "Join Group"}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
