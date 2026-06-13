const router = require('express').Router();
const { verifyToken } = require('../middleware/auth');
const { db }          = require('../db/queries');

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await db.getUser(req.user.uid);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const skins = await db.getUserSkins(user.id);
    res.json({ ...user, skins });
  } catch {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.patch('/username', verifyToken, async (req, res) => {
  const { username } = req.body;
  if (!username || username.length < 2 || username.length > 20)
    return res.status(400).json({ error: 'Username must be 2-20 characters' });
  try {
    await db.query('UPDATE users SET username=$1 WHERE id=$2', [username, req.user.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to update username' });
  }
});

module.exports = router;
