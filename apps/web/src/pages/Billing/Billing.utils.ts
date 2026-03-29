export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function buildStatusLabel(status: string): string {
  const map: Record<string, string> = {
    ACTIVE: "Active",
    TRIALING: "Trial",
    PAST_DUE: "Past Due",
    CANCELED: "Canceled",
    INACTIVE: "Inactive",
  };
  return map[status] ?? status;
}
