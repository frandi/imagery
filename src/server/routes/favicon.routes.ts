import { Router } from 'express';
import { convertToFavicon, downloadFavicon } from '../controllers/faviconController';
import { uploadSingle } from '../middleware/uploadMiddleware';

const router = Router();

/**
 * POST /api/favicon/convert
 * Convert uploaded image to favicon
 * Body: multipart/form-data with 'image' field and 'sizes' field
 */
router.post('/convert', uploadSingle('image'), convertToFavicon);

/**
 * GET /api/favicon/download/:filename
 * Download generated favicon file
 */
router.get('/download/:filename', downloadFavicon);

export default router;
