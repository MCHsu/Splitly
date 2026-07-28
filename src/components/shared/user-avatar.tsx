import Avatar from "boring-avatars";

import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name?: string | null;
  size?: string;
  className?: string;
}

const BEAM_COLORS = ["#0db2ac", "#f5dd7e", "#fc8d4d", "#fc694d", "#faba32"];

// Map the size classNames used across call sites to the pixel size
// boring-avatars expects.
const SIZE_PX_MAP: Record<string, number> = {
  "w-10 h-10": 40,
  sm: 24,
};

const DEFAULT_SIZE_PX = 32;

export function UserAvatar({
  name,
  size = "",
  className = "",
}: UserAvatarProps) {
  const sizePx = SIZE_PX_MAP[size] ?? DEFAULT_SIZE_PX;

  return (
    <div
      className={cn(
        size,
        "shrink-0 overflow-hidden rounded-full border border-gray-300",
        className,
      )}
    >
      <Avatar
        variant="beam"
        name={name ?? "User"}
        colors={BEAM_COLORS}
        size={sizePx}
      />
    </div>
  );
}
