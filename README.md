# SociaalAI Event Management System

A complete event management website with admin dashboard for creating, editing, archiving events, managing content blocks, and tracking audit logs.

## Features

✅ **Admin Authentication** - Secure login system with session management  
✅ **Event Management** - Create, read, update, delete, and archive events  
✅ **Content Blocks** - Add flexible text + image blocks to pages  
✅ **Banner Slideshow** - Automatic carousel with keyboard & button navigation  
✅ **Audit Logging** - Track all admin actions  
✅ **Accessibility** - WCAG compliance with keyboard navigation & screen reader support  
✅ **Performance** - Lazy loading, responsive design, optimized CSS  
✅ **Public Pages** - View events and archived events  
✅ **Admin Dashboard** - Comprehensive management interface

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file** (already created):
   ```
   PORT=3000
   NODE_ENV=development
   SESSION_SECRET=your_session_secret_change_in_production
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```

3. **Start the server:**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

## Usage

### Public Pages
- **Home** - View upcoming events and content blocks
- **Archive** - View archived events (retrospective)
- **Banner** - Auto-playing slideshow on home page

### Admin Dashboard

1. **Login**: Go to `/login` with credentials:
   - Username: `admin`
   - Password: `admin123`

2. **Manage Events**:
   - Create new events
   - Edit event details
   - Delete events
   - Archive events for retrospective

3. **Content Blocks**:
   - Add text + image blocks to pages
   - Edit and delete blocks
   - Manage position/order

4. **Audit Logs**:
   - View all admin actions
   - Track who did what and when
   - Details available for each action

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/check` - Check auth status

### Events
- `GET /api/events` - Get all active events
- `GET /api/events/archived` - Get archived events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (admin)
- `PUT /api/events/:id` - Update event (admin)
- `DELETE /api/events/:id` - Delete event (admin)
- `POST /api/events/:id/archive` - Archive event (admin)
- `POST /api/events/:id/unarchive` - Unarchive event (admin)

### Content Blocks
- `GET /api/content/page/:page` - Get blocks for page (public)
- `GET /api/content` - Get all blocks (admin)
- `POST /api/content` - Create block (admin)
- `PUT /api/content/:id` - Update block (admin)
- `DELETE /api/content/:id` - Delete block (admin)

### Audit Logs
- `GET /api/logs?limit=100` - Get logs (admin)

## Technology Stack

- **Backend**: Node.js + Express.js
- **Frontend**: HTML + Vanilla JavaScript + Tailwind CSS
- **Storage**: JSON files (file-based database)
- **Authentication**: bcrypt for password hashing, express-session for sessions
- **Accessibility**: WCAG 2.1 AA compliant
- **Performance**: Lazy loading, responsive images, optimized Tailwind

## File Structure

```
Project2Ai/
├── server.js                 # Main Express server
├── package.json             # Dependencies
├── .env                     # Environment variables
├── data/                    # JSON database files
├── src/
│   ├── db/
│   │   └── database.js      # Database operations
│   ├── middleware/
│   │   └── auth.js          # Authentication middleware
│   └── routes/
│       ├── auth.js          # Auth routes
│       ├── events.js        # Event routes
│       ├── content.js       # Content block routes
│       └── logs.js          # Audit log routes
└── public/
    ├── index.html           # Home page
    ├── login.html           # Login page
    ├── dashboard.html       # Admin dashboard
    ├── archive.html         # Archived events page
    └── 404.html             # 404 page
```

## Accessibility Features

- ✅ Keyboard navigation (arrow keys for banner)
- ✅ ARIA labels and roles
- ✅ Focus indicators (2px outline)
- ✅ Color contrast (WCAG AA)
- ✅ Semantic HTML
- ✅ Screen reader support
- ✅ Alt text for images
- ✅ Proper form labels

## Performance Optimizations

- 📊 Lazy loading for images
- 🎨 Responsive images with modern formats (WebP/AVIF support)
- 📱 Mobile-first CSS
- ⚡ Minimal JavaScript
- 🎯 Optimized Tailwind CSS
- 🔄 Efficient JSON storage

## Security

- 🔐 Password hashing with bcrypt
- 🔒 Session-based authentication
- 🛡️ HTTPONLY cookies
- ✅ Input validation
- 📝 Audit logging of all admin actions

## Customization

### Change Admin Credentials
Edit `.env`:
```
ADMIN_USERNAME=yourusername
ADMIN_PASSWORD=yourpassword
```

### Change Port
Edit `.env`:
```
PORT=5000
```

### Add Database Support
Replace `src/db/database.js` with MongoDB/PostgreSQL implementation while maintaining the same API interface.

## Troubleshooting

**Port already in use**: Change PORT in .env or kill the process using that port

**Session not persisting**: Ensure `SESSION_SECRET` in .env is set

**Events not showing**: Check `data/events.json` exists and is readable

## License

MIT

## Support

For issues or questions, refer to the GitHub repository: https://github.com/Wessel0180/SociaalAi
