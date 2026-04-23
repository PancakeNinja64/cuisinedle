import { FormEvent, useMemo, useState } from "react";
import { Dish } from "@/types/game";

interface GuessInputProps {
  dishes: Dish[];
  disabled: boolean;
  onSubmitGuess: (dishName: string) => void;
}

export function GuessInput({ dishes, disabled, onSubmitGuess }: GuessInputProps) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return dishes.slice(0, 8);
    }

    return dishes
      .filter((dish) => dish.name.toLowerCase().includes(normalized))
      .slice(0, 8);
  }, [dishes, query]);

  const submitGuess = (dishName: string) => {
    onSubmitGuess(dishName);
    setQuery("");
    setShowSuggestions(false);
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitGuess(query);
  };

  return (
    <div className="relative">
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search a dish (e.g. Chicken Biryani)"
          disabled={disabled}
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:ring-emerald-900/40 dark:disabled:bg-zinc-800"
        />
        <button
          type="submit"
          disabled={disabled}
          className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          Guess
        </button>
      </form>

      {showSuggestions && !disabled && suggestions.length > 0 ? (
        <div className="absolute z-20 mt-2 w-full rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          {suggestions.map((dish) => (
            <button
              type="button"
              key={dish.id}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => submitGuess(dish.name)}
              className="flex w-full items-center px-4 py-2 text-left text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              {dish.name}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
