import { auth, signInWithGoogle, logout, onAuthStateChanged } from '../config/firebase.js';

const SERVER = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

class AuthManager {
  constructor() {
    this.user = null;       // Firebase user
    this.profile = null;    // DB profile
    this.token = null;
    this.listeners = [];
  }

  init() {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          this.user = firebaseUser;
          this.token = await firebaseUser.getIdToken();
          await this._syncProfile();
        } else {
          this.user = null;
          this.profile = null;
          this.token = null;
        }
        this._notify();
        resolve(this.user);
      });
    });
  }

  async signIn() {
    const u = await signInWithGoogle();
    this.token = await u.getIdToken();
    await this._syncProfile();
    this._notify();
    return u;
  }

  async signOut() {
    await logout();
  }

  async _syncProfile() {
    try {
      const res = await fetch(`${SERVER}/api/auth/login`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${this.token}`, 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      this.profile = data.user;
    } catch (e) {
      console.warn('Could not sync profile:', e.message);
    }
  }

  async refreshToken() {
    if (this.user) this.token = await this.user.getIdToken(true);
    return this.token;
  }

  onChange(fn) { this.listeners.push(fn); }
  _notify() { this.listeners.forEach(fn => fn(this.user, this.profile)); }

  get isLoggedIn() { return !!this.user; }
  get displayName() { return this.profile?.username || this.user?.displayName || 'Guest'; }
  get coins() { return this.profile?.coins ?? 500; }
  get gems() { return this.profile?.gems ?? 10; }
}

export const authManager = new AuthManager();
