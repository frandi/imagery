import { Router } from 'express';
import faviconRoutes from './favicon.routes';

const router = Router();

// Mount favicon routes
router.use('/favicon', faviconRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
