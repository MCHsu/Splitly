"use client";

import { useState } from "react";
import { Link } from "lucide-react";

import { ActionSection } from "@/components/shared/action-section";

interface InviteLinkProps {
  inviteCode: string;
}

export function InviteLink({ inviteCode }: InviteLinkProps) {
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
    <ActionSection
      title="Group invite link"
      description="Anyone with this link can join the group"
      actionLabel={copied ? "Copied!" : "Copy"}
      icon={<Link />}
      onAction={handleCopy}
      variant="default"
    />
  );
}
