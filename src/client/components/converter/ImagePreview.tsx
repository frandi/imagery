import { useState, useEffect } from 'react';
import { converterService } from '../../services/converterService';

interface ImagePreviewProps {
  file: File | null;
  detectedFormat: string | null;
}

export const ImagePreview = ({ file, detectedFormat }: ImagePreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      setDimensions(null);
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Get image dimensions
    const img = new Image();
    img.onload = () => {
      setDimensions({ width: img.width, height: img.height });
    };
    img.src = url;

    // Cleanup
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!file || !previewUrl) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-shrink-0">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-full max-h-48 rounded border border-gray-300 object-contain"
          />
        </div>
        <div className="flex-grow space-y-2 text-sm">
          <div>
            <span className="font-medium text-gray-700">Format:</span>{' '}
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
              {detectedFormat || 'Unknown'}
            </span>
          </div>
          {dimensions && (
            <div>
              <span className="font-medium text-gray-700">Dimensions:</span>{' '}
              <span className="text-gray-600">
                {dimensions.width} × {dimensions.height} px
              </span>
            </div>
          )}
          <div>
            <span className="font-medium text-gray-700">File Size:</span>{' '}
            <span className="text-gray-600">
              {converterService.formatFileSize(file.size)}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Name:</span>{' '}
            <span className="text-gray-600 break-all">{file.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
