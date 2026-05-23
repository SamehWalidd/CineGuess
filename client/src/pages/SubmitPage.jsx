import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import MoviePreview from '../components/MoviePreview';
import { checkMovieExists, createMovie } from '../services/api';
import './SubmitPage.css';

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1888;

const INITIAL_FORM = {
  title: '',
  year: '',
  genre: '',
  director: '',
  leadActor: '',
  plotHint: '',
};

function validateField(name, value) {
  const v = typeof value === 'string' ? value.trim() : value;

  switch (name) {
    case 'title':
      if (!v) return 'Title is required';
      return '';
    case 'year': {
      if (!v) return 'Year is required';
      if (!/^\d{4}$/.test(v)) return 'Enter a 4-digit year';
      const y = parseInt(v, 10);
      if (y < MIN_YEAR || y > CURRENT_YEAR) {
        return `Year must be between ${MIN_YEAR} and ${CURRENT_YEAR}`;
      }
      return '';
    }
    case 'genre':
      if (!v) return 'Genre is required';
      return '';
    case 'director':
      if (!v) return 'Director is required';
      if (v.length < 2) return 'At least 2 characters';
      return '';
    case 'leadActor':
      if (!v) return 'Lead actor is required';
      if (v.length < 2) return 'At least 2 characters';
      return '';
    case 'plotHint':
      if (!v) return 'Plot hint is required';
      if (v.length < 20) return 'At least 20 characters';
      if (v.length > 200) return 'Maximum 200 characters';
      return '';
    default:
      return '';
  }
}

