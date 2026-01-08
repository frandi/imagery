import { Download } from 'lucide-react';
import Button from '@/components/common/Button';
import { FaviconResult } from '@/types/favicon.types';

interface DownloadButtonProps {
  result: FaviconResult;
}

const DownloadButton = ({ result }: DownloadButtonProps) => {
  const handleDownload = () => {
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = result.downloadUrl;
    link.download = result.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            Favicon Ready!
          </h3>
          <div className="space-y-1 text-sm text-green-800">
            <p>
              <span className="font-medium">Filename:</span> {result.filename}
            </p>
            <p>
              <span className="font-medium">Sizes:</span> {result.sizes.join('x, ')}x pixels
            </p>
            <p>
              <span className="font-medium">File Size:</span> {formatFileSize(result.fileSize)}
            </p>
            <p className="text-xs text-green-700 mt-2">
              Link expires at: {new Date(result.expiresAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <Button
        onClick={handleDownload}
        variant="secondary"
        size="lg"
        fullWidth
        className="mt-4"
      >
        <Download className="w-5 h-5 mr-2 inline" />
        Download Favicon
      </Button>
    </div>
  );
};

export default DownloadButton;
