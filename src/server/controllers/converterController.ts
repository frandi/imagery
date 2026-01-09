import { Request, Response } from 'express';
import { ImageProcessor } from '../services/imageProcessor';
import { fileCleanup } from '../services/fileCleanup';
import { asyncHandler } from '../utils/asyncHandler';
import fs from 'fs';
import path from 'path';
import type { ImageFormat, ConversionPreset } from '../types/converter.types';

const imageProcessor = new ImageProcessor();

// MIME type mapping for different image formats
const MIME_TYPES: Record<string, string> = {
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'png': 'image/png',
  'webp': 'image/webp',
  'gif': 'image/gif',
  'bmp': 'image/bmp',
  'heif': 'image/heif',
  'heic': 'image/heic',
  'svg': 'image/svg+xml'
};

// Valid image extensions for downloads (output formats only)
const VALID_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'heif', 'heic', 'svg'];

/**
 * Convert uploaded image to target format
 * POST /api/converter/convert
 */
export const convertImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'No file uploaded',
        code: 'NO_FILE'
      }
    });
  }

  const { targetFormat, preset } = req.body;
  const uploadedFilePath = req.file.path;

  try {
    // Validate targetFormat
    if (!targetFormat) {
      await fileCleanup.immediateCleanup(uploadedFilePath);
      return res.status(400).json({
        success: false,
        error: {
          message: 'Target format is required',
          code: 'MISSING_TARGET_FORMAT'
        }
      });
    }

    const validFormats: ImageFormat[] = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'heif', 'heic', 'svg'];
    if (!validFormats.includes(targetFormat)) {
      await fileCleanup.immediateCleanup(uploadedFilePath);
      return res.status(400).json({
        success: false,
        error: {
          message: `Invalid target format. Supported formats: ${validFormats.join(', ')}`,
          code: 'INVALID_TARGET_FORMAT'
        }
      });
    }

    // Validate preset
    const validPresets: ConversionPreset[] = ['web-optimized', 'high-quality', 'balanced'];
    const conversionPreset = preset || 'balanced';
    if (!validPresets.includes(conversionPreset)) {
      await fileCleanup.immediateCleanup(uploadedFilePath);
      return res.status(400).json({
        success: false,
        error: {
          message: `Invalid preset. Supported presets: ${validPresets.join(', ')}`,
          code: 'INVALID_PRESET'
        }
      });
    }

    // Validate image
    const isValid = await imageProcessor.isValidImage(uploadedFilePath);
    if (!isValid) {
      await fileCleanup.immediateCleanup(uploadedFilePath);
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid image file',
          code: 'INVALID_IMAGE'
        }
      });
    }

    // Convert image
    const result = await imageProcessor.convertImage(
      uploadedFilePath,
      targetFormat as ImageFormat,
      conversionPreset as ConversionPreset
    );

    // Get the output path
    const outputPath = path.join(path.dirname(uploadedFilePath), result.filename);

    // Schedule cleanup for both original and converted files
    fileCleanup.scheduleCleanup(uploadedFilePath);
    fileCleanup.scheduleCleanup(outputPath);

    // Calculate expiration time
    const expiresAt = new Date(Date.now() + 300000).toISOString(); // 5 minutes

    res.json({
      success: true,
      data: {
        filename: result.filename,
        downloadUrl: `/api/converter/download/${result.filename}`,
        originalFormat: result.originalFormat,
        targetFormat: result.targetFormat,
        originalSize: result.originalSize,
        convertedSize: result.convertedSize,
        compressionRatio: result.compressionRatio,
        dimensions: result.dimensions,
        expiresAt
      }
    });
  } catch (error) {
    // Clean up uploaded file on error
    await fileCleanup.immediateCleanup(uploadedFilePath);

    throw new Error(
      `Image conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
});

/**
 * Download converted image
 * GET /api/converter/download/:filename
 */
export const downloadImage = asyncHandler(async (req: Request, res: Response) => {
  const { filename } = req.params;

  // Validate filename (basic security check)
  if (!filename || filename.includes('..') || filename.includes('/')) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid filename',
        code: 'INVALID_FILENAME'
      }
    });
  }

  // Validate file extension
  const extension = path.extname(filename).slice(1).toLowerCase();
  if (!VALID_EXTENSIONS.includes(extension)) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid file type',
        code: 'INVALID_FILE_TYPE'
      }
    });
  }

  const uploadsDir = path.join(process.cwd(), 'uploads');
  const filePath = path.join(uploadsDir, filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'File not found or has expired',
        code: 'FILE_NOT_FOUND'
      }
    });
  }

  // Get MIME type based on extension
  const mimeType = MIME_TYPES[extension] || 'application/octet-stream';

  // Set headers for download
  res.setHeader('Content-Type', mimeType);
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  // Stream file to response
  const fileStream = fs.createReadStream(filePath);

  fileStream.on('end', async () => {
    // Cleanup immediately after successful download
    await fileCleanup.immediateCleanup(filePath);

    // Also cleanup the original uploaded file (find and delete files with same base name)
    const baseName = path.basename(filename, path.extname(filename));
    const dir = path.dirname(filePath);
    const files = fs.readdirSync(dir);

    for (const file of files) {
      if (file.startsWith(baseName) && file !== filename) {
        const originalPath = path.join(dir, file);
        await fileCleanup.immediateCleanup(originalPath);
      }
    }
  });

  fileStream.on('error', (error) => {
    console.error('File stream error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: {
          message: 'Error downloading file',
          code: 'DOWNLOAD_ERROR'
        }
      });
    }
  });

  fileStream.pipe(res);
});
