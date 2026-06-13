const SERVER = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';
const TOKEN_KEY = '234games_token';

class AuthManager {
  constructor() {
    this.token   = null;
    this.profile = null;   // full DB user object (id, username, coins, gems, skins, ...)
    this._listeners = [];
  }

  // Call once on page load — picks up token from URL ?token= or localStorage
  async init() {
    // GitHub OAuth redirect drops ?token= in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken  = urlParams.get('token');
    const authError = urlParams.get('auth_error');

    if (authError) {
      console.warn('Auth error:', authError);
      window.history.replaceState({}, '', window.location.pathname);
    }

    if (urlToken) {
      this.token = urlToken;
      localStorage.setItem(TOKEN_KEY, urlToken);
      // Clean the token out of the URL bar
      window.history.replaceState({}, '', window.location.pathname);
    } else {
      this.token = localStorage.getItem(TOKEN_KEY);
    }

    if (this.token) {
      await this._fetchProfile();
    }

    this._notify();
    return this.profile;
  }

  signOut() {
    this.token   = null;
    this.profile = null;
    localStorage.removeItem(TOKEN_KEY);
    this._notify();
    // Redirect to login screen
    window.location.reload();
  }

  // Refresh profile data from server
  async refreshProfile() {
    await this._fetchProfile();
    this._notify();
  }

  async _fetchProfile() {
    try {
      const res = await fetch(`${SERVER}/api/auth/me`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      if (res.status === 401) {
        // Token expired or invalid
        this.token = null;
        localStorage.removeItem(TOKEN_KEY);
        return;
      }
      this.profile = await res.json();
    } catch (e) {
      console.warn('Could not reach server, running offline:', e.message);
    }
  }

  authHeader() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  onChange(fn) { this._listeners.push(fn); }
  _notify()    { this._listeners.forEach(fn => fn(this.profile)); }

  get isLoggedIn()   { return !!this.token && !!this.profile; }
  get displayName()  { return this.profile?.username || 'Guest'; }
  get avatarUrl()    { return this.profile?.avatar_url || null; }
  get coins()        { return this.profile?.coins  ?? 500; }
  get gems()         { return this.profile?.gems   ?? 10; }
  get ownedSkins()   { return this.profile?.skins  ?? []; }
}

export const authManager = new AuthManager();
