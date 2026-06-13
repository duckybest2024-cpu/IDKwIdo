# 234 Player Games — Mega Edition

50 mini-games · 215 free skins · 1–6 players on one device or online

## Stack
| Layer | Tech |
|-------|------|
| Frontend | Phaser.js 3 + Vite |
| Backend  | Node.js + Express + Socket.io |
| Database | PostgreSQL (Railway plugin) |
| Auth     | **GitHub OAuth 2.0 + JWT** |
| Deploy   | **Railway** |

---

## Quick Start (local)

```bash
git clone <repo> && cd IDKwIdo

# Install everything
cd server && npm install
cd ../client && npm install

# Copy env and fill in values
cp .env.example .env
```

Edit `.env`:
```
GITHUB_CLIENT_ID=<from github.com/settings/developers>
GITHUB_CLIENT_SECRET=<same app>
GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback
JWT_SECRET=any-long-random-string
DATABASE_URL=postgresql://localhost/234games
CLIENT_URL=http://localhost:5173
VITE_SERVER_URL=http://localhost:3000
```

```bash
# Terminal 1 — server
cd server && npm run dev

# Terminal 2 — client
cd client && npm run dev
# Open http://localhost:5173
```

---

## Deploy to Railway

### 1. Create a Railway project
- railway.app → New Project → Deploy from GitHub repo
- Select this repo

### 2. Add PostgreSQL
- In Railway dashboard: **+ New** → **Database** → **PostgreSQL**
- Railway auto-injects `DATABASE_URL` into your service

### 3. Run the schema once
```bash
psql $DATABASE_URL -f server/db/schema.sql
```
(Or use Railway's query console)

### 4. Set environment variables in Railway
```
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GITHUB_CALLBACK_URL=https://<your-app>.railway.app/api/auth/github/callback
JWT_SECRET=...
CLIENT_URL=https://<your-app>.railway.app
VITE_SERVER_URL=https://<your-app>.railway.app
NODE_ENV=production
```

### 5. Create a GitHub OAuth App
- github.com/settings/developers → OAuth Apps → New
- **Homepage URL**: `https://<your-app>.railway.app`
- **Callback URL**: `https://<your-app>.railway.app/api/auth/github/callback`
- Copy Client ID + Secret into Railway env vars

### 6. Build & deploy
Railway runs `npm start` (which serves the built client from `/dist`).
Add a build step in Railway settings: `cd client && npm install && npm run build`

---

## Games (50 total)
**Fully playable now:** Battle Royale · Soccer · Tank Battle · Bomb Game · Platformer Race

**Coming soon (45):** Basketball, Car Racing, Sword Fight, Bow & Arrow, Sumo, Volleyball, Snowball Fight, Tug of War, Dodgeball, Ice Slide, Lava Jump, Coin Collector, Color Flood, Snake, Pong, Air Hockey, Mini Golf, Fishing, Cooking Battle, Gardening Race, Treasure Hunt, Maze Race, Bubble Shooter, Tower Defense, Card Battle, Cannon Ball, King of the Hill, Capture the Flag, Ghost Chase, Zombie Survival, Space Race, Pinball, Breakout, Asteroid Shooter, RPS Battle, Billiards, Darts, Bowling, Farm Race, Ice Hockey, Ninja Dash, Catapult Wars, Color Paint, Penguin Slide, Dance Off

## Skins (215 total — all free, earned by playing)
Animals (40) · Fantasy (30) · Sci-Fi (25) · Food (20) · Sports (20) · Seasonal (20) · Nature (20) · Pixel (15) · Kawaii (15) · Legendary (10)

## Controls (local multiplayer)
| Player | Move | Action |
|--------|------|--------|
| P1 | WASD | F |
| P2 | Arrow keys | Enter |
| P3 | IJKL | H |
| P4 | TFGH | Y |
