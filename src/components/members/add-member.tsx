"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { addVirtualMember } from "@/app/actions/member.action";
import { SectionContainer } from "@/components/shared/section-container";
import { StatusMessage } from "@/components/shared/status-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddMemberProps {
  groupId: string;
}

export function AddMember({ groupId }: AddMemberProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    setError(null);
    startTransition(async () => {
      const result = await addVirtualMember(groupId, trimmed);

      if (result.success) {
        setName("");
        router.refresh();
      } else {
        setError(result.error ?? "Failed to add member");
      }
    });
  };

  return (
    <SectionContainer>
      <div className="flex gap-4 md:gap-6">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Member's name"
          disabled={isPending}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
        />
        <Button
          type="button"
          onClick={handleAdd}
          disabled={isPending || !name.trim()}
        >
          <Plus className="size-4" />
          Add
        </Button>
      </div>
      {error && (
        <StatusMessage tone="error" className="mt-2">
          {error}
        </StatusMessage>
      )}
    </SectionContainer>
  );
}
