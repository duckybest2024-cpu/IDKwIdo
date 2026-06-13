require('dotenv').config({ path: '../.env' });
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { initFirebase } = require('./middleware/firebaseAuth');
const { connectDB } = require('./db/queries');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const skinsRoutes = require('./routes/skins');
const leaderboardRoutes = require('./routes/leaderboard');
const { registerSocketHandlers } = require('./socket/gameRoom');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.get('/health', (_, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skins', skinsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

async function start() {
  await initFirebase();
  await connectDB();
  registerSocketHandlers(io);
  const port = process.env.PORT || 3000;
  server.listen(port, () => console.log(`Server running on :${port}`));
}

start();
