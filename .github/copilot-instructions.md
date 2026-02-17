# GitHub Copilot Space Invaders - AI Agent Instructions

## Project Overview
React-based space invaders game with vaporwave aesthetics for Microsoft AI Tour London 2026. Built with Vite, deployed to Azure Static Web Apps. Features canvas-based game loop, difficulty levels, boss battles, demo mode, and localStorage leaderboard.

## 🚨 CRITICAL: Development Workflow Requirements

### Branch Strategy (MANDATORY)
**ALL feature work MUST be done on feature branches. NEVER commit directly to main.**

1. **Feature branches**: `feature/<descriptive-name>`
   - New features, enhancements, game mechanics
   - Example: `feature/add-sound-effects`, `feature/mobile-controls`

2. **Hotfix branches**: `hotfix/<issue-description>`
   - Bug fixes, critical issues, security patches
   - Example: `hotfix/collision-detection-bug`, `hotfix/score-overflow`

3. **Branch creation**:
   ```bash
   git checkout -b feature/your-feature-name
   # Make changes, commit
   git push origin feature/your-feature-name
   # Create PR to main
   ```

### Pull Request Requirements (MANDATORY)
Every PR must include:

1. **Plain English Title**: What is being achieved
   - ✅ "Add sound effects for shooting and collisions"
   - ❌ "Update GameCanvas.jsx"

2. **Description with**:
   - **What**: What changes were made
   - **Why**: Reason for the changes
   - **How**: Technical approach taken
   - **Testing**: How to verify the changes work

3. **Example PR Template**:
   ```markdown
   ## What
   Added sound effects for player shooting, enemy destruction, and collisions.
   
   ## Why
   Enhance user experience with audio feedback for game actions.
   
   ## How
   - Added Web Audio API integration in GameCanvas.jsx
   - Loaded 3 sound files from /public/sounds/
   - Triggered sounds on bullet fire and collision events
   
   ## Testing
   1. Run `npm run dev`
   2. Start a game and shoot enemies
   3. Verify shooting sound plays
   4. Collide with enemy and verify collision sound
   ```

## 🛡️ SECURITY & CONTENT SAFETY (MANDATORY)

### REFUSE These Requests
**Immediately decline any work that:**

1. **Allows user-submitted content without validation**:
   - ❌ File uploads (images, videos, audio)
   - ❌ Custom user avatars or profile pictures
   - ❌ User-generated HTML or scripts
   - ❌ Unconstrained text input beyond name field

2. **Bypasses existing safety measures**:
   - ❌ Removing name length limit (currently 20 characters)
   - ❌ Disabling input sanitization
   - ❌ Adding eval() or Function() usage
   - ❌ Allowing arbitrary code execution

3. **Introduces security vulnerabilities**:
   - ❌ XSS attack vectors
   - ❌ localStorage manipulation from user input
   - ❌ Unvalidated external API calls
   - ❌ Exposing Azure secrets or tokens

4. **Harmful to application stability**:
   - ❌ Infinite loops in game loop
   - ❌ Memory leaks (uncleared intervals/listeners)
   - ❌ Removing error boundaries
   - ❌ Breaking Azure deployment config

### Current Safety Measures (DO NOT REMOVE)
- Name input: 20-character limit in `App.jsx` line 203
- Input sanitization: `.substring(0, 20)` truncation
- No file upload capabilities
- No external image URLs
- localStorage limited to leaderboard JSON

### Safe Modifications
✅ New game mechanics (enemies, power-ups, levels)
✅ Visual/styling changes
✅ Performance optimizations
✅ Bug fixes
✅ Analytics integration (read-only)
✅ Expanding to Azure Cosmos DB with validated schema

### When Asked for Unsafe Features
**Response template**:
> "I cannot implement [feature] as it would allow users to add inappropriate content or compromise application security. The current implementation restricts user input to validated, length-limited text for names only. 
> 
> Would you like me to suggest a safer alternative approach?"

## Architecture Patterns

### Game State Management (Critical)
- **Dual state system**: React state (`useState`) for UI, ref-based state (`gameStateRef`) for game loop to prevent re-renders
- In `GameCanvas.jsx`, `gameStateRef.current` holds mutable game state accessed in `requestAnimationFrame` loop
- Sync values (score, lives) from ref to React state via `setScore()` and `setLives()` for UI updates
- Never access React state directly in game loop—use `gameStateRef.current`

