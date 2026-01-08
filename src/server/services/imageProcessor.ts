import sharp from 'sharp';
import toIco from 'to-ico';
import fs from 'fs/promises';
import path from 'path';

export interface ProcessResult {
  outputPath: string;
  filename: string;
  fileSize: number;
  sizes: number[];
}

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
              fit: 'cover',
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
}
