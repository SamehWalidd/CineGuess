import ClueCard from './ClueCard';
export default function ClueBoard({ clues, revealedCount, clueSequence }) {
  return (
    <div className="clue-board">
      {clueSequence.map((item, i) => {
        if (i < revealedCount) {
          return (
            <ClueCard
              key={item.key}
              label={clues[i]?.label ?? item.label}
              value={clues[i]?.value}
              index={i}
            />
          );
        }

        return (
          <div key={item.key} className="clue-card clue-card--locked">
            <span className="clue-card__label clue-card__label--muted">
              {item.label}
            </span>
            <span className="clue-card__lock-icon" aria-hidden="true">?</span>
          </div>
        );
      })}
    </div>
  );
}
