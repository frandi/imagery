import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  vitePort: parseInt(process.env.VITE_PORT || '5174', 10),

  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
    allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || 'image/png,image/jpeg,image/jpg,image/webp,image/gif,image/bmp,image/svg+xml,image/heic,image/heif').split(','),
    uploadDir: path.join(process.cwd(), 'uploads')
  },

  cleanup: {
    delayMs: parseInt(process.env.CLEANUP_DELAY_MS || '300000', 10), // 5 minutes
    cron: process.env.CLEANUP_CRON || '0 0 * * *' // Daily at midnight
  }
};

export const isDevelopment = config.env === 'development';
export const isProduction = config.env === 'production';
