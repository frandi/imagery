import { useState, useEffect } from 'react';
import { Image } from 'lucide-react';

interface ImagePreviewProps {
  file: File | null;
}

const ImagePreview = ({ file }: ImagePreviewProps) => {
  const [preview, setPreview] = useState<string>('');

  useEffect(() => {
    if (!file) {
      setPreview('');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Cleanup
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!file || !preview) {
    return null;
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Image Preview
      </label>
      <div className="border-2 border-gray-200 rounded-lg p-4 flex items-center justify-center bg-gray-50">
        <div className="relative w-32 h-32">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
