# GitHub Copilot Space Invaders 🚀

A stylish, neon-themed space invaders game built with React for the **Microsoft AI Tour London 2026**. Features a vaporwave aesthetic with glowing UI, interactive gameplay, difficulty levels, boss battles, and a persistent leaderboard.

## Features

- 🎮 **Enhanced Space Invaders Gameplay**: 3 lives, heart pickups, boss battles, and score multipliers
- 🌈 **Vaporwave Theming**: Neon colors, scan line effects, and retro cyberpunk vibes with GitHub Copilot branding
- 🎯 **5 Difficulty Levels**: From ROOKIE to IMPOSSIBLE with adaptive enemy speeds and score multipliers
- 👾 **Boss Enemies**: Large bosses with 5 health spawn every ~45 seconds for 10x points
- ❤️ **Lives & Hearts**: Start with 3 lives, collect heart pickups to gain more (max 9)
- 🤖 **Demo Mode**: Auto-starts after 1 minute of inactivity for attraction mode
- 💾 **Persistent Leaderboard**: Scores saved in localStorage with difficulty tracking (upgradeable to Azure Cosmos DB)
- 📱 **Responsive Design**: Works on desktop with keyboard controls
- ⚡ **Built with React + Vite**: Fast development and optimized builds

## Controls

- **Arrow Left/Right** or **A/D**: Move your ship
- **Spacebar**: Shoot
- **Arrow Down** or **S**: Speed boost (doubles enemy fall speed)
- **Escape**: Quit to menu

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:3000`

## Deployment to Azure

### Option 1: Azure Static Web Apps (Recommended)

1. Create a GitHub repository and push this code
2. In Azure Portal, create a new Static Web App resource
3. Connect it to your GitHub repository
4. Select the build settings:
   - Build preset: React
   - App location: `/`
   - Output location: `dist`
5. Azure will automatically build and deploy on every push to main

### Option 2: Azure App Service

```bash
# Build the app
npm run build

# Deploy using Azure CLI
az webapp up --name <app-name> --resource-group <resource-group>
```

## Game Mechanics

### Difficulty Levels
- Choose from 5 difficulty levels before playing:
  - **ROOKIE** (👾): Slower enemies, 1x score multiplier
  - **WARRIOR** (👾👾): Moderate speed, 1.25x multiplier
  - **LEGEND** (👾👾👾): Fast enemies, 1.5x multiplier
  - **NIGHTMARE** (👾👾👾👾): Very fast, 1.75x multiplier
  - **IMPOSSIBLE** (👾👾👾👾👾): Maximum speed, 2x multiplier

### Gameplay
- **Lives System**: Start with 3 lives, can collect up to 9
- **Regular Enemies**: Fall from the top, shoot for points (10 × difficulty multiplier)
- **Boss Enemies**: Spawn every ~45 seconds with 5 health, worth 10x points (100 × difficulty multiplier)
- **Heart Pickups**: Randomly spawn to restore 1 life
- **Missed Enemies**: Cost you 1 life when they reach the bottom
- **Collisions**: Cost you 1 life, but you can continue if lives remain
- **Speed Boost**: Hold Down/S to make enemies fall twice as fast
- **Progressive Difficulty**: Enemy spawn rate increases with your score
- **Demo Mode**: AI-controlled showcase mode starts after 1 minute of menu inactivity

## Architecture

```
src/
├── App.jsx                 # Main app component with game state
├── App.css                 # Vaporwave styling
├── components/
│   ├── GameCanvas.jsx      # Canvas-based game rendering
│   ├── GameCanvas.css      # Game styling
│   ├── Leaderboard.jsx     # Score display component
│   └── Leaderboard.css     # Leaderboard styling
├── main.jsx               # React entry point
└── index.css              # Global styles
```

## Upgrading to Database Storage

To persist scores across user sessions and devices:

1. **Azure Cosmos DB**: Replace localStorage with Cosmos DB queries
2. **Azure Functions**: Create API endpoints for score submission and retrieval
3. **Update App.jsx**: Fetch/post scores from the API instead of localStorage

Example:
```javascript
// Replace localStorage with API calls
const response = await fetch('/api/scores', {
  method: 'POST',
  body: JSON.stringify({ name, score, difficulty, timestamp: Date.now() })
})
```

## Customization

- **Colors**: Edit the CSS files to change vaporwave colors
- **Game Speed**: Adjust `speed` values in `GameCanvas.jsx`
- **Difficulty**: Modify the 5 difficulty levels and their multipliers in `App.jsx`
- **Boss Settings**: Adjust boss health, spawn rate, and size in `GameCanvas.jsx`
- **Canvas Size**: Change width/height in `GameCanvas.jsx`

## Technologies Used

- **React 18**: UI framework
- **Vite**: Build tool
- **Canvas API**: Game rendering
- **CSS3**: Styling with gradients and animations
- **LocalStorage API**: Score persistence
- **Azure Static Web Apps**: Cloud deployment

## Future Enhancements

- [x] ~~Wave system with boss enemies~~ ✅ Implemented
- [x] ~~Lives system~~ ✅ Implemented  
- [x] ~~Difficulty levels~~ ✅ Implemented
- [x] ~~Demo/Attract mode~~ ✅ Implemented
- [ ] Power-ups and special weapons
- [ ] Sound effects and background music
- [ ] Mobile touch controls
- [ ] Different enemy types with unique behaviors
- [ ] Azure Cosmos DB for global leaderboard
- [ ] User authentication with Azure AD

## License

MIT - Feel free to use and modify!

## Vaporwave Color Palette

- Primary Cyan: `#00ffff` 
- Primary Green: `#00ff88`
- Primary Magenta: `#ff006e`
- Primary Yellow: `#ffff00`
- Dark Background: `#0a0e27`, `#1a0033`

---

**Made with ✨ and neon vibes**
