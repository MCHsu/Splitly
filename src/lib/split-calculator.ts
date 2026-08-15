/**
 * Split totalCents evenly across `count` people.
 * Base share is floor-divided; leftover cents (+1 each) go to the first
 * `remainder` people in order.
 */
export function distributeEvenly(
  totalCents: number,
  count: number,
): number[] {
  if (totalCents <= 0 || count <= 0) {
    return [];
  }

  const base = Math.floor(totalCents / count);
  const remainder = totalCents % count;

  return Array.from(
    { length: count },
    (_, i) => base + (i < remainder ? 1 : 0),
  );
}
