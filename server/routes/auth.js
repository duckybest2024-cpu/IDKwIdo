const router = require('express').Router();
const { verifyToken } = require('../middleware/firebaseAuth');
const { db } = require('../db/queries');

// Called after Google Sign-In on the client — creates user if first time
router.post('/login', verifyToken, async (req, res) => {
  try {
    let user = await db.getUser(req.user.uid);
    if (!user) {
      user = await db.createUser(
        req.user.uid,
        req.user.name || req.user.email?.split('@')[0] || 'Player',
        req.user.picture || null
      );
    }
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
