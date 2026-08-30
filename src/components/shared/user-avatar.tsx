"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const Avatar = dynamic(() => import("boring-avatars"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-muted" />,
});

interface UserAvatarProps {
  name?: string | null;
  size?: string;
  className?: string;
  showName?: boolean;
}

const BEAM_COLORS = ["#0db2ac", "#f5dd7e", "#fc8d4d", "#fc694d", "#faba32"];

// Map the size classNames used across call sites to the pixel size
// boring-avatars expects.
const SIZE_PX_MAP: Record<string, number> = {
  lg: 40,
  md: 28,
  sm: 24,
};

const DEFAULT_SIZE_PX = 32;

export function UserAvatar({
  name,
  size = "",
  className = "",
  showName = false,
}: UserAvatarProps) {
  const sizePx = SIZE_PX_MAP[size] ?? DEFAULT_SIZE_PX;

  return (
    <div className="flex flex-row items-center gap-3">
      <div
        className={cn(size, "shrink-0 overflow-hidden rounded-full", className)}
      >
        <Avatar
          variant="beam"
          name={name ?? "User"}
          colors={BEAM_COLORS}
          size={sizePx}
        />
      </div>
      {showName && (
        <span className="text-sm font-medium text-foreground sm:text-base">
          {name}
        </span>
      )}
    </div>
  );
}
