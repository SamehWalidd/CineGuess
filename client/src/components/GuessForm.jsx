import { useState, useRef, useEffect } from 'react';
export default function GuessForm({ onSubmit, attempts, maxAttempts, disabled }) {
  const [guess, setGuess]   = useState('');
  const [error, setError]   = useState('');
  const inputRef            = useRef(null);

  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled, attempts.length]);

  const validate = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Please enter a movie title.';
    if (attempts.map(a => a.toLowerCase()).includes(trimmed.toLowerCase())) {
      return 'You already tried that one!';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validate(guess);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    onSubmit(guess.trim());
    setGuess('');
  };

  const handleChange = (e) => {
    setGuess(e.target.value);
    if (error) setError('');
  };

  const remaining = maxAttempts - attempts.length;

  return (
    <div className="guess-form-wrapper">
      <form onSubmit={handleSubmit} noValidate>
        <div className="guess-input-row">
          <input
            ref={inputRef}
            type="text"
            className={`form-control guess-input ${error ? 'is-invalid' : ''}`}
            placeholder="Enter movie title…"
            value={guess}
            onChange={handleChange}
            disabled={disabled}
            autoComplete="off"
            maxLength={120}
            aria-label="Movie title guess"
          />
          <button
            type="submit"
            className="btn guess-btn"
            disabled={disabled}
            aria-label="Submit guess"
          >
            Guess
          </button>
        </div>

        {error && (
          <div className="guess-error" role="alert">
            {error}
          </div>
        )}
      </form>

      <div className="attempts-tracker" aria-label={`${remaining} guesses remaining`}>
        <div className="attempt-dots">
          {Array.from({ length: maxAttempts }).map((_, i) => (
            <span
              key={i}
              className={`attempt-dot ${i < attempts.length ? 'attempt-dot--used' : ''}`}
            />
          ))}
        </div>
        <span className="attempts-label">
          {remaining} guess{remaining !== 1 ? 'es' : ''} left
        </span>
      </div>

      {attempts.length > 0 && (
        <div className="previous-guesses" aria-live="polite">
          <span className="prev-guesses__title">Previous guesses:</span>
          <div className="prev-guesses__chips">
            {attempts.map((a, i) => (
              <span key={i} className="prev-guess-chip">
                {a}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
