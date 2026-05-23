import { useEffect, useRef } from 'react';
export default function ResultModal({ status, movie, attempts, onNewGame }) {
  const visible   = status === 'won' || status === 'lost';
  const won       = status === 'won';
  const btnRef    = useRef(null);

  useEffect(() => {
    if (visible) {
      setTimeout(() => btnRef.current?.focus(), 100);
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const handler = (e) => { if (e.key === 'Escape') onNewGame(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [visible, onNewGame]);

  if (!visible || !movie) return null;

  const rawPoster = (movie.poster || movie.posterUrl || '').trim();
  const posterSrc = rawPoster && rawPoster !== 'N/A'
    ? rawPoster.replace(/^http:\/\//i, 'https://')
    : '';
  const hasValidPoster = posterSrc.length > 0;

  if (!won) {
    return (
      <div
        className="result-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Game over"
      >
        <div className="result-backdrop" onClick={onNewGame} aria-hidden="true" />

        <div className="result-modal result-modal--lose">
          <div className="result-body result-body--lose">
            <h2 className="result-title">{movie.title}</h2>
            <button
              ref={btnRef}
              className="btn result-btn"
              onClick={onNewGame}
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="result-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="You won!"
    >
      <div className="result-backdrop" onClick={onNewGame} aria-hidden="true" />

      <div className="result-modal">
        <div className="result-banner result-banner--win">
          <span className="result-banner__emoji" aria-hidden="true">🎬</span>
          <span className="result-banner__text">You Got It!</span>
        </div>

        <div className="result-body">
          {hasValidPoster && (
            <div className="result-poster-wrapper">
              <img
                src={posterSrc}
                alt={`${movie.title} poster`}
                className="result-poster"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          <div className="result-info">
            <h2 className="result-title">{movie.title}</h2>
            <p className="result-year">{movie.year}</p>
            <p className="result-director">
              Directed by <strong>{movie.director}</strong>
            </p>

            <p className="result-msg result-msg--win">
              Solved in{' '}
              <strong>{attempts.length}</strong>{' '}
              guess{attempts.length !== 1 ? 'es' : ''}!
            </p>

            <button
              ref={btnRef}
              className="btn result-btn"
              onClick={onNewGame}
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
