import axios from 'axios';
import type { ConvertResponse, ImageFormat, ConversionPreset, FormatInfo, PresetInfo } from '../types/converter.types';

const API_BASE_URL = '/api';

// Supported formats information
// Note: BMP can be read as input but not written as output (Sharp limitation)
const SUPPORTED_FORMATS: FormatInfo[] = [
  { id: 'jpg', name: 'JPEG', description: 'Compressed image format, best for photos', mimeTypes: ['image/jpeg', 'image/jpg'] },
  { id: 'png', name: 'PNG', description: 'Lossless format with transparency support', mimeTypes: ['image/png'] },
  { id: 'webp', name: 'WebP', description: 'Modern format with excellent compression', mimeTypes: ['image/webp'] },
  { id: 'gif', name: 'GIF', description: 'Animated image format', mimeTypes: ['image/gif'] },
  { id: 'heif', name: 'HEIF', description: 'High efficiency image format', mimeTypes: ['image/heif', 'image/heic'] },
  { id: 'svg', name: 'SVG', description: 'Vector graphics format', mimeTypes: ['image/svg+xml'] }
];

// Input-only formats (can be read but not written)
const INPUT_ONLY_FORMATS: FormatInfo[] = [
  { id: 'bmp', name: 'BMP', description: 'Bitmap format (input only)', mimeTypes: ['image/bmp'] }
];

// Preset information
const PRESETS: PresetInfo[] = [
  {
    id: 'web-optimized',
    name: 'Web Optimized',
    description: 'Smaller file size, good quality for web use',
    icon: 'zap'
  },
  {
    id: 'balanced',
    name: 'Balanced',
    description: 'Balance between quality and file size (recommended)',
    icon: 'scale'
  },
  {
    id: 'high-quality',
    name: 'High Quality',
    description: 'Maximum quality, larger file size',
    icon: 'star'
  }
];

export const converterService = {
  /**
   * Convert image to target format
   * @param file Image file to convert
   * @param targetFormat Target image format
   * @param preset Conversion preset
   * @returns Conversion result with download URL
   */
  async convert(
    file: File,
    targetFormat: ImageFormat,
    preset: ConversionPreset = 'balanced'
  ): Promise<ConvertResponse> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('targetFormat', targetFormat);
      formData.append('preset', preset);

      const response = await axios.post<ConvertResponse>(
        `${API_BASE_URL}/converter/convert`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }

      return {
        success: false,
        error: {
          message: 'Failed to convert image. Please try again.',
          code: 'NETWORK_ERROR'
        }
      };
    }
  },

  /**
   * Get full download URL for a converted file
   * @param filename Converted filename
   * @returns Full download URL
   */
  getDownloadUrl(filename: string): string {
    return `${API_BASE_URL}/converter/download/${filename}`;
  },

  /**
   * Get supported formats
   * @returns Supported input and output formats
   */
  getSupportedFormats(): { input: string[], output: ImageFormat[] } {
    const allFormats = [...SUPPORTED_FORMATS, ...INPUT_ONLY_FORMATS];
    const inputFormats = allFormats.flatMap(f => f.mimeTypes);
    const outputFormats = SUPPORTED_FORMATS.map(f => f.id);
    return {
      input: inputFormats,
      output: outputFormats
    };
  },

  /**
   * Get format information
   * @returns Array of format details
   */
  getFormatInfo(): FormatInfo[] {
    return SUPPORTED_FORMATS;
  },

  /**
   * Get preset information
   * @returns Array of preset details
   */
  getPresetInfo(): PresetInfo[] {
    return PRESETS;
  },

  /**
   * Detect file format from file object
   * @param file File to detect format from
   * @returns Detected format or null
   */
  detectFileFormat(file: File): string | null {
    const allFormats = [...SUPPORTED_FORMATS, ...INPUT_ONLY_FORMATS];

    // Try to detect from MIME type first
    for (const format of allFormats) {
      if (format.mimeTypes.includes(file.type)) {
        return format.name;
      }
    }

    // Fallback to file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    const format = allFormats.find(f =>
      f.id === extension || f.id === 'jpg' && extension === 'jpeg'
    );

    return format ? format.name : null;
  },

  /**
   * Format file size in human-readable format
   * @param bytes File size in bytes
   * @returns Formatted string (e.g., "1.5 MB")
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }
};
