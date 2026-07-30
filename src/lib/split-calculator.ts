export type EvenSplitResult = {
  amountsInCents: number[];
  remainderInCents: number;
};

/**
 * Split totalCents evenly across `count` people.
 * Base share is floor-divided; leftover cents returned as remainder
 * for the caller to assign (typically to the first person).
 */
export function distributeEvenly(
  totalCents: number,
  count: number,
): EvenSplitResult {
  if (totalCents <= 0 || count <= 0) {
    return { amountsInCents: [], remainderInCents: 0 };
  }

  const base = Math.floor(totalCents / count);
  const remainderInCents = totalCents - base * count;

  return {
    amountsInCents: Array.from({ length: count }, () => base),
    remainderInCents,
  };
}
