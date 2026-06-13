const router = require('express').Router();
const fetch  = require('node-fetch');
const jwt    = require('jsonwebtoken');
const { db } = require('../db/queries');

const CLIENT_ID     = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const CALLBACK_URL  = process.env.GITHUB_CALLBACK_URL;
const CLIENT_URL    = process.env.CLIENT_URL || 'http://localhost:5173';

// Step 1 — redirect user to GitHub
router.get('/github', (_req, res) => {
  const params = new URLSearchParams({
    client_id:    CLIENT_ID,
    redirect_uri: CALLBACK_URL,
    scope:        'read:user user:email',
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
});

// Step 2 — GitHub redirects back here with ?code=
router.get('/github/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect(`${CLIENT_URL}?auth_error=no_code`);

  try {
    // Exchange code for access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code }),
    });
    const { access_token, error } = await tokenRes.json();
    if (error || !access_token)
      return res.redirect(`${CLIENT_URL}?auth_error=token_exchange_failed`);

    // Fetch GitHub user profile
    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}`, 'User-Agent': '234-player-games' },
    });
    const ghUser = await userRes.json();

    // Fetch primary email if not public
    let email = ghUser.email;
    if (!email) {
      const emailRes = await fetch('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${access_token}`, 'User-Agent': '234-player-games' },
      });
      const emails = await emailRes.json();
      email = emails.find(e => e.primary)?.email || null;
    }

    const uid = `github_${ghUser.id}`;
    let user = await db.getUser(uid);
    if (!user) user = await db.createUser(uid, ghUser.login, ghUser.avatar_url, email);

    // Issue our own JWT (7 day expiry)
    const token = jwt.sign(
      { id: user.id, uid, username: user.username, avatar: user.avatar_url },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send token to frontend via redirect (stored in localStorage by the client)
    res.redirect(`${CLIENT_URL}?token=${encodeURIComponent(token)}`);
  } catch (err) {
    console.error('OAuth error:', err);
    res.redirect(`${CLIENT_URL}?auth_error=server_error`);
  }
});

// Verify a stored token and return fresh user data
router.get('/me', async (req, res) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    const user    = await db.getUser(decoded.uid);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const skins = await db.getUserSkins(user.id);
    res.json({ ...user, skins });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
