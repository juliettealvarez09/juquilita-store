const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('../database/db');

const tokens = new Map();

async function login(email, password) {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows.length === 0) return null;

  const user = result.rows[0];
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;

  const token = crypto.randomBytes(32).toString('hex');
  tokens.set(token, { id: user.id, name: user.name, email: user.email });

  return { token, user: { id: user.id, name: user.name, email: user.email } };
}

function verifyToken(token) {
  return tokens.get(token) || null;
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  const token = header.slice(7);
  const user = verifyToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Token inválido' });
  }
  req.user = user;
  next();
}

module.exports = { login, verifyToken, authMiddleware };
