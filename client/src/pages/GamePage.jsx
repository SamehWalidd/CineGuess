import { useEffect, useRef } from 'react';
import { useGameState } from '../hooks/useGameState';
import { useSessionStats } from '../hooks/useSessionStats';
import ClueBoard    from '../components/ClueBoard';
import GuessForm    from '../components/GuessForm';
import ResultModal  from '../components/ResultModal';
import './GamePage.css';
export default function GamePage() {
  const {
    movie,
    clues,
    clueSequence,
    revealedCount,
    attempts,
    maxAttempts,
    status,
    error,
    startNewGame,
    submitGuess,
  } = useGameState();

  const { recordGame } = useSessionStats();
  const gameRecordedRef = useRef(false);

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    if (status === 'won' || status === 'lost') {
      if (!gameRecordedRef.current && attempts.length > 0) {
        recordGame({ won: status === 'won', guessCount: attempts.length });
        gameRecordedRef.current = true;
      }
    } else {
      gameRecordedRef.current = false;
    }
  }, [status, attempts.length, recordGame]);

  const isPlaying  = status === 'playing';
  const isLoading  = status === 'loading';
  const isGameOver = status === 'won' || status === 'lost';

  return (
    <div className="game-page">
      <div className="container game-container">
        <header className="game-header">
          <h1 className="game-title">CineGuess</h1>
          <p className="game-subtitle page-subtitle">Six tries · five clues</p>

          {(isPlaying || isGameOver) && (
            <div className="game-meta">
              <span className="game-clue-counter">
                {revealedCount === 0 ? (
                  <>No clues yet</>
                ) : (
                  <>Clue <strong>{revealedCount}</strong> / {clueSequence.length}</>
                )}
              </span>
              <span className="game-attempt-counter">
                Attempt <strong>{attempts.length}</strong> / {maxAttempts}
              </span>
            </div>
          )}
        </header>

        {error && (
          <div className="alert alert-danger game-error" role="alert">
            {error}
            <button className="btn-close btn-close-white ms-2" onClick={startNewGame} />
          </div>
        )}

        {isLoading && (
          <div className="game-loading" aria-live="polite">
            <div className="film-strip-loader">
              <span /><span /><span /><span /><span />
            </div>
            <p className="game-loading__text">Loading movie…</p>
          </div>
        )}

        {status === 'idle' && !error && (
          <div className="game-idle">
            <button className="btn start-btn" onClick={startNewGame}>
              Start Game
            </button>
          </div>
        )}

        {(isPlaying || isGameOver) && (
          <div className="game-content">
            <ClueBoard
              clues={clues}
              revealedCount={revealedCount}
              clueSequence={clueSequence}
            />
            <GuessForm
              onSubmit={submitGuess}
              attempts={attempts}
              maxAttempts={maxAttempts}
              disabled={!isPlaying}
            />
          </div>
        )}

      </div>
      <ResultModal
        status={status}
        movie={movie}
        attempts={attempts}
        onNewGame={startNewGame}
      />
    </div>
  );
}