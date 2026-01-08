import { useState } from 'react';
import { faviconService } from '../services/faviconService';
import { FaviconSize, FaviconResult } from '../types/favicon.types';

export const useFaviconConverter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [sizes, setSizes] = useState<FaviconSize>('both');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FaviconResult | null>(null);
  const [error, setError] = useState<string>('');

  const convertFavicon = async (selectedFile: File, selectedSizes: FaviconSize) => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await faviconService.convert(selectedFile, selectedSizes);

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
    setSizes('both');
    setIsLoading(false);
    setResult(null);
    setError('');
  };

  return {
    file,
    setFile,
    sizes,
    setSizes,
    isLoading,
    result,
    error,
    convertFavicon,
    reset
  };
};
