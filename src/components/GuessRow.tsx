import { Dish, GuessResult } from "@/types/game";
import { normalizeLabel } from "@/lib/game";
import { ResultBadge } from "@/components/ResultBadge";

interface GuessRowProps {
  guess: GuessResult;
  dish: Dish;
}

export function GuessRow({ guess, dish }: GuessRowProps) {
  return (
    <div className="grid grid-cols-1 gap-2 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm md:grid-cols-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center rounded-lg bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
        {dish.name}
      </div>
      <ResultBadge label={normalizeLabel(dish.protein)} status={guess.feedback.protein} />
      <ResultBadge label={normalizeLabel(dish.carbBase)} status={guess.feedback.carbBase} />
      <ResultBadge label={normalizeLabel(dish.region)} status={guess.feedback.region} />
      <ResultBadge
        label={normalizeLabel(dish.courseType)}
        status={guess.feedback.courseType}
      />
    </div>
  );
}
