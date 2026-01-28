import express from 'express';
import { db } from '../db/database.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Get content blocks for a page (public)
router.get('/page/:page', (req, res) => {
  const blocks = db.getContentBlocksByPage(req.params.page);
  res.json(blocks);
});

// Get all content blocks (admin)
router.get('/', isAuthenticated, (req, res) => {
  const blocks = db.getContentBlocks();
  res.json(blocks);
});

// Create content block (admin)
router.post('/', isAuthenticated, (req, res) => {
  const { page, text, imageUrl, altText, position } = req.body;
  
  if (!page || !text) {
    return res.status(400).json({ error: 'Page and text are required' });
  }

  const block = db.createContentBlock({
    page,
    text,
    imageUrl,
    altText,
    position: position || 0
  });

  db.addLog('content_block_created', req.session.userId, {
    blockId: block.id,
    page
  });

  res.status(201).json(block);
});

// Update content block (admin)
router.put('/:id', isAuthenticated, (req, res) => {
  const block = db.updateContentBlock(req.params.id, req.body);
  
  if (!block) {
    return res.status(404).json({ error: 'Content block not found' });
  }

  db.addLog('content_block_updated', req.session.userId, {
    blockId: block.id,
    page: block.page
  });

  res.json(block);
});

// Delete content block (admin)
router.delete('/:id', isAuthenticated, (req, res) => {
  const block = db.getContentBlocks().find(b => b.id === req.params.id);
  if (!block) {
    return res.status(404).json({ error: 'Content block not found' });
  }

  db.deleteContentBlock(req.params.id);
  
  db.addLog('content_block_deleted', req.session.userId, {
    blockId: req.params.id,
    page: block.page
  });

  res.json({ success: true, message: 'Content block deleted' });
});

export default router;
