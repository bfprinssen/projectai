import express from 'express';
import { db } from '../db/database.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Get audit logs (admin only)
router.get('/', isAuthenticated, (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  const logs = db.getLogs(limit);
  res.json(logs);
});

export default router;
