/**
 * The workspace catalogue, in one place.
 *
 * Two surfaces read this list — the grouped grid on /workspaces and the
 * spotlight search on /services — and they have to name the same things, so
 * neither keeps its own copy.
 */
export const WORKSPACE_GROUPS = [
  { group: "Hair & Barber", items: ["Barber Chairs", "Hair Stations"] },
  {
    group: "Nail & Beauty",
    items: ["Nail Desks", "Pedicure Lounges", "Makeup Stations"],
  },
  {
    group: "Wellness & Studios",
    items: ["Massage Rooms", "Treatment Rooms", "Private Studios"],
  },
] as const;

/** Every category, flattened, in the order the grid shows them. */
export const WORKSPACE_CATEGORIES: string[] = WORKSPACE_GROUPS.flatMap(
  (group) => [...group.items],
);
