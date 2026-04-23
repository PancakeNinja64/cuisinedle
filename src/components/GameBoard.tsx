"use client";

import { useEffect, useMemo, useState } from "react";
import { DISHES } from "@/data/dishes";
import {
  buildShareText,
  compareDishes,
  createGuessResult,
  findDishByQuery,
  getTargetDish,
  getTodayKey,
  isWinningGuess,
  MAX_GUESSES,
} from "@/lib/game";
import {
  clearGameState,
  loadGameState,
  loadStats,
  loadThemePreference,
  saveGameState,
  saveStats,
  saveThemePreference,
  updateStatsForCompletedGame,
} from "@/lib/storage";
import { GameMode, GameStats, GuessResult, StoredGameState } from "@/types/game";
import { GuessInput } from "@/components/GuessInput";
import { GuessRow } from "@/components/GuessRow";
import { Header } from "@/components/Header";
import { InstructionsModal } from "@/components/InstructionsModal";

function getOrCreateGameState(mode: GameMode, todayKey: string): StoredGameState {
  const savedState = loadGameState(mode);
  if (savedState && ((mode === "daily" && savedState.dateKey === todayKey) || mode === "practice")) {
    return savedState;
  }

  const targetDish = getTargetDish(mode, todayKey);
  const newState: StoredGameState = {
    mode,
    dateKey: todayKey,
    targetDishId: targetDish.id,
    guesses: [],
    isComplete: false,
    didWin: false,
  };
  saveGameState(mode, newState);
  return newState;
}

export function GameBoard() {
  const [mode, setMode] = useState<GameMode>("daily");
  const [gameState, setGameState] = useState<StoredGameState>(() =>
    getOrCreateGameState("daily", getTodayKey()),
  );
  const [message, setMessage] = useState<string>("");
  const [stats, setStats] = useState<GameStats>(() => loadStats());
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = loadThemePreference();
    if (savedTheme) {
      return savedTheme;
    }
    if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });

  const todayKey = getTodayKey();
  const targetDishId = gameState.targetDishId;
  const guesses = gameState.guesses;
  const isComplete = gameState.isComplete;
  const didWin = gameState.didWin;

  const targetDish = useMemo(
    () => DISHES.find((dish) => dish.id === targetDishId) ?? null,
    [targetDishId],
  );

  function startNewGame(gameMode: GameMode, clearExisting = true): StoredGameState {
    if (clearExisting) {
      clearGameState(gameMode);
    }

    const nextState = getOrCreateGameState(gameMode, todayKey);
    return nextState;
  }

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    saveThemePreference(theme);
  }, [theme]);

  const handleModeChange = (nextMode: GameMode) => {
    setMode(nextMode);
    const nextState = getOrCreateGameState(nextMode, todayKey);
    setGameState(nextState);
    setMessage("");
  };

  const finalizeGame = (nextGuesses: GuessResult[], won: boolean) => {
    const nextState: StoredGameState = {
      mode,
      dateKey: todayKey,
      targetDishId,
      guesses: nextGuesses,
      isComplete: true,
      didWin: won,
    };
    setGameState(nextState);
    setMessage(won ? "You solved it!" : "Out of guesses.");

    const nextStats = updateStatsForCompletedGame(stats, won);
    setStats(nextStats);
    saveStats(nextStats);

    saveGameState(mode, nextState);
  };

  const handleSubmitGuess = (dishName: string) => {
    if (isComplete || !targetDish) {
      return;
    }

    const guessDish = findDishByQuery(dishName);
    if (!guessDish) {
      setMessage("Pick a valid dish from the list.");
      return;
    }

    if (guesses.some((guess) => guess.dishId === guessDish.id)) {
      setMessage("You already guessed that dish.");
      return;
    }

    const feedback = compareDishes(guessDish, targetDish);
    const nextGuess = createGuessResult(guessDish.id, feedback);
    const nextGuesses = [...guesses, nextGuess];
    const won = isWinningGuess(feedback);
    const outOfGuesses = nextGuesses.length >= MAX_GUESSES;

    const nextState: StoredGameState = {
      mode,
      dateKey: todayKey,
      targetDishId,
      guesses: nextGuesses,
      isComplete: false,
      didWin: false,
    };
    setGameState(nextState);
    setMessage("");

    if (won || outOfGuesses) {
      finalizeGame(nextGuesses, won);
      return;
    }

    saveGameState(mode, nextState);
  };

  const handleShareResults = async () => {
    const text = buildShareText(mode, todayKey, guesses, didWin);
    try {
      await navigator.clipboard.writeText(text);
      setMessage("Results copied to clipboard.");
    } catch {
      setMessage("Clipboard access failed. Copy manually.");
    }
  };

  const remainingGuesses = MAX_GUESSES - guesses.length;
  const winRate =
    stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;

  return (
    <>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-8">
        <Header
          mode={mode}
          onModeChange={handleModeChange}
          onOpenInstructions={() => setIsInstructionsOpen(true)}
          theme={theme}
          onToggleTheme={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
        />

        <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              {mode === "daily"
                ? `Daily dish for ${todayKey}`
                : "Practice mode: endless rounds, same rules."}
            </p>
            <p className="rounded-lg bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
              Remaining guesses: {remainingGuesses}
            </p>
          </div>

          <GuessInput dishes={DISHES} disabled={isComplete} onSubmitGuess={handleSubmitGuess} />

          {message ? (
            <p className="mt-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {message}
            </p>
          ) : null}

          {isComplete && targetDish ? (
            <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/40">
              <p className="text-sm text-zinc-700 dark:text-zinc-200">
                {didWin
                  ? `Nice work. The dish was ${targetDish.name}.`
                  : `The dish was ${targetDish.name}. Better luck next round.`}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleShareResults}
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
                >
                  Share Results
                </button>
                {mode === "practice" ? (
                  <button
                    type="button"
                    onClick={() => {
                      const nextState = startNewGame("practice");
                      setGameState(nextState);
                      setMessage("");
                    }}
                    className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  >
                    New Practice Game
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}
        </section>

        <section className="grid grid-cols-2 gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:grid-cols-4">
          <StatCard label="Games" value={stats.gamesPlayed.toString()} />
          <StatCard label="Wins" value={stats.wins.toString()} />
          <StatCard label="Win Rate" value={`${winRate}%`} />
          <StatCard label="Streak" value={`${stats.currentStreak}/${stats.maxStreak}`} />
        </section>

        <section className="space-y-2">
          <div className="grid grid-cols-5 gap-2 px-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            <span>Dish</span>
            <span>Protein</span>
            <span>Carb/Base</span>
            <span>Region</span>
            <span>Course</span>
          </div>
          {guesses.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              No guesses yet. Start with a dish from the search box.
            </div>
          ) : (
            guesses.map((guess, index) => {
              const dish = DISHES.find((item) => item.id === guess.dishId);
              if (!dish) {
                return null;
              }
              return <GuessRow key={`${guess.dishId}-${index}`} guess={guess} dish={dish} />;
            })
          )}
        </section>
      </div>

      <InstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
      />
    </>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-zinc-50 px-3 py-2 dark:bg-zinc-800/50">
      <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-100">{value}</p>
    </div>
  );
}
