# 234 Player Games — Mega Edition

50 mini-games · 215 free skins · 1–6 players on one device or online

## Stack
- **Frontend**: Phaser.js 3 (browser game engine)
- **Backend**: Node.js + Express + Socket.io
- **Database**: PostgreSQL (Railway)
- **Auth**: Firebase (Google Sign-In)
- **Deploy**: Railway

## Setup

### 1. Clone & install
```bash
git clone <repo>
cd IDKwIdo
npm install          # root deps
cd server && npm install
cd ../client && npm install
```

### 2. Environment
```bash
cp .env.example .env
# Fill in your Firebase + PostgreSQL credentials
```

### 3. Database
```bash
cd server
psql $DATABASE_URL -f db/schema.sql
```

### 4. Run locally
```bash
# Terminal 1 — server
cd server && npm run dev

# Terminal 2 — client
cd client && npm run dev
```

### 5. Deploy to Railway
- Connect your GitHub repo to Railway
- Set environment variables in Railway dashboard
- Railway auto-detects `railway.json` and deploys both services

## Games (50 total)
Battle Royale, Soccer, Basketball, Tank Battle, Bomb Game, Platformer Race, Snowball Fight, Sword Fight, Sumo, Volleyball, Bow & Arrow, Car Racing, Tug of War, Dodgeball, Ice Slide, Lava Jump, Coin Collector, Color Flood, Snake, Pong, Air Hockey, Mini Golf, Fishing, Cooking Battle, Gardening Race, Treasure Hunt, Maze Race, Bubble Shooter, Tower Defense, Card Battle, Cannon Ball, King of the Hill, Capture the Flag, Ghost Chase, Zombie Survival, Space Race, Pinball, Breakout, Asteroid Shooter, Rock Paper Scissors, Billiards, Darts, Bowling, Farm Race, Ice Hockey, Ninja Dash, Catapult Wars, Color Paint, Penguin Slide, Dance Off

## Skins (215 total — all free)
Animals · Fantasy · Sci-Fi · Food · Sports · Seasonal · Nature · Pixel · Kawaii · Legendary
