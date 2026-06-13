const { Pool } = require('pg');

let pool;

async function connectDB() {
  pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await pool.query('SELECT 1');
  console.log('PostgreSQL connected');
}

const db = {
  query: (text, params) => pool.query(text, params),

  async getUser(firebaseUid) {
    const { rows } = await pool.query('SELECT * FROM users WHERE firebase_uid=$1', [firebaseUid]);
    return rows[0] || null;
  },

  async createUser(firebaseUid, username, avatarUrl) {
    const { rows } = await pool.query(
      'INSERT INTO users (firebase_uid, username, avatar_url) VALUES ($1,$2,$3) RETURNING *',
      [firebaseUid, username, avatarUrl]
    );
    return rows[0];
  },

  async getUserSkins(userId) {
    const { rows } = await pool.query('SELECT skin_id FROM user_skins WHERE user_id=$1', [userId]);
    return rows.map(r => r.skin_id);
  },

  async unlockSkin(userId, skinId) {
    await pool.query(
      'INSERT INTO user_skins (user_id, skin_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
      [userId, skinId]
    );
  },

  async addCoins(userId, amount) {
    await pool.query('UPDATE users SET coins=coins+$1 WHERE id=$2', [amount, userId]);
  },

  async recordScore(userId, gameType, score) {
    await pool.query(
      'INSERT INTO leaderboard (user_id, game_type, score) VALUES ($1,$2,$3)',
      [userId, gameType, score]
    );
  },

  async getLeaderboard(gameType, limit = 20) {
    const { rows } = await pool.query(
      `SELECT u.username, u.avatar_url, MAX(l.score) as best_score
       FROM leaderboard l JOIN users u ON u.id=l.user_id
       WHERE l.game_type=$1
       GROUP BY u.id, u.username, u.avatar_url
       ORDER BY best_score DESC LIMIT $2`,
      [gameType, limit]
    );
    return rows;
  },
};

module.exports = { connectDB, db };
