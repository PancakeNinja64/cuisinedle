import { MatchStatus } from "@/types/game";

interface ResultBadgeProps {
  label: string;
  status: MatchStatus;
}

const STATUS_STYLES: Record<MatchStatus, string> = {
  match: "bg-emerald-600 text-white border-emerald-500",
  partial: "bg-amber-500 text-white border-amber-400",
  no_match: "bg-zinc-200 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700",
};

export function ResultBadge({ label, status }: ResultBadgeProps) {
  return (
    <span
      className={`inline-flex min-h-10 items-center justify-center rounded-lg border px-2 py-2 text-center text-xs font-semibold uppercase tracking-wide ${STATUS_STYLES[status]}`}
    >
      {label}
    </span>
  );
}
