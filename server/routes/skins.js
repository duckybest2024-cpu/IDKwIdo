const router = require('express').Router();
const { verifyToken } = require('../middleware/firebaseAuth');
const { db } = require('../db/queries');
const SKINS = require('../data/skins');

// All skins — no prices, all free, unlocked by playing
router.get('/', (_req, res) => res.json(SKINS));

router.get('/mine', verifyToken, async (req, res) => {
  const user = await db.getUser(req.user.uid);
  if (!user) return res.status(404).json({ error: 'Not found' });
  const owned = await db.getUserSkins(user.id);
  res.json(owned);
});

// Unlock skin (server validates the user has enough play-time / coins)
router.post('/unlock/:skinId', verifyToken, async (req, res) => {
  try {
    const user = await db.getUser(req.user.uid);
    if (!user) return res.status(404).json({ error: 'Not found' });
    const skin = SKINS.find(s => s.id === req.params.skinId);
    if (!skin) return res.status(404).json({ error: 'Skin not found' });
    if (skin.coinCost > 0 && user.coins < skin.coinCost)
      return res.status(400).json({ error: 'Not enough coins' });
    if (skin.coinCost > 0) await db.addCoins(user.id, -skin.coinCost);
    await db.unlockSkin(user.id, skin.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Unlock failed' });
  }
});

module.exports = router;
