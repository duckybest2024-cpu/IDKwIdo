require('dotenv').config({ path: '../.env' });
const express    = require('express');
const http       = require('http');
const path       = require('path');
const { Server } = require('socket.io');
const cors       = require('cors');
const { connectDB }              = require('./db/queries');
const authRoutes                 = require('./routes/auth');
const userRoutes                 = require('./routes/users');
const skinsRoutes                = require('./routes/skins');
const leaderboardRoutes          = require('./routes/leaderboard');
const { registerSocketHandlers } = require('./socket/gameRoom');

const app    = express();
const server = http.createServer(app);
const CLIENT = process.env.CLIENT_URL || 'http://localhost:5173';
const isProd = process.env.NODE_ENV === 'production';

const io = new Server(server, {
  cors: { origin: isProd ? false : CLIENT, methods: ['GET','POST'], credentials: true },
});

if (!isProd) app.use(cors({ origin: CLIENT, credentials: true }));
app.use(express.json());

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok' }));

// API routes
app.use('/api/auth',        authRoutes);
app.use('/api/users',       userRoutes);
app.use('/api/skins',       skinsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Serve built Phaser client in production
if (isProd) {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  // SPA fallback — all non-API routes serve index.html
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

async function start() {
  await connectDB();
  registerSocketHandlers(io);
  const port = process.env.PORT || 3000;
  server.listen(port, () => console.log(`Server on :${port} [${isProd ? 'production' : 'dev'}]`));
}

start();
