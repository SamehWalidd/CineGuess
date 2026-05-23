import { useState, useCallback } from 'react';
import { getRandomMovie, checkTitle } from '../services/api';

const CLUE_SEQUENCE = [
  { key: 'genre',     label: 'Genre'     },
  { key: 'decade',    label: 'Decade'    },
  { key: 'director',  label: 'Director'  },
  { key: 'leadActor', label: 'Lead Actor'},
  { key: 'plotHint',  label: 'Plot Hint' },
];

const MAX_ATTEMPTS = 6;

export function useGameState() {
  const [movie, setMovie]               = useState(null);
  const [revealedCount, setRevealedCount] = useState(1);
  const [attempts, setAttempts]         = useState([]);
  const [status, setStatus]             = useState('idle');
  const [error, setError]               = useState(null);

  const startNewGame = useCallback(async () => {
    setStatus('loading');
    setError(null);
    setAttempts([]);
    setRevealedCount(0);
    setMovie(null);

    try {
      const data = await getRandomMovie();
      setMovie(data);
      setStatus('playing');
    } catch {
      setError('Could not load a movie. Check your connection and try again.');
      setStatus('idle');
    }
  }, []);

  const submitGuess = useCallback(async (guess) => {
    if (!movie || status !== 'playing') return;

    const nextAttempts = [...attempts, guess];
    setAttempts(nextAttempts);

    try {
      const isLastAttempt = nextAttempts.length >= MAX_ATTEMPTS;
      const result = await checkTitle(guess, movie._id, isLastAttempt);

      if (result.correct) {
        setMovie(prev => {
          const poster = result.poster || result.posterUrl || prev.posterUrl || '';
          return {
            ...prev,
            title: result.title,
            year: result.year,
            director: result.director,
            poster,
            posterUrl: poster,
          };
        });
        setStatus('won');
        return;
      }

      if (isLastAttempt) {
        setMovie(prev => {
          const poster = result.poster || result.posterUrl || prev.posterUrl || '';
          return {
            ...prev,
            title: result.title,
            poster,
            posterUrl: poster,
          };
        });
        setStatus('lost');
      } else {
        setRevealedCount(prev => Math.min(prev + 1, CLUE_SEQUENCE.length));
      }
    } catch {
      setAttempts(attempts);
      setError('Something went wrong submitting your guess. Please try again.');
    }
  }, [movie, status, attempts]);

  const clues = movie
    ? CLUE_SEQUENCE.slice(0, revealedCount).map(({ key, label }) => ({
        label,
        value: movie[key] ?? '—',
      }))
    : [];

  return {
    movie,
    clues,
    clueSequence: CLUE_SEQUENCE,
    revealedCount,
    attempts,
    maxAttempts: MAX_ATTEMPTS,
    status,
    error,
    startNewGame,
    submitGuess,
  };
}
