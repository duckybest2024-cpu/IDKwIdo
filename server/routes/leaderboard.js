const router = require('express').Router();
const { verifyToken } = require('../middleware/auth');
const { db }          = require('../db/queries');

router.get('/:gameType', async (req, res) => {
  try {
    res.json(await db.getLeaderboard(req.params.gameType));
  } catch {
    res.status(500).json({ error: 'Failed' });
  }
});

router.post('/:gameType', verifyToken, async (req, res) => {
  const { score } = req.body;
  if (typeof score !== 'number') return res.status(400).json({ error: 'score required' });
  try {
    await db.recordScore(req.user.id, req.params.gameType, score);
    await db.addCoins(req.user.id, Math.floor(score / 10) + 5);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed' });
  }
});

module.exports = router;
