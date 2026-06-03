import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { isDevelopment } from '../config/env.config';

/**
 * Global error handler middleware
 * Catches all errors and sends appropriate response
 */
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', err);

  // Handle Multer-specific errors (file uploads)
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
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
        message: err.message || 'File upload error',
        code: err.code || 'UPLOAD_ERROR'
      }
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: err.code || 'INTERNAL_ERROR',
      ...(isDevelopment && { stack: err.stack })
    }
  });
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.originalUrl} not found`,
      code: 'NOT_FOUND'
    }
  });
};
