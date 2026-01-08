import { Request, Response, NextFunction } from 'express';
import { upload } from '../config/multer.config';

/**
 * Middleware for handling single file uploads
 * Uses multer configuration with file type and size validation
 */
export const uploadSingle = (fieldName: string = 'image') => {
  return (req: Request, res: Response, next: NextFunction) => {
    upload.single(fieldName)(req, res, (err: any) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            error: {
              message: 'File too large. Maximum size is 10MB.',
              code: 'FILE_TOO_LARGE'
            }
          });
        }

        return res.status(400).json({
          success: false,
          error: {
            message: err.message || 'File upload failed',
            code: 'UPLOAD_ERROR'
          }
        });
      }

      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'No file uploaded. Please select an image file.',
            code: 'NO_FILE'
          }
        });
      }

      next();
    });
  };
};
