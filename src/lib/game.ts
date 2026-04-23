import { DISHES } from "@/data/dishes";
import {
  Dish,
  GameMode,
  GuessFeedback,
  GuessResult,
  MatchStatus,
} from "@/types/game";

export const MAX_GUESSES = 6;

export const DATE_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const getTodayKey = (date = new Date()): string => DATE_FORMATTER.format(date);

export const getDailyDish = (dateKey: string): Dish => {
  const hash = Array.from(dateKey).reduce(
    (acc, char) => (acc * 31 + char.charCodeAt(0)) % 2147483647,
    7,
  );
  const index = hash % DISHES.length;
  return DISHES[index];
};

export const getTargetDish = (mode: GameMode, dateKey: string): Dish => {
  if (mode === "daily") {
    return getDailyDish(dateKey);
  }

  return DISHES[Math.floor(Math.random() * DISHES.length)];
};

export const findDishByQuery = (query: string): Dish | undefined => {
  const normalized = query.trim().toLowerCase();
  return DISHES.find((dish) => dish.name.toLowerCase() === normalized);
};

const compareValue = <T>(guessValue: T, targetValue: T): MatchStatus =>
  guessValue === targetValue ? "match" : "no_match";

export const compareDishes = (guess: Dish, target: Dish): GuessFeedback => ({
  protein: compareValue(guess.protein, target.protein),
  carbBase: compareValue(guess.carbBase, target.carbBase),
  region: compareValue(guess.region, target.region),
  courseType: compareValue(guess.courseType, target.courseType),
});

export const createGuessResult = (guessDishId: string, feedback: GuessFeedback): GuessResult => ({
  dishId: guessDishId,
  feedback,
});

export const isWinningGuess = (feedback: GuessFeedback): boolean =>
  Object.values(feedback).every((status) => status === "match");

export const normalizeLabel = (value: string): string =>
  value.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());

export const buildShareText = (
  mode: GameMode,
  dateKey: string,
  guesses: GuessResult[],
  didWin: boolean,
): string => {
  const title = mode === "daily" ? `Dishdle Daily ${dateKey}` : "Dishdle Practice";
  const score = didWin ? `${guesses.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;

  const lines = guesses.map((guess) => {
    const symbols = [
      guess.feedback.protein,
      guess.feedback.carbBase,
      guess.feedback.region,
      guess.feedback.courseType,
    ]
      .map((status) => {
        if (status === "match") {
          return "🟩";
        }

        if (status === "partial") {
          return "🟨";
        }

        return "⬛";
      })
      .join("");

    return symbols;
  });

  return [title, score, ...lines].join("\n");
};
