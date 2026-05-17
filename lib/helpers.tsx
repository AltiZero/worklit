export function fmtMoney(n: number) {
  return "$" + n.toLocaleString();
}

export function relativeTime(date: Date) {
  const ago = Date.now() - date.getTime();
  const mins = Math.floor(ago / 60000);
  const hrs = Math.floor(ago / 3600000);
  const days = Math.floor(ago / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return `${days}d ago`;
}

export function statusLabel(status: string) {
  switch (status) {
    case "ACTIVE": return "Active";
    case "PENDING_REVIEW": return "Awaiting";
    case "DRAFT": return "Draft";
    case "COMPLETED": return "Done";
    default: return status;
  }
}

export function StatusDot({ status }: { status: string }) {
  const color = status === "ACTIVE" ? "var(--green)" : "var(--text-soft)";
  return <span className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />;
}
