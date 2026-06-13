const router = require('express').Router();
const { verifyToken } = require('../middleware/firebaseAuth');
const { db } = require('../db/queries');

router.get('/:gameType', async (req, res) => {
  try {
    const rows = await db.getLeaderboard(req.params.gameType);
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Failed' });
  }
});

router.post('/:gameType', verifyToken, async (req, res) => {
  const { score } = req.body;
  if (typeof score !== 'number') return res.status(400).json({ error: 'score required' });
  try {
    const user = await db.getUser(req.user.uid);
    await db.recordScore(user.id, req.params.gameType, score);
    // Reward coins for playing
    await db.addCoins(user.id, Math.floor(score / 10) + 5);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed' });
  }
});

module.exports = router;
