import fs from 'fs/promises';
import path from 'path';
import { config } from '../config/env.config';

export class FileCleanupService {
  private timeouts: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Schedule a file for cleanup after a delay
   * @param filepath Absolute path to the file
   * @param delayMs Delay in milliseconds before cleanup (default from config)
   */
  scheduleCleanup(filepath: string, delayMs: number = config.cleanup.delayMs): void {
    // Cancel existing timeout if any
    this.cancelCleanup(filepath);

    const timeout = setTimeout(async () => {
      await this.deleteFile(filepath);
      this.timeouts.delete(filepath);
    }, delayMs);

    this.timeouts.set(filepath, timeout);
  }

  /**
   * Cancel scheduled cleanup for a file
   * @param filepath Absolute path to the file
   */
  cancelCleanup(filepath: string): void {
    const timeout = this.timeouts.get(filepath);
    if (timeout) {
      clearTimeout(timeout);
      this.timeouts.delete(filepath);
    }
  }

  /**
   * Immediately cleanup a file (and cancel any scheduled cleanup)
   * @param filepath Absolute path to the file
   */
  async immediateCleanup(filepath: string): Promise<void> {
    this.cancelCleanup(filepath);
    await this.deleteFile(filepath);
  }

  /**
   * Cleanup multiple files immediately
   * @param filepaths Array of absolute paths to files
   */
  async cleanupMultiple(filepaths: string[]): Promise<void> {
    await Promise.all(
      filepaths.map(filepath => this.immediateCleanup(filepath))
    );
  }

  /**
   * Periodic cleanup of old files in upload directory
   * Deletes files older than specified age
   * @param maxAgeMs Maximum age of files in milliseconds (default 1 hour)
   */
  async periodicCleanup(maxAgeMs: number = 3600000): Promise<void> {
    try {
      const files = await fs.readdir(config.upload.uploadDir);
      const now = Date.now();

      for (const file of files) {
        const filepath = path.join(config.upload.uploadDir, file);

        try {
          const stats = await fs.stat(filepath);

          // Delete if file is older than maxAge
          if (now - stats.mtimeMs > maxAgeMs) {
            await this.deleteFile(filepath);
          }
        } catch (error) {
          // Skip files that can't be accessed
          console.error(`Error checking file ${filepath}:`, error);
        }
      }
    } catch (error) {
      console.error('Periodic cleanup failed:', error);
    }
  }

  /**
   * Delete a file safely (no error if file doesn't exist)
   * @param filepath Absolute path to the file
   */
  private async deleteFile(filepath: string): Promise<void> {
    try {
      await fs.unlink(filepath);
      console.log(`Deleted file: ${filepath}`);
    } catch (error: any) {
      // Ignore ENOENT (file doesn't exist)
      if (error.code !== 'ENOENT') {
        console.error(`Failed to delete file ${filepath}:`, error);
      }
    }
  }

  /**
   * Start periodic cleanup job (runs every hour)
   */
  startPeriodicCleanup(): void {
    // Run immediately on start
    this.periodicCleanup();

    // Run every hour
    setInterval(() => {
      this.periodicCleanup();
    }, 3600000); // 1 hour
  }

  /**
   * Clear all scheduled timeouts (useful for graceful shutdown)
   */
  clearAllTimeouts(): void {
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts.clear();
  }
}

// Export singleton instance
export const fileCleanup = new FileCleanupService();
