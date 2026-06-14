const express = require('express');
const http    = require('http');
const path    = require('path');
const { Server } = require('socket.io');
const { v4: uuid } = require('crypto');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server);

// Serve the whole game as static files
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// In-memory rooms (reset on server restart — fine for a party game)
const rooms = new Map();

io.on('connection', (socket) => {
  socket.on('create_room', ({ gameType, maxPlayers, playerName, skinId }) => {
    const roomId = Math.random().toString(36).slice(2, 8).toUpperCase();
    const player = { id: socket.id, name: playerName || 'Player 1', skinId: skinId || 'cat_white', ready: false };
    rooms.set(roomId, { roomId, gameType, maxPlayers: maxPlayers || 4, host: socket.id, players: [player], state: 'lobby' });
    socket.join(roomId);
    socket.roomId = roomId;
    socket.emit('room_created', { roomId, room: rooms.get(roomId) });
  });

  socket.on('join_room', ({ roomId, playerName, skinId }) => {
    const room = rooms.get(roomId);
    if (!room)                             return socket.emit('error', { message: 'Room not found' });
    if (room.players.length >= room.maxPlayers) return socket.emit('error', { message: 'Room full' });
    if (room.state !== 'lobby')            return socket.emit('error', { message: 'Game already started' });
    const player = { id: socket.id, name: playerName || `Player ${room.players.length + 1}`, skinId: skinId || 'frog_green', ready: false };
    room.players.push(player);
    socket.join(roomId);
    socket.roomId = roomId;
    socket.emit('room_joined', { roomId, room });
    io.to(roomId).emit('room_updated', room);
  });

  socket.on('player_ready', () => {
    const room = rooms.get(socket.roomId);
    if (!room) return;
    const p = room.players.find(p => p.id === socket.id);
    if (p) p.ready = true;
    io.to(socket.roomId).emit('room_updated', room);
    if (room.players.length >= 2 && room.players.every(p => p.ready) && socket.id === room.host) {
      room.state = 'playing';
      io.to(socket.roomId).emit('game_start', { gameType: room.gameType, players: room.players, hostId: room.host });
    }
  });

  socket.on('game_input',  (input) => socket.to(socket.roomId).emit('player_input', { playerId: socket.id, input }));
  socket.on('game_event',  (event) => { if (socket.roomId) io.to(socket.roomId).emit('game_event', event); });
  socket.on('chat_message',({ message }) => {
    const room = rooms.get(socket.roomId);
    const p = room?.players.find(p => p.id === socket.id);
    io.to(socket.roomId).emit('chat_message', { sender: p?.name || '?', message: String(message).slice(0, 200) });
  });

  socket.on('disconnect', () => {
    const room = rooms.get(socket.roomId);
    if (!room) return;
    room.players = room.players.filter(p => p.id !== socket.id);
    if (room.players.length === 0) { rooms.delete(socket.roomId); return; }
    if (room.host === socket.id) room.host = room.players[0].id;
    io.to(socket.roomId).emit('room_updated', room);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`234 Player Games running on :${PORT}`));
