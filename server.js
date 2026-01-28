import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './src/db/database.js';
import fs from 'fs';
import { watch } from 'fs';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const staticTextsPath = path.join(__dirname, 'data', 'staticTexts.json');

// Load or create static texts file
function loadStaticTexts() {
  try {
    if (!fs.existsSync(staticTextsPath)) {
      fs.writeFileSync(staticTextsPath, JSON.stringify({}, null, 2));
    }
    const data = fs.readFileSync(staticTextsPath, 'utf8');
    return JSON.parse(data || '{}');
  } catch (error) {
    console.error('Error loading static texts:', error);
    return {};
  }
}

function saveStaticTexts(data) {
  try {
    fs.writeFileSync(staticTextsPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving static texts:', error);
  }
}

// Routes
import authRoutes from './src/routes/auth.js';
import eventsRoutes from './src/routes/events.js';
import contentRoutes from './src/routes/content.js';
import logsRoutes from './src/routes/logs.js';
import { isAuthenticated } from './src/middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/logs', logsRoutes);

// Static text storage - load from file
let staticTexts = loadStaticTexts();

// Watch for changes in staticTexts.json file (when edited in editor)
watch(staticTextsPath, (eventType, filename) => {
  if (eventType === 'change') {
    setTimeout(() => {
      try {
        staticTexts = loadStaticTexts();
        console.log('[FILE WATCH] staticTexts.json has been updated from file');
      } catch (error) {
        console.error('[FILE WATCH] Error reloading staticTexts:', error);
      }
    }, 100); // Small delay to ensure file is fully written
  }
});

// API for static text updates
app.put('/api/static/:id', isAuthenticated, (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  staticTexts[req.params.id] = text;
  saveStaticTexts(staticTexts);
  
  // Log the update
  if (req.session?.userId) {
    db.addLog('static_text_updated', req.session.userId, {
      textId: req.params.id,
      text: text.substring(0, 100)
    });
  }

  res.json({ success: true, id: req.params.id, text });
});

app.get('/api/static/:id', (req, res) => {
  console.log(`[API] GET /api/static/${req.params.id}:`, staticTexts[req.params.id]);
  res.json({ text: staticTexts[req.params.id] || null });
});

// Serve HTML pages
app.get('/', (req, res) => {
  try {
    // Read the HTML file
    let html = fs.readFileSync(path.join(__dirname, 'public/index.html'), 'utf8');
    
    // Replace all placeholders with actual values
    for (const [key, value] of Object.entries(staticTexts)) {
      // Escape HTML special characters for non-HTML content
      let escapeValue = value;
      if (key !== 'about-desc2') {
        escapeValue = String(value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      }
      const regex = new RegExp(`data-id="${key}">[^<]*</`, 'g');
      html = html.replace(regex, `data-id="${key}">${escapeValue}</`);
    }
    
    res.send(html);
  } catch (error) {
    console.error('Error rendering index.html:', error);
    res.status(500).send('Error rendering page');
  }
});

app.get('/login', (req, res) => {
  if (req.session && req.session.userId) {
    res.redirect('/dashboard');
  } else {
    res.sendFile(path.join(__dirname, 'public/login.html'));
  }
});

app.get('/dashboard', (req, res) => {
  if (req.session && req.session.userId) {
    res.sendFile(path.join(__dirname, 'public/dashboard.html'));
  } else {
    res.redirect('/login');
  }
});

app.get('/archive', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/archive.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public/404.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
