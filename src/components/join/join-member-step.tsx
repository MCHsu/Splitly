"use client";

import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export type UnclaimedMember = {
  id: string;
  name: string;
};

interface JoinMemberStepProps {
  members: UnclaimedMember[];
  selectedMemberId: string | null;
  onSelect: (memberId: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function JoinMemberStep({
  members,
  selectedMemberId,
  onSelect,
  onSubmit,
  isSubmitting,
}: JoinMemberStepProps) {
  if (members.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        No open names. Ask the owner to add you, then come back.
      </p>
    );
  }

  const selectedName = members.find((m) => m.id === selectedMemberId)?.name;

  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      <div
        role="radiogroup"
        aria-label="Open seats"
        className="flex flex-col gap-2"
      >
        {members.map((member) => {
          const selected = member.id === selectedMemberId;

          return (
            <button
              key={member.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelect(member.id)}
              disabled={isSubmitting}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border bg-background px-4 py-3 text-left transition-all",
                "hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                selected && "border-primary ring-2 ring-primary",
              )}
            >
              <UserAvatar name={member.name} size="lg" />
              <span className="truncate font-medium">{member.name}</span>
            </button>
          );
        })}
      </div>

      <Button
        type="button"
        size="lg"
        className="w-full font-medium"
        disabled={!selectedMemberId || isSubmitting}
        onClick={onSubmit}
      >
        {isSubmitting && <Spinner />}
        {selectedName ? `Join as ${selectedName}` : "Join group"}
      </Button>
    </div>
  );
}
