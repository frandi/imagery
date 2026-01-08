import { Request, Response } from 'express';
import { ImageProcessor } from '../services/imageProcessor';
import { fileCleanup } from '../services/fileCleanup';
import { asyncHandler } from '../utils/asyncHandler';
import fs from 'fs';
import path from 'path';

const imageProcessor = new ImageProcessor();

/**
 * Convert uploaded image to favicon
 * POST /api/favicon/convert
 */
export const convertToFavicon = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'No file uploaded',
        code: 'NO_FILE'
      }
    });
  }

  const { sizes: sizesParam } = req.body;
  const uploadedFilePath = req.file.path;

  try {
    // Parse sizes parameter
    let sizes: number[];
    if (sizesParam === 'both') {
      sizes = [16, 32];
    } else if (sizesParam === '16') {
      sizes = [16];
    } else if (sizesParam === '32') {
      sizes = [32];
    } else {
      // Default to both
      sizes = [16, 32];
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

    // Process image
    const result = await imageProcessor.convertToFavicon(uploadedFilePath, sizes);

    // Schedule cleanup for both original and converted files
    fileCleanup.scheduleCleanup(uploadedFilePath);
    fileCleanup.scheduleCleanup(result.outputPath);

    // Calculate expiration time
    const expiresAt = new Date(Date.now() + 300000).toISOString(); // 5 minutes

    res.json({
      success: true,
      data: {
        filename: result.filename,
        downloadUrl: `/api/favicon/download/${result.filename}`,
        sizes: result.sizes,
        fileSize: result.fileSize,
        expiresAt
      }
    });
  } catch (error) {
    // Clean up uploaded file on error
    await fileCleanup.immediateCleanup(uploadedFilePath);

    throw new Error(
      `Favicon conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
});

/**
 * Download generated favicon
 * GET /api/favicon/download/:filename
 */
export const downloadFavicon = asyncHandler(async (req: Request, res: Response) => {
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

  // Ensure it's an .ico file
  if (!filename.endsWith('.ico')) {
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

  // Set headers for download
  res.setHeader('Content-Type', 'image/x-icon');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  // Stream file to response
  const fileStream = fs.createReadStream(filePath);

  fileStream.on('end', async () => {
    // Cleanup immediately after successful download
    await fileCleanup.immediateCleanup(filePath);

    // Also cleanup the original uploaded file (find and delete .png/.jpg/.jpeg files with same base name)
    const baseName = path.basename(filename, '.ico');
    const dir = path.dirname(filePath);
    const files = fs.readdirSync(dir);

    for (const file of files) {
      if (file.startsWith(baseName) && !file.endsWith('.ico')) {
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
