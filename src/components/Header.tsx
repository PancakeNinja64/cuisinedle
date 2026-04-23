import { GameMode } from "@/types/game";

interface HeaderProps {
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
  onOpenInstructions: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function Header({
  mode,
  onModeChange,
  onOpenInstructions,
  theme,
  onToggleTheme,
}: HeaderProps) {
  return (
    <header className="w-full rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Dishdle
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Guess the hidden dish using cuisine metadata.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenInstructions}
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            How to Play
          </button>
          <button
            type="button"
            onClick={onToggleTheme}
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onModeChange("daily")}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            mode === "daily"
              ? "bg-emerald-600 text-white"
              : "border border-zinc-200 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          }`}
        >
          Daily Mode
        </button>
        <button
          type="button"
          onClick={() => onModeChange("practice")}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            mode === "practice"
              ? "bg-emerald-600 text-white"
              : "border border-zinc-200 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          }`}
        >
          Practice Mode
        </button>
      </div>
    </header>
  );
}
