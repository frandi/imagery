import { AlertCircle, Loader2 } from 'lucide-react';
import { useImageConverter } from '../../hooks/useImageConverter';
import FileUpload from '../common/FileUpload';
import { ImagePreview } from './ImagePreview';
import { FormatSelector } from './FormatSelector';
import { PresetSelector } from './PresetSelector';
import { ResultDisplay } from './ResultDisplay';

export const ImageConverter = () => {
  const {
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
  } = useImageConverter();

  const handleConvert = () => {
    convertImage();
  };

  return (
    <div className="space-y-6">
      {/* File Upload */}
      {!result && (
        <>
          <FileUpload
            onFileSelect={setFile}
            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/bmp,image/svg+xml,image/heic,image/heif"
            maxSizeMB={10}
            disabled={isLoading}
          />

          {/* Preview */}
          {file && <ImagePreview file={file} detectedFormat={detectedFormat} />}

          {/* Format Selector */}
          {file && (
            <FormatSelector
              value={targetFormat}
              onChange={setTargetFormat}
              disabled={isLoading}
            />
          )}

          {/* Preset Selector */}
          {file && (
            <PresetSelector
              value={preset}
              onChange={setPreset}
              disabled={isLoading}
            />
          )}

          {/* Error Display */}
          {error && (
            <div className="border border-red-300 rounded-lg p-4 bg-red-50 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900">Conversion Failed</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Convert Button */}
          {file && (
            <button
              onClick={handleConvert}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Converting...
                </>
              ) : (
                <>Convert Image</>
              )}
            </button>
          )}
        </>
      )}

      {/* Result Display */}
      {result && <ResultDisplay result={result} onReset={reset} />}
    </div>
  );
};
