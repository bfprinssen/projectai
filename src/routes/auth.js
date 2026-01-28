import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db/database.js';

const router = express.Router();

// Simulated user storage - in production, use a real database
const users = [
  {
    id: '1',
    username: process.env.ADMIN_USERNAME || 'admin',
    passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10)
  }
];

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    db.addLog('login_failed', 'unknown', { username });
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  req.session.userId = user.id;
  req.session.username = user.username;
  
  db.addLog('login_success', user.id, { username });
  res.json({ success: true, message: 'Logged in successfully' });
});

router.post('/logout', (req, res) => {
  const userId = req.session.userId;
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    
    if (userId) {
      db.addLog('logout', userId, {});
    }
    res.clearCookie('connect.sid');
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

router.get('/check', (req, res) => {
  if (req.session && req.session.userId) {
    res.json({ authenticated: true, username: req.session.username });
  } else {
    res.json({ authenticated: false });
  }
});

export default router;
