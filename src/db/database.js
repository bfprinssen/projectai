import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../../data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = {
  events: path.join(dataDir, 'events.json'),
  logs: path.join(dataDir, 'logs.json'),
  contentBlocks: path.join(dataDir, 'contentBlocks.json')
};

// Initialize files if they don't exist
Object.values(dbPath).forEach(file => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([], null, 2));
  }
});

const readData = (type) => {
  try {
    const data = fs.readFileSync(dbPath[type], 'utf8');
    return JSON.parse(data || '[]');
  } catch {
    return [];
  }
};

const writeData = (type, data) => {
  fs.writeFileSync(dbPath[type], JSON.stringify(data, null, 2));
};

export const db = {
  // Events
  getEvents: () => readData('events'),
  getEventById: (id) => readData('events').find(e => e.id === id),
  createEvent: (eventData) => {
    const events = readData('events');
    const event = {
      id: uuidv4(),
      ...eventData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      archived: false
    };
    events.push(event);
    writeData('events', events);
    return event;
  },
  updateEvent: (id, eventData) => {
    const events = readData('events');
    const index = events.findIndex(e => e.id === id);
    if (index !== -1) {
      events[index] = {
        ...events[index],
        ...eventData,
        updated_at: new Date().toISOString()
      };
      writeData('events', events);
      return events[index];
    }
    return null;
  },
  deleteEvent: (id) => {
    const events = readData('events');
    const filtered = events.filter(e => e.id !== id);
    writeData('events', filtered);
  },
  archiveEvent: (id) => {
    return db.updateEvent(id, { archived: true });
  },
  unarchiveEvent: (id) => {
    return db.updateEvent(id, { archived: false });
  },

  // Audit Logs
  addLog: (action, userId, details) => {
    const logs = readData('logs');
    logs.push({
      id: uuidv4(),
      action,
      userId,
      details,
      timestamp: new Date().toISOString()
    });
    writeData('logs', logs);
  },
  getLogs: (limit = 100) => {
    const logs = readData('logs');
    return logs.slice(-limit).reverse();
  },

  // Content Blocks
  getContentBlocks: () => readData('contentBlocks'),
  getContentBlocksByPage: (page) => {
    return readData('contentBlocks').filter(b => b.page === page);
  },
  createContentBlock: (blockData) => {
    const blocks = readData('contentBlocks');
    const block = {
      id: uuidv4(),
      ...blockData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    blocks.push(block);
    writeData('contentBlocks', blocks);
    return block;
  },
  updateContentBlock: (id, blockData) => {
    const blocks = readData('contentBlocks');
    const index = blocks.findIndex(b => b.id === id);
    if (index !== -1) {
      blocks[index] = {
        ...blocks[index],
        ...blockData,
        updated_at: new Date().toISOString()
      };
      writeData('contentBlocks', blocks);
      return blocks[index];
    }
    return null;
  },
  deleteContentBlock: (id) => {
    const blocks = readData('contentBlocks');
    const filtered = blocks.filter(b => b.id !== id);
    writeData('contentBlocks', filtered);
  }
};

export default db;
