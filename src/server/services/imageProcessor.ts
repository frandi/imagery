import sharp from 'sharp';
import toIco from 'to-ico';
import fs from 'fs/promises';
import path from 'path';
import potrace from 'potrace';
import { promisify } from 'util';
import type { ImageFormat, ConversionPreset, ConvertResult } from '../types/converter.types';

const potraceTrace = promisify(potrace.trace);

export interface ProcessResult {
  outputPath: string;
  filename: string;
  fileSize: number;
  sizes: number[];
}

// Preset configurations for image conversion
const PRESETS = {
  'web-optimized': {
    jpg: { quality: 75, mozjpeg: true },
    png: { compressionLevel: 8, adaptiveFiltering: true },
    webp: { quality: 75, effort: 4 },
    gif: { colors: 128, effort: 10 },
    heif: { quality: 75 }
  },
  'high-quality': {
    jpg: { quality: 95, mozjpeg: true },
    png: { compressionLevel: 3, adaptiveFiltering: true },
    webp: { quality: 90, effort: 6 },
    gif: { colors: 256, effort: 10 },
    heif: { quality: 95 }
  },
  'balanced': {
    jpg: { quality: 85, mozjpeg: true },
    png: { compressionLevel: 6, adaptiveFiltering: true },
    webp: { quality: 82, effort: 4 },
    gif: { colors: 192, effort: 10 },
    heif: { quality: 85 }
  }
} as const;

export class ImageProcessor {
  /**
   * Convert image to favicon (.ico) format
   * @param inputPath Path to the uploaded image
   * @param sizes Array of sizes to generate (e.g., [16, 32])
   * @returns Process result with output path and metadata
   */
  async convertToFavicon(
    inputPath: string,
    sizes: number[]
  ): Promise<ProcessResult> {
    try {
      // Validate input file
      const image = sharp(inputPath);
      const metadata = await image.metadata();

      if (!metadata.format) {
        throw new Error('Invalid image format');
      }

      // Generate PNG buffers for each size
      const buffers = await Promise.all(
        sizes.map(size =>
          sharp(inputPath)
            .resize(size, size, {
              fit: 'contain',
              position: 'center',
              background: { r: 255, g: 255, b: 255, alpha: 0 }
            })
            .png()
            .toBuffer()
        )
      );

      // Convert to ICO format
      const icoBuffer = await toIco(buffers);

      // Generate output path
      const outputFilename = path.basename(inputPath, path.extname(inputPath)) + '.ico';
      const outputPath = path.join(path.dirname(inputPath), outputFilename);

      // Save to disk
      await fs.writeFile(outputPath, icoBuffer);

      // Get file size
      const stats = await fs.stat(outputPath);

      return {
        outputPath,
        filename: outputFilename,
        fileSize: stats.size,
        sizes
      };
    } catch (error) {
      // Clean up on error
      throw new Error(
        `Image processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Validate if file is a valid image
   * @param filePath Path to the file
   * @returns true if valid image, false otherwise
   */
  async isValidImage(filePath: string): Promise<boolean> {
    try {
      const image = sharp(filePath);
      const metadata = await image.metadata();
      return !!metadata.format;
    } catch {
      return false;
    }
  }

  /**
   * Convert image between different formats
   * @param inputPath Path to the uploaded image
   * @param targetFormat Target image format
   * @param preset Conversion preset (web-optimized, high-quality, balanced)
   * @returns Conversion result with metadata
   */
  async convertImage(
    inputPath: string,
    targetFormat: ImageFormat,
    preset: ConversionPreset = 'balanced'
  ): Promise<ConvertResult> {
    try {
      // Load image and get metadata
      const image = sharp(inputPath);
      const metadata = await image.metadata();

      if (!metadata.format) {
        throw new Error('Invalid image format');
      }

      const originalFormat = metadata.format;
      const dimensions = {
        width: metadata.width || 0,
        height: metadata.height || 0
      };

      // Get original file size
      const originalStats = await fs.stat(inputPath);
      const originalSize = originalStats.size;

      // Get preset settings
      const presetSettings = PRESETS[preset];

      // Generate output filename
      const baseName = path.basename(inputPath, path.extname(inputPath));
      const outputFilename = `${baseName}.${targetFormat === 'jpeg' ? 'jpg' : targetFormat}`;
      const outputPath = path.join(path.dirname(inputPath), outputFilename);

      // Handle SVG output separately (requires potrace)
      if (targetFormat === 'svg') {
        // Convert to PNG first with optimal settings
        const pngBuffer = await sharp(inputPath)
          .png()
          .toBuffer();

        // Extract the image's dominant color so the trace is rendered in that
        // color instead of plain black. (Full per-color-layer tracing is a follow-up.)
        const { dominant } = await sharp(inputPath).stats();
        const dominantHex =
          '#' +
          [dominant.r, dominant.g, dominant.b]
            .map((c) => c.toString(16).padStart(2, '0'))
            .join('');

        // Trace to SVG using potrace
        const svgString = await potraceTrace(pngBuffer, {
          color: dominantHex,
          threshold: 128,
          optCurve: true,
          optTolerance: 0.2
        });

        // Save SVG file
        await fs.writeFile(outputPath, svgString);
      } else {
        // Process with Sharp for other formats
        let processor = sharp(inputPath);

        // Apply format-specific conversion
        switch (targetFormat) {
          case 'jpg':
          case 'jpeg':
            processor = processor.jpeg(presetSettings.jpg);
            break;
          case 'png':
            processor = processor.png(presetSettings.png);
            break;
          case 'webp':
            processor = processor.webp(presetSettings.webp);
            break;
          case 'gif':
            processor = processor.gif(presetSettings.gif);
            break;
          case 'heif':
          case 'heic':
            processor = processor.heif(presetSettings.heif);
            break;
          default:
            throw new Error(`Unsupported target format: ${targetFormat}`);
        }

        // Save converted image
        await processor.toFile(outputPath);
      }

      // Get converted file size
      const convertedStats = await fs.stat(outputPath);
      const convertedSize = convertedStats.size;

      // Calculate compression ratio (percentage saved)
      const compressionRatio = ((originalSize - convertedSize) / originalSize) * 100;

      return {
        filename: outputFilename,
        originalFormat,
        targetFormat,
        originalSize,
        convertedSize,
        compressionRatio: Math.round(compressionRatio * 100) / 100,
        dimensions
      };
    } catch (error) {
      throw new Error(
        `Image conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
