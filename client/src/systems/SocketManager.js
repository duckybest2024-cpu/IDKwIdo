import { io } from 'socket.io-client';
import { authManager } from './AuthManager.js';

const SERVER = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

class SocketManager {
  constructor() {
    this.socket   = null;
    this._handlers = new Map();
  }

  connect() {
    if (this.socket?.connected) return;
    this.socket = io(SERVER, {
      auth:       { token: authManager.token },
      transports: ['websocket'],
    });
    this.socket.on('connect',    () => console.log('Socket connected'));
    this.socket.on('disconnect', () => console.log('Socket disconnected'));
    this.socket.onAny((event, data) => {
      const fn = this._handlers.get(event);
      if (fn) fn(data);
    });
  }

  on(event, fn)  { this._handlers.set(event, fn); }
  off(event)     { this._handlers.delete(event); }

  createRoom(gameType, maxPlayers, playerName, skinId) {
    this.socket.emit('create_room', { gameType, maxPlayers, playerName, skinId });
  }
  joinRoom(roomId, playerName, skinId) {
    this.socket.emit('join_room', { roomId, playerName, skinId });
  }
  ready()              { this.socket.emit('player_ready'); }
  sendInput(input)     { this.socket.emit('game_input', input); }
  sendGameEvent(event) { this.socket.emit('game_event', event); }
  chat(message)        { this.socket.emit('chat_message', { message }); }
  disconnect()         { this.socket?.disconnect(); }
}

export const socketManager = new SocketManager();
