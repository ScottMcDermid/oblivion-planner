# Oblivion Planner ⚔️

[![Live Site](https://img.shields.io/badge/demo-plan.oblivion.tools-5e81ac?style=flat-square&logo=googlechrome&logoColor=white)](https://plan.oblivion.tools)
[![License](https://img.shields.io/badge/license-MIT-3b4252?style=flat-square)](LICENSE)

Plan your The Elder Scrolls IV: Oblivion character's leveling trajectory with confidence.

## ✨ Highlights
- 📊 Track attribute and skill progress across planned levels.
- 🧮 Experiment with builds before committing in-game.
- 🌐 Share your plan via the hosted app at `plan.oblivion.tools`.

## 🚀 Launching

### 🧑‍💻 Development
1. Ensure `docker`, `docker compose`, and `make` are installed.
2. Start the development server:
   ```bash
   make dev
   ```
3. Navigate to [http://localhost:3000](http://localhost:3000).

### 📦 Production
Start the production stack instead:
```bash
make prod
```

Then head to [http://localhost:3000](http://localhost:3000).

## 🔧 Environment Variables

Create or modify a local `.env` file to tweak runtime configuration.

| Name             | Purpose                |
| ---------------- | ---------------------- |
| `CONTAINER_NAME` | Docker container name  |
| `PORT`           | Port server listens to |

## ⚖️ Legal & Transparency
- **Trademarks:** “The Elder Scrolls” and “Oblivion” are trademarks of ZeniMax Media Inc. and/or Bethesda Softworks LLC. This planner is an unofficial fan project and is not endorsed by, affiliated with, or sponsored by those rights holders.
- **Copyright:** Source code is released under the MIT License—see `LICENSE` for the full text. Please ensure any contributed assets (text, imagery, data) are original or properly licensed so they can be redistributed under the project’s terms.
- **Community Transparency:** Issues, pull requests, and discussions are public. By contributing you agree that project maintainers may reference your contributions in release notes or community updates. We do not collect or store personal data beyond what GitHub or your chosen communication channel provides.

## 🆘 Need Help?
- 🐛 Found a bug or have feedback? Open an issue or start a discussion.
- 💡 Ideas for new features? PRs are welcome!
