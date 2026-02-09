# Vaporwave Space Invaders

A stylish, neon-themed space invaders game built with React and deployed on Azure. Features a vaporwave aesthetic with glowing UI, interactive gameplay, and a persistent leaderboard.

## Features

- 🎮 **Classic Space Invaders Gameplay**: Dodge enemies, shoot them down, and rack up points
- 🌈 **Vaporwave Theming**: Neon colors, scan line effects, and retro cyberpunk vibes
- 💾 **Persistent Leaderboard**: Your scores are saved in localStorage (upgradeable to Azure Cosmos DB)
- 📱 **Responsive Design**: Works on desktop with keyboard controls
- ⚡ **Built with React + Vite**: Fast development and optimized builds

## Controls

- **Arrow Keys** or **A/D**: Move your ship
- **Spacebar**: Shoot

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

- **Enemies spawn** from the top and move downward at increasing speeds
- **Shoot enemies** to earn 10 points each
- **Missed enemies** cost you 5 points
- **Collision** with an enemy ends the game
- **Difficulty increases** as your score goes up (faster enemy spawn rate)

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
  body: JSON.stringify({ name, score })
})
```

## Customization

- **Colors**: Edit the CSS files to change vaporwave colors
- **Game Speed**: Adjust `speed` values in `GameCanvas.jsx`
- **Difficulty**: Modify enemy spawn rate and speed progression
- **Canvas Size**: Change width/height in `GameCanvas.jsx`

## Technologies Used

- **React 18**: UI framework
- **Vite**: Build tool
- **Canvas API**: Game rendering
- **CSS3**: Styling with gradients and animations
- **LocalStorage API**: Score persistence
- **Azure Static Web Apps**: Cloud deployment

## Future Enhancements

- [ ] Power-ups and special weapons
- [ ] Wave system with boss enemies
- [ ] Sound effects and background music
- [ ] Multiplayer via WebSocket
- [ ] Mobile touch controls
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
