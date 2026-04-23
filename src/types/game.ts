export type Protein =
  | "chicken"
  | "beef"
  | "pork"
  | "seafood"
  | "vegetarian"
  | "mixed";

export type CarbBase = "rice" | "noodles" | "bread" | "potato" | "none";

export type Region =
  | "east_asian"
  | "south_asian"
  | "middle_eastern"
  | "european"
  | "latin_american"
  | "north_american"
  | "african";

export type CourseType = "main" | "side" | "snack" | "dessert";

export type MatchStatus = "match" | "no_match" | "partial";

export type GameMode = "daily" | "practice";

export interface Dish {
  id: string;
  name: string;
  protein: Protein;
  carbBase: CarbBase;
  region: Region;
  courseType: CourseType;
}

export interface GuessFeedback {
  protein: MatchStatus;
  carbBase: MatchStatus;
  region: MatchStatus;
  courseType: MatchStatus;
}

export interface GuessResult {
  dishId: string;
  feedback: GuessFeedback;
}

export interface StoredGameState {
  mode: GameMode;
  dateKey: string;
  targetDishId: string;
  guesses: GuessResult[];
  isComplete: boolean;
  didWin: boolean;
}

export interface GameStats {
  gamesPlayed: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
}
