# IMAGERY

Imagery is a simple image editing app that the whole purpose is to help web developers producing images for their web apps.

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Development

Start both frontend and backend servers:

```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:5174/ (Vite dev server)
- **Backend**: http://localhost:4000/api (Express API)

### Production Build

```bash
# Build both frontend and backend
npm run build

# Start production server (single port)
npm start
```

Production server will run at: http://localhost:4000

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run both frontend and backend in development mode |
| `npm run dev:client` | Run only frontend (Vite) |
| `npm run dev:server` | Run only backend (Express) |
| `npm run build` | Build for production |
| `npm run build:client` | Build frontend only |
| `npm run build:server` | Build backend only |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Check TypeScript types |

## Features

### Favicon Converter

Convert your images to ready-to-use favicon (.ico) format.

**Features:**
- Upload images in PNG, JPG, JPEG, or WEBP format
- Choose favicon size: 16x16px, 32x32px, or both
- Drag-and-drop file upload
- Real-time image preview
- One-click download
- Automatic file cleanup (files expire after 5 minutes)
- Maximum file size: 10MB

**How to use:**
1. Visit the app at http://localhost:5174/ (development) or http://localhost:4000 (production)
2. Upload your image via drag-and-drop or file picker
3. Select the desired favicon size
4. Click "Convert to Favicon"
5. Download your ready-to-use .ico file

## Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **Lucide React** - Icons

### Backend
- **Express** - Web server
- **TypeScript** - Type safety
- **Multer** - File upload handling
- **Sharp** - High-performance image processing
- **to-ico** - ICO format conversion
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

### Dev Tools
- **tsx** - TypeScript execution for Node.js
- **Concurrently** - Run multiple commands
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Project Structure

```
imagery/
├── src/
│   ├── client/                    # React frontend
│   │   ├── components/
│   │   │   ├── common/           # Reusable components (Button, Card, FileUpload)
│   │   │   ├── layout/           # Layout components (Header, Footer, Layout)
│   │   │   └── favicon/          # Favicon-specific components
│   │   ├── pages/                # Page components
│   │   ├── services/             # API communication
│   │   ├── hooks/                # Custom React hooks
│   │   ├── types/                # TypeScript types
│   │   ├── styles/               # Global styles
│   │   ├── App.tsx               # Root component
│   │   └── main.tsx              # React entry point
│   │
│   └── server/                    # Express backend
│       ├── config/                # Configuration files
│       ├── controllers/           # Route handlers
│       ├── middleware/            # Express middleware
│       ├── services/              # Business logic
│       ├── routes/                # API routes
│       ├── utils/                 # Utility functions
│       ├── app.ts                 # Express app setup
│       └── server.ts              # Server entry point
│
├── public/                        # Static assets
├── uploads/                       # Temporary file storage (gitignored)
├── dist/                          # Production build output (gitignored)
├── index.html                     # HTML template
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite configuration
├── tailwind.config.js             # Tailwind configuration
└── .env                           # Environment variables (gitignored)
```

## Architecture

### Development Mode
- Frontend runs on Vite dev server (port 5174)
- Backend runs on Express server (port 4000)
- Vite proxies `/api/*` requests to Express

### Production Mode
- Single Express server (port 4000)
- Serves built frontend as static files
- API routes available at `/api/*`

## Environment Variables

```env
NODE_ENV=development
PORT=4000                          # Backend port
VITE_PORT=5174                     # Frontend port (dev only)

# File Upload Configuration
MAX_FILE_SIZE=10485760             # 10MB in bytes
ALLOWED_FILE_TYPES=image/png,image/jpeg,image/jpg,image/webp

# File Cleanup Configuration
CLEANUP_DELAY_MS=300000            # 5 minutes in milliseconds
```

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status

### Convert to Favicon
```
POST /api/favicon/convert
Content-Type: multipart/form-data

Body:
- image: File (required) - Image file to convert
- sizes: string (required) - '16', '32', or 'both'
```

### Download Favicon
```
GET /api/favicon/download/:filename
```
Downloads the generated favicon file

## Security Features

- File type validation (whitelist)
- File size limits (10MB max)
- Helmet security headers
- CORS configuration
- Filename sanitization
- Automatic file cleanup (prevents disk bloat)

## Future Enhancements

- User authentication
- Conversion history
- Additional image formats (SVG, GIF)
- Cloud storage integration (S3)
- Advanced image editing (crop, rotate, filters)
- Batch conversions
- Rate limiting
- Image optimization tools
- Open Graph image generator
- Social media image templates

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
<!-- BRL-7: SVG export now preserves original colors (AC Verify test PR). -->
