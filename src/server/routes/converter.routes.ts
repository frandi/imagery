import { Router } from 'express';
import { convertImage, downloadImage } from '../controllers/converterController';
import { uploadSingle } from '../middleware/uploadMiddleware';

const router = Router();

/**
 * POST /api/converter/convert
 * Convert uploaded image to target format
 * Body: multipart/form-data with 'image' field, 'targetFormat' field, and optional 'preset' field
 */
router.post('/convert', uploadSingle('image'), convertImage);

/**
 * GET /api/converter/download/:filename
 * Download converted image file
 */
router.get('/download/:filename', downloadImage);

export default router;
