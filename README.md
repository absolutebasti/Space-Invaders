# 👾 Space Invaders

> **A faithful 1:1 recreation of the legendary 1978 Taito arcade classic**

<div align="center">

![Space Invaders Banner](https://img.shields.io/badge/SPACE-INVADERS-00ff00?style=for-the-badge&labelColor=000000&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHRleHQgeT0iMjAiIGZvbnQtc2l6ZT0iMjAiPvCfkb48L3RleHQ+PC9zdmc+)

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Web Audio API](https://img.shields.io/badge/Web_Audio-API-blueviolet?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

**[🎮 Play Now](#-quick-start)** · **[📖 Game Guide](#-how-to-play)** · **[🔧 Technical Details](#-architecture)**

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎯 **Authentic Gameplay** | Exact recreation of original mechanics, scoring, and difficulty scaling |
| 👾 **55 Alien Invaders** | 11×5 formation with 3 distinct types (Squid, Crab, Octopus) |
| 🛸 **Mystery UFO** | Random appearances with special 300-point scoring trick |
| 🛡️ **Destructible Shields** | Pixel-perfect damage from both player and enemy fire |
| 🎵 **Authentic Audio** | 4-note alien march that accelerates as invaders decrease |
| 📺 **CRT Effects** | Scanlines, phosphor glow, and screen curvature |
| 🕹️ **Arcade Cabinet UI** | Beautiful retro cabinet aesthetic |
| 💾 **High Score Persistence** | Your best score saved locally |
| 📱 **Responsive Design** | Scales beautifully on different screen sizes |

---

## 🚀 Quick Start

### Option 1: Python (Recommended)
```bash
# Navigate to the project directory
cd Space-Invaders

# Start a local server
python3 -m http.server 8080

# Open in browser
open http://localhost:8080
```

### Option 2: Node.js
```bash
# Install a simple server globally
npm install -g serve

# Run the server
serve .

# Open the provided URL (usually http://localhost:3000)
```

### Option 3: VS Code Live Server
1. Install the "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

> ⚠️ **Note**: The game uses ES6 modules and must be served via HTTP. Opening `index.html` directly will not work due to CORS restrictions.

---

## 🎮 How to Play

### Controls

| Key | Action |
|-----|--------|
| `←` `→` or `A` `D` | Move laser cannon left/right |
| `SPACE` or `W` | Fire laser |
| `P` or `ESC` | Pause game |
| `ENTER` | Start game / Restart |

### Objective

Destroy all 55 alien invaders before they reach the bottom of the screen. Survive as long as possible and rack up the highest score!

### Scoring

| Target | Points |
|--------|--------|
| 🦑 Squid (top row) | 30 |
| 🦀 Crab (rows 2-3) | 20 |
| 🐙 Octopus (rows 4-5) | 10 |
| 🛸 Mystery UFO | 50, 100, 150, or **300*** |

> 💡 ***Pro Tip**: The 23rd shot and every 15th shot thereafter that hits the UFO awards 300 points!*

### Lives & Extra Life

- Start with **3 lives**
- Earn an **extra life** at **1,500 points**
- Maximum of 6 lives displayed

---

## 🎯 Game Mechanics

### Alien Behavior

```
Speed = BaseSpeed × (55 ÷ RemainingAliens)
```

- Aliens move **faster** as their numbers decrease
- The last alien is **extremely fast**
- Aliens descend one row when reaching screen edges
- Random aliens from bottom rows fire at you

### Bullet Mechanics

- **Player**: Only ONE bullet on screen at a time
- **Aliens**: Up to 3 bullets, 3 types:
  - Straight slow
  - Straight fast  
  - Squiggly (wavy pattern)

### Shields

- 4 protective bunkers
- Take damage from **both** player and alien fire
- Aliens passing through also destroy shield pixels

---

## 🏗️ Architecture

```
Space-Invaders/
├── index.html          # Game container with CRT effects
├── styles.css          # Arcade cabinet styling
├── js/
│   ├── main.js         # Entry point & game loop
│   ├── game.js         # State management & coordination
│   ├── player.js       # Player cannon logic
│   ├── aliens.js       # 11×5 alien formation
│   ├── ufo.js          # Mystery UFO with special scoring
│   ├── shields.js      # Pixel-based destruction
│   ├── projectiles.js  # Bullet management
│   ├── collision.js    # AABB collision detection
│   ├── renderer.js     # Canvas drawing
│   ├── audio.js        # Web Audio sound synthesis
│   └── constants.js    # Configuration & sprites
└── README.md
```

### Tech Stack

- **Vanilla JavaScript** with ES6 modules
- **HTML5 Canvas** for rendering
- **Web Audio API** for synthesized sound
- **CSS3** for arcade cabinet aesthetics
- **No dependencies** - runs in any modern browser

---

## 🎨 Visual Design

The game features authentic visual elements:

| Element | Implementation |
|---------|----------------|
| **Color Regions** | Green (player), White (aliens), Red (UFO) - mimicking original colored overlays |
| **CRT Scanlines** | CSS repeating gradients |
| **Phosphor Glow** | Radial gradients with subtle animation |
| **Screen Curvature** | Border-radius with vignette effect |
| **Arcade Cabinet** | Neon glow, marquee lighting |

---

## 🔊 Audio System

All sounds are synthesized using the Web Audio API:

| Sound | Implementation |
|-------|----------------|
| **Alien March** | 4-note bass sequence (A1, G1, F#1, E1) |
| **Shoot** | High-frequency sweep (1500Hz → 500Hz) |
| **Explosions** | White noise burst with envelope |
| **UFO** | Sine wave with LFO modulation |
| **Extra Life** | Ascending arpeggio (C5, E5, G5, C6) |

The march tempo **increases** as aliens are destroyed!

---

## 📜 Historical Accuracy

This recreation faithfully implements the original 1978 game mechanics:

| Feature | Original | This Clone |
|---------|----------|------------|
| Alien Grid | 11×5 (55 total) | ✅ |
| Single-shot limit | Yes | ✅ |
| Speed scaling | Exponential | ✅ |
| UFO 300pt trick | 23rd + every 15th | ✅ |
| Shield destruction | Pixel-based | ✅ |
| 4-note march | A1, G1, F#1, E1 | ✅ |
| Extra life at 1500 | Yes | ✅ |

---

## 🌟 Credits

- **Original Game**: [Tomohiro Nishikado](https://en.wikipedia.org/wiki/Tomohiro_Nishikado), Taito Corporation (1978)
- **This Recreation**: Built with ❤️ as an educational project

---

## 📄 License

This project is created for educational purposes. Space Invaders is a trademark of Taito Corporation.

---

<div align="center">

### 🎮 Ready to defend Earth?

**Press ENTER to start!**

```
    ▓▓          ▓▓▓▓▓▓          ▓▓▓▓
  ▓▓▓▓▓▓      ▓▓▓▓▓▓▓▓▓▓      ▓▓▓▓▓▓▓▓
▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓
▓▓░░▓▓░░▓▓  ▓▓░░▓▓▓▓░░▓▓▓▓  ▓▓░░▓▓▓▓░░▓▓
▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓
  ▓▓  ▓▓      ▓▓  ▓▓  ▓▓      ▓▓    ▓▓
▓▓      ▓▓  ▓▓  ▓▓  ▓▓  ▓▓  ▓▓        ▓▓
```

*They're coming. Will you stop them?*

</div>