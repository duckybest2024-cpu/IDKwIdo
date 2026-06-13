const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const rooms = new Map();

function registerSocketHandlers(io) {
  io.on('connection', async (socket) => {
    // Verify JWT from socket handshake
    let user = null;
    const token = socket.handshake.auth?.token;
    if (token) {
      try {
        user = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = user;
      } catch { /* guest */ }
    }

    socket.on('create_room', ({ gameType, maxPlayers, playerName, skinId }) => {
      const roomId = uuidv4().slice(0, 6).toUpperCase();
      const player = {
        id: socket.id,
        uid: user?.uid || null,
        name: playerName || user?.username || 'Player 1',
        skinId: skinId || 'cat_white',
        score: 0,
        ready: false,
      };
      rooms.set(roomId, {
        roomId, gameType,
        maxPlayers: Math.min(maxPlayers || 4, 6),
        host: socket.id,
        players: [player],
        state: 'lobby',
      });
      socket.join(roomId);
      socket.roomId = roomId;
      socket.emit('room_created', { roomId, room: sanitize(rooms.get(roomId)) });
    });

    socket.on('join_room', ({ roomId, playerName, skinId }) => {
      const room = rooms.get(roomId);
      if (!room)                            return socket.emit('error', { message: 'Room not found' });
      if (room.players.length >= room.maxPlayers) return socket.emit('error', { message: 'Room full' });
      if (room.state !== 'lobby')           return socket.emit('error', { message: 'Game in progress' });
      const player = {
        id: socket.id,
        uid: user?.uid || null,
        name: playerName || user?.username || `Player ${room.players.length + 1}`,
        skinId: skinId || 'frog_green',
        score: 0,
        ready: false,
      };
      room.players.push(player);
      socket.join(roomId);
      socket.roomId = roomId;
      socket.emit('room_joined', { roomId, room: sanitize(room) });
      io.to(roomId).emit('room_updated', sanitize(room));
    });

    socket.on('player_ready', () => {
      const room = rooms.get(socket.roomId);
      if (!room) return;
      const p = room.players.find(p => p.id === socket.id);
      if (p) p.ready = true;
      io.to(socket.roomId).emit('room_updated', sanitize(room));
      if (room.players.length >= 2 && room.players.every(p => p.ready) && socket.id === room.host)
        startGame(io, room);
    });

    socket.on('game_input', (input) => {
      const room = rooms.get(socket.roomId);
      if (!room || room.state !== 'playing') return;
      socket.to(socket.roomId).emit('player_input', { playerId: socket.id, input });
    });

    socket.on('game_event', (event) => {
      const room = rooms.get(socket.roomId);
      if (!room || room.state !== 'playing' || socket.id !== room.host) return;
      io.to(socket.roomId).emit('game_event', event);
      if (event.type === 'game_over') {
        room.state = 'results';
        setTimeout(() => rooms.delete(socket.roomId), 60_000);
      }
    });

    socket.on('chat_message', ({ message }) => {
      const room = rooms.get(socket.roomId);
      if (!room) return;
      const p = room.players.find(p => p.id === socket.id);
      io.to(socket.roomId).emit('chat_message', {
        sender: p?.name || 'Unknown',
        message: String(message).slice(0, 200),
      });
    });

    socket.on('disconnect', () => {
      const roomId = socket.roomId;
      if (!roomId) return;
      const room = rooms.get(roomId);
      if (!room) return;
      room.players = room.players.filter(p => p.id !== socket.id);
      if (room.players.length === 0) { rooms.delete(roomId); return; }
      if (room.host === socket.id) room.host = room.players[0].id;
      io.to(roomId).emit('room_updated', sanitize(room));
      io.to(roomId).emit('player_left', { playerId: socket.id });
    });
  });
}

function startGame(io, room) {
  room.state = 'playing';
  io.to(room.roomId).emit('game_start', {
    gameType: room.gameType,
    players:  room.players,
    hostId:   room.host,
  });
}

function sanitize(room) {
  return {
    roomId:     room.roomId,
    gameType:   room.gameType,
    maxPlayers: room.maxPlayers,
    players:    room.players,
    state:      room.state,
    host:       room.host,
  };
}

module.exports = { registerSocketHandlers };
