import './Leaderboard.css'

export default function Leaderboard({ scores }) {
  const title = scores.length <= 10 ? '★ TOP 10 SCORES ★' : `★ ALL ${scores.length} SCORES ★`
  
  return (
    <div className="leaderboard">
      <h2 className="leaderboard-title">{title}</h2>
      {scores.length > 0 ? (
        <div className={`scores-list ${scores.length > 10 ? 'scrollable' : ''}`}>
          {scores.map((entry, index) => (
            <div key={index} className={`score-entry rank-${index + 1}`}>
              <span className="rank">#{index + 1}</span>
              <span className="name">{entry.name}</span>
              <span className="score">{entry.score.toLocaleString()}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-scores">No scores yet. Be the first!</p>
      )}
    </div>
  )
}
