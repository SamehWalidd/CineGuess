import { useState, useCallback, useMemo } from 'react';

const STORAGE_KEY = 'cineguess-session-stats';

const DEFAULT_STATS = {
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  bestScore: null,
  totalWinGuesses: 0,
  guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
};

function loadStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATS };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATS,
      ...parsed,
      guessDistribution: {
        ...DEFAULT_STATS.guessDistribution,
        ...(parsed.guessDistribution || {}),
      },
    };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

function saveStats(stats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function useSessionStats() {
  const [stats, setStats] = useState(loadStats);

  const recordGame = useCallback(({ won, guessCount }) => {
    setStats((prev) => {
      const next = {
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        wins: prev.wins + (won ? 1 : 0),
        losses: prev.losses + (won ? 0 : 1),
        guessDistribution: { ...prev.guessDistribution },
      };

      if (won && guessCount >= 1 && guessCount <= 6) {
        next.totalWinGuesses = prev.totalWinGuesses + guessCount;
        next.guessDistribution[guessCount] =
          (prev.guessDistribution[guessCount] || 0) + 1;
        if (prev.bestScore === null || guessCount < prev.bestScore) {
          next.bestScore = guessCount;
        }
      }

      saveStats(next);
      return next;
    });
  }, []);

  const winRate = useMemo(() => {
    if (stats.gamesPlayed === 0) return 0;
    return Math.round((stats.wins / stats.gamesPlayed) * 100);
  }, [stats.gamesPlayed, stats.wins]);

  const avgGuesses = useMemo(() => {
    if (stats.wins === 0) return null;
    return (stats.totalWinGuesses / stats.wins).toFixed(1);
  }, [stats.wins, stats.totalWinGuesses]);

  const maxDistribution = useMemo(() => {
    const values = Object.values(stats.guessDistribution);
    return Math.max(1, ...values);
  }, [stats.guessDistribution]);

  return {
    stats,
    winRate,
    avgGuesses,
    maxDistribution,
    recordGame,
  };
}