export default function SubmitPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [titleDuplicate, setTitleDuplicate] = useState(false);
  const [titleChecking, setTitleChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
    if (name === 'title') setTitleDuplicate(false);
  };

  const handleBlur = (name) => {
    setErrors((prev) => ({ ...prev, [name]: validateField(name, form[name]) }));
    if (name === 'title') checkTitleDuplicate();
  };

  const checkTitleDuplicate = useCallback(async () => {
    const title = form.title.trim();
    if (!title || validateField('title', title)) return;

    setTitleChecking(true);
    try {
      const { exists } = await checkMovieExists(title);
      setTitleDuplicate(exists);
      if (exists) {
        setErrors((prev) => ({
          ...prev,
          title: 'This movie is already in the database',
        }));
      }
    } catch {
      setErrors((prev) => ({
        ...prev,
        title: 'Could not verify title — try again',
      }));
    } finally {
      setTitleChecking(false);
    }
  }, [form.title]);

  const validateAll = () => {
    const next = {};
    Object.keys(INITIAL_FORM).forEach((key) => {
      next[key] = validateField(key, form[key]);
    });
    setErrors(next);
    return !Object.values(next).some(Boolean) && !titleDuplicate;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    const title = form.title.trim();
    setTitleChecking(true);
    try {
      const { exists } = await checkMovieExists(title);
      if (exists) {
        setTitleDuplicate(true);
        setErrors((prev) => ({
          ...prev,
          title: 'This movie is already in the database',
        }));
        return;
      }
    } catch {
      setErrors((prev) => ({
        ...prev,
        title: 'Could not verify title — try again',
      }));
      return;
    } finally {
      setTitleChecking(false);
    }

    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        year: parseInt(form.year, 10),
        genre: form.genre.trim(),
        director: form.director.trim(),
        leadActor: form.leadActor.trim(),
        plotHint: form.plotHint.trim(),
      };
      const result = await createMovie(payload);
      setSubmitted(result.movie || payload);
      setForm(INITIAL_FORM);
      setErrors({});
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        form: err.message || 'Failed to submit movie',
      }));
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(null);
    setForm(INITIAL_FORM);
    setErrors({});
    setTitleDuplicate(false);
  };

  if (submitted) {
    return (
      <div className="submit-page">
        <div className="container submit-container">
          <div className="cg-card submit-confirmation">
            <div className="submit-confirmation__icon" aria-hidden="true">🎬</div>
            <h1>Movie submitted</h1>
            <p className="submit-confirmation__title">
              <strong>{submitted.title}</strong>
              {submitted.year ? ` (${submitted.year})` : ''}
            </p>
            <p className="page-subtitle">Now in the reel.</p>
            <div className="submit-confirmation__actions">
              <button type="button" className="btn-cg-primary" onClick={resetForm}>
                Submit another
              </button>
              <Link to="/" className="btn-cg-outline">
                Play a game
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const plotLen = form.plotHint.length;

  return (
    <div className="submit-page">
      <div className="container submit-container">
        <header className="submit-header">
          <h1>Submit a movie</h1>
          <p className="page-subtitle">Curate the next mystery.</p>
        </header>

        <div className="submit-layout">
          <form className="cg-card submit-form" onSubmit={handleSubmit} noValidate>
            {errors.form && (
              <div className="alert alert-danger submit-form__banner" role="alert">
                {errors.form}
              </div>
            )}

            <div className="submit-field">
              <label className="cg-label" htmlFor="title">Title</label>
              <input
                id="title"
                className={`cg-input ${errors.title ? 'is-invalid' : form.title.trim() && !titleDuplicate ? 'is-valid' : ''}`}
                value={form.title}
                onChange={(e) => setField('title', e.target.value)}
                onBlur={() => handleBlur('title')}
                autoComplete="off"
                disabled={submitting}
              />
              {titleChecking && <p className="cg-error submit-field__checking">Checking title…</p>}
              {errors.title && !titleChecking && <p className="cg-error">{errors.title}</p>}
            </div>

            <div className="submit-row">
              <div className="submit-field">
                <label className="cg-label" htmlFor="year">Year</label>
                <input
                  id="year"
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  className={`cg-input ${errors.year ? 'is-invalid' : ''}`}
                  value={form.year}
                  onChange={(e) => setField('year', e.target.value.replace(/\D/g, '').slice(0, 4))}
                  onBlur={() => handleBlur('year')}
                  disabled={submitting}
                />
                {errors.year && <p className="cg-error">{errors.year}</p>}
              </div>

              <div className="submit-field">
                <label className="cg-label" htmlFor="genre">Genre</label>
                <input
                  id="genre"
                  className={`cg-input ${errors.genre ? 'is-invalid' : ''}`}
                  placeholder="e.g. Action, Drama"
                  value={form.genre}
                  onChange={(e) => setField('genre', e.target.value)}
                  onBlur={() => handleBlur('genre')}
                  disabled={submitting}
                />
                {errors.genre && <p className="cg-error">{errors.genre}</p>}
              </div>
            </div>

            <div className="submit-field">
              <label className="cg-label" htmlFor="director">Director</label>
              <input
                id="director"
                className={`cg-input ${errors.director ? 'is-invalid' : ''}`}
                value={form.director}
                onChange={(e) => setField('director', e.target.value)}
                onBlur={() => handleBlur('director')}
                disabled={submitting}
              />
              {errors.director && <p className="cg-error">{errors.director}</p>}
            </div>

            <div className="submit-field">
              <label className="cg-label" htmlFor="leadActor">Lead actor</label>
              <input
                id="leadActor"
                className={`cg-input ${errors.leadActor ? 'is-invalid' : ''}`}
                value={form.leadActor}
                onChange={(e) => setField('leadActor', e.target.value)}
                onBlur={() => handleBlur('leadActor')}
                disabled={submitting}
              />
              {errors.leadActor && <p className="cg-error">{errors.leadActor}</p>}
            </div>

            <div className="submit-field">
              <label className="cg-label" htmlFor="plotHint">
                Plot hint
                <span className="submit-char-count">{plotLen}/200</span>
              </label>
              <textarea
                id="plotHint"
                className={`cg-input submit-textarea ${errors.plotHint ? 'is-invalid' : ''}`}
                rows={4}
                maxLength={200}
                value={form.plotHint}
                onChange={(e) => setField('plotHint', e.target.value)}
                onBlur={() => handleBlur('plotHint')}
                disabled={submitting}
              />
              {errors.plotHint && <p className="cg-error">{errors.plotHint}</p>}
            </div>

            <button
              type="submit"
              className="btn-cg-primary submit-form__submit"
              disabled={submitting || titleChecking}
            >
              {submitting ? (
                <>
                  <span className="cg-spinner" aria-hidden="true" />
                  Submitting…
                </>
              ) : (
                'Add to pool'
              )}
            </button>
          </form>

          <aside className="cg-card submit-preview-panel">
            <MoviePreview
              genre={form.genre}
              year={form.year}
              director={form.director}
              leadActor={form.leadActor}
              plotHint={form.plotHint}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
