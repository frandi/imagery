import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { config, isProduction } from './config/env.config';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { fileCleanup } from './services/fileCleanup';

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS configuration
if (!isProduction) {
  app.use(cors({
    origin: `http://localhost:${config.vitePort}`,
    credentials: true
  }));
}

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', routes);

// Production: Serve static files from built frontend
if (isProduction) {
  const clientBuildPath = path.join(__dirname, '../client');

  // Serve static files
  app.use(express.static(clientBuildPath));

  // SPA fallback - serve index.html for all non-API routes
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// 404 handler (only for API routes in development)
if (!isProduction) {
  app.use(notFoundHandler);
}

// Global error handler (must be last)
app.use(errorHandler);

// Start periodic cleanup on app initialization
fileCleanup.startPeriodicCleanup();

export default app;
