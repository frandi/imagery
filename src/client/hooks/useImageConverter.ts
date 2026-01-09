import { useState, useEffect } from 'react';
import { converterService } from '../services/converterService';
import type { ImageFormat, ConversionPreset } from '../types/converter.types';

interface ConvertResult {
  filename: string;
  downloadUrl: string;
  originalFormat: string;
  targetFormat: string;
  originalSize: number;
  convertedSize: number;
  compressionRatio: number;
  dimensions: { width: number; height: number };
  expiresAt: string;
}

export const useImageConverter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<ImageFormat>('png');
  const [preset, setPreset] = useState<ConversionPreset>('balanced');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ConvertResult | null>(null);
  const [error, setError] = useState<string>('');
  const [detectedFormat, setDetectedFormat] = useState<string | null>(null);

  // Auto-detect format when file changes
  useEffect(() => {
    if (file) {
      const format = converterService.detectFileFormat(file);
      setDetectedFormat(format);
    } else {
      setDetectedFormat(null);
    }
  }, [file]);

  const convertImage = async () => {
    if (!file) {
      setError('No file selected');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await converterService.convert(file, targetFormat, preset);

      if (response.success && response.data) {
        setResult(response.data);
      } else if (response.error) {
        setError(response.error.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setTargetFormat('png');
    setPreset('balanced');
    setIsLoading(false);
    setResult(null);
    setError('');
    setDetectedFormat(null);
  };

  return {
    file,
    setFile,
    targetFormat,
    setTargetFormat,
    preset,
    setPreset,
    isLoading,
    result,
    error,
    detectedFormat,
    convertImage,
    reset
  };
};
