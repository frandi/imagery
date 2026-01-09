import { CheckCircle, Download } from 'lucide-react';
import { converterService } from '../../services/converterService';

interface ResultDisplayProps {
  result: {
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
  onReset: () => void;
}

export const ResultDisplay = ({ result, onReset }: ResultDisplayProps) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = result.downloadUrl;
    link.download = result.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sizeDiff = result.originalSize - result.convertedSize;
  const percentChange = result.compressionRatio;

  return (
    <div className="border border-green-300 rounded-lg p-6 bg-green-50">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="w-6 h-6 text-green-600" />
        <h3 className="text-lg font-semibold text-green-900">Conversion Successful!</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Conversion Details</h4>
          <div className="text-sm space-y-1">
            <div>
              <span className="font-medium">Format:</span>{' '}
              <span className="uppercase">{result.originalFormat}</span> → <span className="uppercase">{result.targetFormat}</span>
            </div>
            <div>
              <span className="font-medium">Dimensions:</span>{' '}
              {result.dimensions.width} × {result.dimensions.height} px
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">File Size</h4>
          <div className="text-sm space-y-1">
            <div>
              <span className="font-medium">Original:</span>{' '}
              {converterService.formatFileSize(result.originalSize)}
            </div>
            <div>
              <span className="font-medium">Converted:</span>{' '}
              {converterService.formatFileSize(result.convertedSize)}
            </div>
            <div>
              <span className="font-medium">Change:</span>{' '}
              <span className={sizeDiff > 0 ? 'text-green-600' : sizeDiff < 0 ? 'text-red-600' : 'text-gray-600'}>
                {sizeDiff > 0 ? '-' : '+'}{converterService.formatFileSize(Math.abs(sizeDiff))}{' '}
                ({percentChange > 0 ? '-' : '+'}{Math.abs(percentChange).toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Download className="w-5 h-5" />
          Download Converted Image
        </button>
        <button
          onClick={onReset}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Convert Another Image
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        File will be automatically deleted after 5 minutes or when downloaded.
      </p>
    </div>
  );
};