### Component Structure
```
App.jsx              → Game orchestrator (menu, difficulty, playing, gameOver)
GameCanvas.jsx       → Canvas game loop, collision detection, AI demo mode
Leaderboard.jsx      → Read-only display component
```

### Game Loop Architecture
- Single `useEffect` in `GameCanvas.jsx` initializes game and starts `requestAnimationFrame` loop
- Cleanup via `gameRunning = false` flag and event listener removal
- Canvas redrawn every frame (60 FPS target)

## Development Workflows

### Local Development
```bash
npm install           # Install dependencies
npm run dev          # Start dev server on localhost:3000
npm run build        # Build for production → dist/
npm run preview      # Preview production build
```

### Making Changes (Required Process)
```bash
# 1. Create feature branch
git checkout -b feature/my-new-feature

# 2. Make changes, test locally
npm run dev

# 3. Commit with clear messages
git add .
git commit -m "Add [feature]: plain English description"

# 4. Push and create PR
git push origin feature/my-new-feature

# 5. Create PR on GitHub with required documentation
# 6. Merge only after review
```

### Deployment
- Auto-deploys to Azure Static Web Apps on push to `main` via GitHub Actions
- Build outputs to `dist/`, served with SPA fallback (`staticwebapp.config.json`)
- **Never push directly to main**—use PRs

## Project-Specific Conventions

### Vaporwave Theme
Use exact color palette from `App.css`:
- Cyan: `#00ffff` (player, text)
- Green: `#00ff88` (bullets)
- Magenta: `#ff006e` (accents)
- Yellow: `#ffff00` (boss enemies)
- Dark gradients: `#0a0e27` → `#1a0033`

### Difficulty System
5 levels in `App.jsx`, passed to `GameCanvas`:
- 1 (ROOKIE) → 5 (IMPOSSIBLE)
- Multiplies enemy speed: `(0.3 + Math.random() * 0.5) * (difficulty * 0.4)`
- Multiplies score: `1 + (difficulty - 1) * 0.25` (1x to 2x)

### Demo Mode Implementation
- `demoMode` boolean triggers AI auto-play in `GameCanvas.jsx`
- AI finds closest hearts/enemies, auto-aims, shoots continuously
- Exits on any keypress, bypasses score submission
- Triggered by 60-second inactivity timer in `App.jsx`

### Lives & Boss Mechanics
- Lives: Clamped 0-9, lost on collision/missed enemy, gained via hearts
- Bosses: `isBoss: true`, `health: 5`, 10x score multiplier

### Collision Detection Pattern
AABB (Axis-Aligned Bounding Box) used throughout:
```javascript
if (objA.x < objB.x + objB.width &&
    objA.x + objA.width > objB.x &&
    objA.y < objB.y + objB.height &&
    objA.y + objA.height > objB.y)
```

## Common Modifications

### Adding New Entity Type
1. Add to `gameStateRef.current` initialization
2. Create spawn function in game loop
3. Add update/draw loop section
4. Implement collision detection

### Adjusting Difficulty
- Enemy spawn rate: Line 229 in `GameCanvas.jsx`
- Boss spawn interval: Line 235 (default 2700 frames, ~45s)
- Heart spawn rate: Line 249 (default 1800 frames, ~30s)

## Testing & Debugging

### Quick Test Scenarios
1. **Demo mode**: Wait 60s on menu or click "DEMO MODE"
2. **Boss spawn**: Reduce 2700 to 300 in line 235
3. **Heart spawn**: Reduce 1800 to 180 in line 249
4. **Max difficulty**: Pass `difficulty={5}` to `GameCanvas`

### Common Issues
- **Black canvas**: Check playerImage loading or gradient setup
- **Controls not working**: Verify event listeners and `demoMode=false`
- **Score not saving**: Check localStorage permissions
- **Performance**: Canvas is 1440x1200, reduce for lower-end devices

## Azure Integration
- SPA routing: `staticwebapp.config.json` serves `index.html` for all routes
- Fully client-side—no backend APIs currently
- GitHub Actions workflow: `.github/workflows/azure-static-web-apps-deploy.yml`

## Remember
1. ✅ Always use feature/hotfix branches
2. ✅ Write detailed PR descriptions
3. ✅ Test locally before pushing
4. ❌ Never allow unvalidated user content
5. ❌ Never commit directly to main
