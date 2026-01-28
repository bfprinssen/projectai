import express from 'express';
import { db } from '../db/database.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Get all events (public)
router.get('/', (req, res) => {
  const events = db.getEvents().filter(e => !e.archived);
  res.json(events);
});

// Get archived events (public)
router.get('/archived', (req, res) => {
  const events = db.getEvents().filter(e => e.archived);
  res.json(events);
});

// Get event by ID (public)
router.get('/:id', (req, res) => {
  const event = db.getEventById(req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  res.json(event);
});

// Create event (admin)
router.post('/', isAuthenticated, (req, res) => {
  const { title, description, date, location, imageUrl } = req.body;
  
  if (!title || !date) {
    return res.status(400).json({ error: 'Title and date are required' });
  }

  const event = db.createEvent({
    title,
    description,
    date,
    location,
    imageUrl
  });

  db.addLog('event_created', req.session.userId, {
    eventId: event.id,
    title: event.title
  });

  res.status(201).json(event);
});

// Update event (admin)
router.put('/:id', isAuthenticated, (req, res) => {
  const event = db.updateEvent(req.params.id, req.body);
  
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  db.addLog('event_updated', req.session.userId, {
    eventId: event.id,
    title: event.title
  });

  res.json(event);
});

// Delete event (admin)
router.delete('/:id', isAuthenticated, (req, res) => {
  const event = db.getEventById(req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  db.deleteEvent(req.params.id);
  
  db.addLog('event_deleted', req.session.userId, {
    eventId: req.params.id,
    title: event.title
  });

  res.json({ success: true, message: 'Event deleted' });
});

// Archive event (admin)
router.post('/:id/archive', isAuthenticated, (req, res) => {
  const event = db.archiveEvent(req.params.id);
  
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  db.addLog('event_archived', req.session.userId, {
    eventId: event.id,
    title: event.title
  });

  res.json(event);
});

// Unarchive event (admin)
router.post('/:id/unarchive', isAuthenticated, (req, res) => {
  const event = db.unarchiveEvent(req.params.id);
  
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  db.addLog('event_unarchived', req.session.userId, {
    eventId: event.id,
    title: event.title
  });

  res.json(event);
});

export default router;
