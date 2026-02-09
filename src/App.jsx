import { useState, useEffect } from 'react'
import GameCanvas from './components/GameCanvas'
import Leaderboard from './components/Leaderboard'
import './App.css'

function App() {
  const [gameState, setGameState] = useState('menu') // menu, difficulty, playing, gameOver
  const [score, setScore] = useState(0)
  const [leaderboard, setLeaderboard] = useState([])
  const [playerName, setPlayerName] = useState('')
  const [inputName, setInputName] = useState('')
  const [difficulty, setDifficulty] = useState(1) // 1-5
  const [showAllScores, setShowAllScores] = useState(false)

  // Load leaderboard from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('leaderboard')
    if (saved) {
      setLeaderboard(JSON.parse(saved))
    }
  }, [])

  const handleGameOver = (finalScore) => {
    setScore(finalScore)
    setGameState('gameOver')
  }

  const handleSubmitScore = () => {
    if (inputName.trim()) {
      const newEntry = { name: inputName, score, difficulty, timestamp: Date.now() }
      const updated = [...leaderboard, newEntry]
        .sort((a, b) => b.score - a.score)
      
      setLeaderboard(updated)
      localStorage.setItem('leaderboard', JSON.stringify(updated))
      setPlayerName(inputName)
      setGameState('menu')
      setInputName('')
    }
  }

  const startGame = () => {
    setScore(0)
    setGameState('difficulty')
  }

  return (
    <div className="app-container">
      {(gameState === 'menu' || gameState === 'gameOver') && (
        <div className="page-title">
          MICROSOFT AI TOUR LONDON 🚀 
        </div>
      )}

      {gameState === 'menu' && (
        <div className="menu-screen">
          <img src="/icons8-github-copilot-188.png" alt="GitHub Copilot" className="menu-logo" />
          <h1 className="title">GITHUB COPILOT SPACE INVADERS</h1>
          <p className="subtitle">═══════════════════════════════════════</p>
          
          <button className="neon-button" onClick={startGame}>
            ★ START GAME ★
          </button>

          <Leaderboard scores={showAllScores ? leaderboard : leaderboard.slice(0, 10)} />
          
          {leaderboard.length > 10 && (
            <button 
              className="neon-button secondary" 
              onClick={() => setShowAllScores(!showAllScores)}
              style={{ marginTop: '10px', fontSize: '0.9em' }}
            >
              {showAllScores ? '▲ SHOW TOP 10' : `▼ VIEW ALL ${leaderboard.length} SCORES`}
            </button>
          )}

          {playerName && (
            <p className="last-score">Last player: {playerName} - Score: {score}</p>
          )}
        </div>
      )}

      {gameState === 'playing' && (
        <GameCanvas onGameOver={handleGameOver} difficulty={difficulty} />
      )}

      {gameState === 'difficulty' && (
        <div className="difficulty-screen">
          <h2 className="difficulty-title">CHOOSE YOUR DIFFICULTY</h2>
          <p className="difficulty-subtitle">═════════════════════════</p>
          
          <div className="difficulty-options">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                className={`difficulty-button ${difficulty === level ? 'active' : ''}`}
                onClick={() => {
                  setDifficulty(level)
                  setGameState('playing')
                }}
              >
                <div className="alien-stars">
                  {[...Array(level)].map((_, i) => (
                    <span key={i} className="alien">👾</span>
                  ))}
                </div>
                <p className="difficulty-label">
                  {level === 1 && 'ROOKIE'}
                  {level === 2 && 'WARRIOR'}
                  {level === 3 && 'LEGEND'}
                  {level === 4 && 'NIGHTMARE'}
                  {level === 5 && 'IMPOSSIBLE'}
                </p>
              </button>
            ))}
          </div>

          <button 
            className="neon-button secondary" 
            onClick={() => setGameState('menu')}
            style={{ marginTop: '30px' }}
          >
            BACK TO MENU
          </button>
        </div>
      )}

      {gameState === 'gameOver' && (
        <div className="game-over-screen">
          <h2 className="game-over-title">GAME OVER</h2>
          <p className="final-score">Final Score: {score}</p>
          
          <input
            type="text"
            className="name-input"
            placeholder="Enter your name..."
            value={inputName}
            onChange={(e) => setInputName(e.target.value.substring(0, 20))}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmitScore()}
            autoFocus
          />
          
          <button className="neon-button" onClick={handleSubmitScore}>
            SUBMIT SCORE
          </button>
          
          <button className="neon-button secondary" onClick={() => {
            setGameState('menu')
            setInputName('')
          }}>
            MAIN MENU
          </button>
        </div>
      )}
    </div>
  )
}

export default App
