export type ImageFormat = 'jpg' | 'png' | 'webp' | 'gif' | 'heif' | 'svg';
export type ConversionPreset = 'web-optimized' | 'high-quality' | 'balanced';

export interface ConvertOptions {
  targetFormat: ImageFormat;
  preset: ConversionPreset;
}

export interface ConvertResponse {
  success: boolean;
  data?: {
    filename: string;
    downloadUrl: string;
    originalFormat: string;
    targetFormat: string;
    originalSize: number;
    convertedSize: number;
    compressionRatio: number;
    dimensions: { width: number; height: number };
    expiresAt: string;
  };
  error?: {
    message: string;
    code: string;
  };
}

export interface PresetInfo {
  id: ConversionPreset;
  name: string;
  description: string;
  icon: string;
}

export interface FormatInfo {
  id: ImageFormat;
  name: string;
  description: string;
  mimeTypes: string[];
}
