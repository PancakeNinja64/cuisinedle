import { GameMode, GameStats, StoredGameState } from "@/types/game";

const GAME_STATE_PREFIX = "dishdle:state";
const STATS_KEY = "dishdle:stats";
const THEME_KEY = "dishdle:theme";

export type ThemePreference = "light" | "dark";

export const getStateKey = (mode: GameMode): string => `${GAME_STATE_PREFIX}:${mode}`;

export const loadGameState = (mode: GameMode): StoredGameState | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(getStateKey(mode));
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredGameState;
  } catch {
    return null;
  }
};

export const saveGameState = (mode: GameMode, state: StoredGameState): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getStateKey(mode), JSON.stringify(state));
};

export const clearGameState = (mode: GameMode): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(getStateKey(mode));
};

const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  wins: 0,
  currentStreak: 0,
  maxStreak: 0,
};

export const loadStats = (): GameStats => {
  if (typeof window === "undefined") {
    return DEFAULT_STATS;
  }

  const raw = window.localStorage.getItem(STATS_KEY);
  if (!raw) {
    return DEFAULT_STATS;
  }

  try {
    return { ...DEFAULT_STATS, ...(JSON.parse(raw) as Partial<GameStats>) };
  } catch {
    return DEFAULT_STATS;
  }
};

export const saveStats = (stats: GameStats): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

export const updateStatsForCompletedGame = (
  currentStats: GameStats,
  didWin: boolean,
): GameStats => {
  const gamesPlayed = currentStats.gamesPlayed + 1;
  const wins = didWin ? currentStats.wins + 1 : currentStats.wins;
  const currentStreak = didWin ? currentStats.currentStreak + 1 : 0;
  const maxStreak = Math.max(currentStats.maxStreak, currentStreak);

  return { gamesPlayed, wins, currentStreak, maxStreak };
};

export const loadThemePreference = (): ThemePreference | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(THEME_KEY);
  if (raw === "light" || raw === "dark") {
    return raw;
  }
  return null;
};

export const saveThemePreference = (theme: ThemePreference): void => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(THEME_KEY, theme);
};
