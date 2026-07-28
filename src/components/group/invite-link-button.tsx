"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InviteLinkButtonProps {
  inviteCode: string;
}

export function InviteLinkButton({ inviteCode }: InviteLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/join/${inviteCode}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy invite link");
    }
  };

  return (
    <Button variant="outline" onClick={handleCopy}>
      {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
      {copied ? "Copied!" : "Invite"}
    </Button>
  );
}
