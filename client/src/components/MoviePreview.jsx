import ClueCard from './ClueCard';

const CLUE_SEQUENCE = [
  { key: 'genre',     label: 'Genre'      },
  { key: 'decade',    label: 'Decade'     },
  { key: 'director',  label: 'Director'   },
  { key: 'leadActor', label: 'Lead Actor' },
  { key: 'plotHint',  label: 'Plot Hint'  },
];

function yearToDecade(year) {
  const y = parseInt(year, 10);
  if (Number.isNaN(y)) return '—';
  return `${Math.floor(y / 10) * 10}s`;
}

export default function MoviePreview({ genre, year, director, leadActor, plotHint }) {
  const values = {
    genre:     genre?.trim()     || '—',
    decade:    year ? yearToDecade(year) : '—',
    director:  director?.trim()  || '—',
    leadActor: leadActor?.trim() || '—',
    plotHint:  plotHint?.trim()  || '—',
  };

  return (
    <div className="movie-preview">
      <h3 className="movie-preview__title">Clue preview</h3>
      <p className="movie-preview__hint page-subtitle">Live reveal order</p>
      <div className="clue-board movie-preview__board">
        {CLUE_SEQUENCE.map((item, i) => (
          <ClueCard
            key={item.key}
            label={item.label}
            value={values[item.key]}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
