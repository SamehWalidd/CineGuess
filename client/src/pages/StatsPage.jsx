import { Link } from 'react-router-dom';
import { useSessionStats } from '../hooks/useSessionStats';
import './StatsPage.css';

function winRateClass(rate) {
  if (rate >= 60) return 'stats-win-rate--high';
  if (rate >= 35) return 'stats-win-rate--mid';
  return 'stats-win-rate--low';
}

export default function StatsPage() {
  const { stats, winRate, avgGuesses, maxDistribution } = useSessionStats();
  const { gamesPlayed, bestScore, guessDistribution } = stats;

  const empty = gamesPlayed === 0;

  return (
    <div className="stats-page">
      <div className="container stats-container">
        <header className="stats-header">
          <h1>Session stats</h1>
          <p className="page-subtitle">This session, saved locally.</p>
        </header>

        {empty ? (
          <div className="cg-card stats-empty">
            <p>No games recorded yet.</p>
            <Link to="/" className="btn-cg-primary">
              Play your first game
            </Link>
          </div>
        ) : (
          <>
            <div className="stats-cards">
              <div className="cg-card stats-card stats-card--big">
                <span className="stats-card__label">Games played</span>
                <span className="stats-card__value">{gamesPlayed}</span>
              </div>

              <div className="cg-card stats-card">
                <span className="stats-card__label">Win rate</span>
                <span className={`stats-card__value stats-win-rate ${winRateClass(winRate)}`}>
                  {winRate}%
                </span>
              </div>

              <div className="cg-card stats-card">
                <span className="stats-card__label">Best score</span>
                <span className="stats-card__value">
                  {bestScore != null ? (
                    <>
                      {bestScore}
                      <span className="stats-card__unit"> guesses</span>
                    </>
                  ) : (
                    '—'
                  )}
                </span>
                <span className="stats-card__hint">Fewest to win</span>
              </div>

              <div className="cg-card stats-card">
                <span className="stats-card__label">Avg guesses</span>
                <span className="stats-card__value">
                  {avgGuesses ?? '—'}
                </span>
                <span className="stats-card__hint">Wins only</span>
              </div>
            </div>

            <section className="cg-card stats-distribution">
              <h2 className="stats-distribution__title">Guess distribution</h2>
              <p className="stats-distribution__subtitle page-subtitle">
                Wins at 1–6 guesses
              </p>

              <div className="stats-bars" role="img" aria-label="Guess distribution bar chart">
                {[1, 2, 3, 4, 5, 6].map((n) => {
                  const count = guessDistribution[n] || 0;
                  const pct = (count / maxDistribution) * 100;
                  return (
                    <div key={n} className="stats-bar-row">
                      <span className="stats-bar-label">{n}</span>
                      <div className="stats-bar-track">
                        <div
                          className="stats-bar-fill"
                          style={{ '--bar-pct': `${pct}%` }}
                          data-count={count}
                        />
                      </div>
                      <span className="stats-bar-count">{count}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
