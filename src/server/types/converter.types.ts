export type ImageFormat = 'jpg' | 'jpeg' | 'png' | 'webp' | 'gif' | 'heif' | 'heic' | 'svg';
export type ConversionPreset = 'web-optimized' | 'high-quality' | 'balanced';

export interface ConvertRequest {
  targetFormat: ImageFormat;
  preset: ConversionPreset;
}

export interface ConvertResult {
  filename: string;
  originalFormat: string;
  targetFormat: string;
  originalSize: number;
  convertedSize: number;
  compressionRatio: number;
  dimensions: { width: number; height: number };
}

export interface ProcessResult {
  filename: string;
  filePath: string;
  fileSize: number;
}
