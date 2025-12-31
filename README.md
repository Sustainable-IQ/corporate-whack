# Corporate Whack 🔨

**The Office Survival Game**

A whack-a-mole style arcade game where you're a corporate employee fighting your way from Junior Staff to CEO. Solve problems, avoid culture traps, and try not to get fired.

## 🎮 How to Play

**WHACK the problems:**
- 📧 Unread Emails
- 📝 Contract Negotiations  
- 👥 Staff Conflicts
- 🐛 Software Bugs
- 💻 IT Problems
- 📊 Reports Due
- 📞 Missed Calls
- 🔥 Client Complaints
- 📅 Meeting Overload

**DO NOT WHACK the culture items:**
- 🎭 Team Building Exercise
- 🏆 Employee of the Month
- 🤝 Mandatory Fun
- 📣 All-Hands Meeting
- 🎂 Birthday Party
- 💬 Open Door Policy

## 📈 Levels

1. **Junior Staff** - Easy start, mostly problems
2. **Senior Staff** - Faster, more responsibilities
3. **Director** - Culture traps increase
4. **Head of Department** - Everything at once
5. **CEO** - Chaos mode, 50/50 problems vs culture

## 🎯 Rules

- Hit **10 problems** per level to advance
- You have **60 seconds** per level
- Must maintain at least **50% success rate** or get demoted
- **5 culture violations** = FIRED
- Beat CEO level = **Retire in glory**

## 🚀 Deployment to GitHub Pages

1. Create a new repository on GitHub called `corporate-whack`

2. Clone it locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/corporate-whack.git
   ```

3. Copy all files from this folder into the cloned repo

4. Push to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

5. Enable GitHub Pages:
   - Go to repository **Settings**
   - Click **Pages** in the sidebar
   - Under "Source", select **main** branch
   - Click **Save**

6. Your game will be live at:
   ```
   https://YOUR_USERNAME.github.io/corporate-whack
   ```

## 🛠 Tech Stack

- **Three.js** - 3D rendering
- **Web Audio API** - Retro sound effects
- **Vanilla JavaScript** - No build step required
- **CSS3** - Retro arcade styling

## 📁 Project Structure

```
corporate-whack/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Retro arcade styles
├── js/
│   ├── main.js         # Entry point, scene setup
│   ├── game.js         # Game state management
│   ├── moles.js        # Mole spawning & hit detection
│   ├── levels.js       # Level configuration
│   └── sounds.js       # Web Audio sound effects
├── assets/
│   ├── sounds/         # (unused - sounds are generated)
│   └── textures/       # (unused - textures are generated)
└── README.md           # This file
```

## 🎨 Customization

### Add New Problem Types
Edit `js/levels.js` and add to the `PROBLEMS` array:
```javascript
{ id: 'meeting', emoji: '📅', label: 'Endless Meeting', color: 0x95a5a6 }
```

### Add New Culture Traps
Edit `js/levels.js` and add to the `CULTURE` array:
```javascript
{ id: 'retreat', emoji: '🏕️', label: 'Team Retreat', color: 0x00ced1 }
```

### Adjust Difficulty
Edit level configurations in `js/levels.js`:
- `moleVisibleTime` - How long moles stay up (ms)
- `spawnInterval` - Time between spawns (ms)
- `maxActiveMoles` - Maximum moles at once
- `problemRatio` - Ratio of problems vs culture (0.0 - 1.0)

## 📝 License

MIT License - do whatever you want with it.

## 🙏 Credits

Created by Claude & Luc for the [lucandthemachine.com](https://lucandthemachine.com) project.

*"Where Fire Walks Like Thought"*

