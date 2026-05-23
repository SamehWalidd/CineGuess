import './ClueCard.css';
export default function ClueCard({ label, value, index }) {
  return (
    <div
      className="clue-card clue-card--revealed"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <span className="clue-card__label">{label}</span>
      <span className="clue-card__value">{value}</span>
    </div>
  );
}
