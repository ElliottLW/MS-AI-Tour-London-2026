import { useState, useEffect, useRef } from 'react'
import './GameCanvas.css'

export default function GameCanvas({ onGameOver, difficulty = 1 }) {
  const canvasRef = useRef(null)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const playerImageRef = useRef(null)
  const gameStateRef = useRef({
    player: { x: 680, y: 1100, width: 50, height: 50, speed: 5 },
    bullets: [],
    enemies: [],
    hearts: [],
    keys: {},
    score: 0,
    lives: 3,
    gameRunning: true,
    enemySpawnRate: 0,
    bossSpawnRate: 0,
    bulletCooldown: 0,
    heartSpawnRate: 0,
  })

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const gameState = gameStateRef.current

    // Helper function to update lives and sync to React state
    const updateLives = (newLives) => {
      const clampedLives = Math.max(0, Math.min(newLives, 9))
      if (clampedLives !== gameState.lives) {
        gameState.lives = clampedLives
        setLives(clampedLives)
      }
    }

    // Load player image
    const playerImage = new Image()
    playerImage.src = '/icons8-github-copilot-188.png'
    playerImage.onload = () => {
      playerImageRef.current = playerImage
    }

    // Spawn initial enemies
    const spawnEnemy = () => {
      gameState.enemies.push({
        x: Math.random() * (canvas.width - 40),
        y: -40,
        width: 40,
        height: 40,
        speed: (0.3 + Math.random() * 0.5) * (difficulty * 0.4),
      })
    }

    // Spawn a few initial enemies
    for (let i = 0; i < 1; i++) {
      spawnEnemy()
    }

    // Keyboard event listeners
    const handleKeyDown = (e) => {
      gameState.keys[e.key] = true
      if (e.key === ' ') {
        e.preventDefault()
      }
      if (e.key === 'Escape') {
        gameState.gameRunning = false
        onGameOver(gameState.score)
      }
    }

    const handleKeyUp = (e) => {
      gameState.keys[e.key] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    // Game loop
    let frameCount = 0
    const gameLoop = () => {
      if (!gameState.gameRunning) return

      frameCount++

      // Clear canvas with gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, '#0a0e27')
      gradient.addColorStop(0.5, '#1a0033')
      gradient.addColorStop(1, '#0a0e27')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Player movement
      if (gameState.keys['ArrowLeft'] || gameState.keys['a']) {
        gameState.player.x = Math.max(0, gameState.player.x - gameState.player.speed)
      }
      if (gameState.keys['ArrowRight'] || gameState.keys['d']) {
        gameState.player.x = Math.min(canvas.width - gameState.player.width, gameState.player.x + gameState.player.speed)
      }

      // Continuous shooting when space is held
      if (gameState.keys[' ']) {
        gameState.bulletCooldown--
        if (gameState.bulletCooldown <= 0) {
          gameState.bullets.push({
            x: gameState.player.x + gameState.player.width / 2 - 5,
            y: gameState.player.y,
            width: 10,
            height: 20,
            speed: 8,
          })
          gameState.bulletCooldown = 30 // Fire every 30 frames (~500ms at 60fps)
        }
      } else {
        gameState.bulletCooldown = 0
      }

      // Draw player
      drawPlayer(ctx, gameState.player)

      // Update and draw bullets
      gameState.bullets = gameState.bullets.filter(bullet => bullet.y > 0)
      gameState.bullets.forEach(bullet => {
        bullet.y -= bullet.speed
        drawBullet(ctx, bullet)
      })

      // Spawn enemies
      gameState.enemySpawnRate++
      if (gameState.enemySpawnRate > Math.max(130 - gameState.score / 250 - (difficulty * 2), 80 - (difficulty * 3))) {
        spawnEnemy()
        gameState.enemySpawnRate = 0
      }

      // Spawn boss randomly every ~45 seconds (2700 frames at 60fps)
      gameState.bossSpawnRate++
      if (gameState.bossSpawnRate > 2700 + Math.random() * 1800) {
        gameState.enemies.push({
          x: Math.random() * (canvas.width - 120),
          y: -120,
          width: 120,
          height: 120,
          speed: (0.3 + Math.random() * 0.5) * (difficulty * 0.4),
          isBoss: true,
          health: 5,
        })
        gameState.bossSpawnRate = 0
      }

      // Spawn hearts randomly
      gameState.heartSpawnRate++
      if (gameState.heartSpawnRate > 1800) {
        gameState.hearts.push({
          x: Math.random() * (canvas.width - 30),
          y: -30,
          width: 30,
          height: 30,
          speed: 1.5,
        })
        gameState.heartSpawnRate = 0
      }

      // Update and draw hearts
      gameState.hearts = gameState.hearts
        .filter(heart => heart.y < canvas.height)
        .filter((heart) => {
          heart.y += heart.speed

          // Check collision with player
          if (
            gameState.player.x < heart.x + heart.width &&
            gameState.player.x + gameState.player.width > heart.x &&
            gameState.player.y < heart.y + heart.height &&
            gameState.player.y + gameState.player.height > heart.y
          ) {
            updateLives(gameState.lives + 1)
            return false // Remove this heart
          }

          drawHeart(ctx, heart)
          return true // Keep this heart
        })

      // Check bullet collisions first
      gameState.bullets = gameState.bullets.filter((bullet) => {
        let hitEnemy = false
        gameState.enemies = gameState.enemies.filter((enemy) => {
          if (
            bullet.x < enemy.x + enemy.width &&
            bullet.x + bullet.width > enemy.x &&
            bullet.y < enemy.y + enemy.height &&
            bullet.y + bullet.height > enemy.y
          ) {
            hitEnemy = true
            
            // Handle boss enemies with health
            if (enemy.isBoss) {
              enemy.health--
              if (enemy.health > 0) {
                return true // Keep boss alive but damaged
              }
              // Boss is defeated
              const scoreMultiplier = 1 + (difficulty - 1) * 0.25
              gameState.score += Math.floor(10 * scoreMultiplier * 10) // 10x points for boss
              setScore(gameState.score)
              return false // Remove boss
            }
            
            // Regular enemy
            const scoreMultiplier = 1 + (difficulty - 1) * 0.25
            gameState.score += Math.floor(10 * scoreMultiplier)
            setScore(gameState.score)
            return false // Remove this enemy
          }
          return true // Keep this enemy
        })
        return !hitEnemy // Remove bullet if it hit something
      })

      // Update and draw enemies
      gameState.enemies = gameState.enemies.filter((enemy, enemyIndex) => {
        // Double enemy speed when holding down or s
        let enemySpeed = enemy.speed
        if (gameState.keys['ArrowDown'] || gameState.keys['s']) {
          enemySpeed *= 2
        }
        enemy.y += enemySpeed

        // Check collision with player
        if (
          gameState.player.x < enemy.x + enemy.width &&
          gameState.player.x + gameState.player.width > enemy.x &&
          gameState.player.y < enemy.y + enemy.height &&
          gameState.player.y + gameState.player.height > enemy.y
        ) {
          updateLives(gameState.lives - 1)
          if (gameState.lives <= 0) {
            gameState.gameRunning = false
            onGameOver(gameState.score)
          }
          return false // Remove this enemy
        }

        // Check if enemy fell off bottom of screen
        if (enemy.y > canvas.height) {
          updateLives(gameState.lives - 1)
          if (gameState.lives <= 0) {
            gameState.gameRunning = false
            onGameOver(gameState.score)
          }
          return false // Remove this enemy
        }

        drawEnemy(ctx, enemy)
        return true // Keep this enemy
      })

      // Draw score
      drawScore(ctx, gameState.score, canvas.width, gameState.lives)

      requestAnimationFrame(gameLoop)
    }

    gameLoop()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [onGameOver])

  function drawPlayer(ctx, player) {
    if (playerImageRef.current) {
      // Draw blue glow around player
      ctx.shadowColor = 'rgba(0, 150, 255, 0.8)'
      ctx.shadowBlur = 25
      // Draw the loaded image
      ctx.drawImage(playerImageRef.current, player.x, player.y, player.width, player.height)
      ctx.shadowColor = 'rgba(0, 0, 0, 0)'
    } else {
      // Fallback: draw a simple cyan rectangle if image not loaded
      ctx.fillStyle = '#00ffff'
      ctx.shadowColor = 'rgba(0, 255, 255, 0.8)'
      ctx.shadowBlur = 20
      ctx.fillRect(player.x + 10, player.y + 10, 30, 30)
      ctx.shadowColor = 'rgba(0, 0, 0, 0)'
    }
  }

  function drawBullet(ctx, bullet) {
    ctx.fillStyle = '#00ff88'
    ctx.shadowColor = 'rgba(0, 255, 136, 0.8)'
    ctx.shadowBlur = 15
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)
    ctx.shadowColor = 'rgba(0, 0, 0, 0)'
  }

  function drawEnemy(ctx, enemy) {
    if (enemy.isBoss) {
      // Draw boss with golden glow
      ctx.shadowColor = 'rgba(255, 215, 0, 0.9)'
      ctx.shadowBlur = 30
      ctx.font = 'bold 100px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('👾', enemy.x + enemy.width / 2, enemy.y + enemy.height / 2)
      
      // Draw health indicator
      ctx.fillStyle = '#ff006e'
      ctx.font = 'bold 20px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(`HEALTH: ${enemy.health}`, enemy.x + enemy.width / 2, enemy.y + enemy.height + 25)
    } else {
      // Draw regular alien emoji with glow
      ctx.shadowColor = 'rgba(255, 0, 110, 0.8)'
      ctx.shadowBlur = 20
      ctx.font = 'bold 40px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('👾', enemy.x + enemy.width / 2, enemy.y + enemy.height / 2)
    }
    ctx.shadowColor = 'rgba(0, 0, 0, 0)'
  }

  function drawHeart(ctx, heart) {
    ctx.fillStyle = '#ff0080'
    ctx.shadowColor = 'rgba(255, 0, 128, 0.9)'
    ctx.shadowBlur = 20

    // Simple heart shape
    const x = heart.x
    const y = heart.y
    const size = heart.width / 2

    // Heart path
    ctx.beginPath()
    ctx.moveTo(x + size, y + size * 0.5)
    
    // Left bump
    ctx.bezierCurveTo(
      x + size - 5, y - 5,
      x - 5, y - 5,
      x - 5, y + size * 0.3
    )
    
    // Bottom point
    ctx.bezierCurveTo(
      x - 5, y + size * 1.5,
      x + size, y + size * 2,
      x + size, y + size * 2
    )
    
    // Right bump
    ctx.bezierCurveTo(
      x + size, y + size * 2,
      x + size * 2 + 5, y + size * 1.5,
      x + size * 2 + 5, y + size * 0.3
    )
    
    ctx.bezierCurveTo(
      x + size * 2 + 5, y - 5,
      x + size + 5, y - 5,
      x + size, y + size * 0.5
    )
    
    ctx.fill()
    ctx.shadowColor = 'rgba(0, 0, 0, 0)'
  }

  function drawScore(ctx, scoreValue, canvasWidth, livesCount) {
    ctx.font = 'bold 24px "Courier New"'
    ctx.fillStyle = '#00ffff'
    ctx.shadowColor = 'rgba(0, 255, 255, 0.8)'
    ctx.shadowBlur = 10
    ctx.textAlign = 'right'
    ctx.fillText(`SCORE: ${scoreValue}`, canvasWidth - 20, 40)
    ctx.fillText(`DIFFICULTY: ${'👾'.repeat(difficulty)}`, canvasWidth - 20, 70)
    
    // Draw lives from gameState instead of React state
    ctx.textAlign = 'right'
    ctx.fillText(`LIVES: ${'❤️'.repeat(livesCount)}`, canvasWidth - 20, 100)
    ctx.shadowColor = 'rgba(0, 0, 0, 0)'
  }

  return (
    <div className="game-container">
      <canvas
        ref={canvasRef}
        width={1360}
        height={1200}
        className="game-canvas"
      />
      <div className="controls-hint">
        ◄ ► / A D = Move | DOWN / S = Double Enemy Speed | SPACE = Shoot | ESC = Quit
      </div>
    </div>
  )
}
