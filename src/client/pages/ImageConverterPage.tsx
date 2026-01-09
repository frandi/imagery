import { ImageConverter } from '../components/converter/ImageConverter';
import { converterService } from '../services/converterService';

export const ImageConverterPage = () => {
  const formats = converterService.getFormatInfo();

  return (
    <div className="container-custom">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Image Format Converter
          </h1>
          <p className="text-lg text-gray-600">
            Convert images between different formats with optimized presets
          </p>
        </div>

        {/* Main Converter */}
        <ImageConverter />

        {/* Supported Formats */}
        <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Supported Formats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {formats.map((format) => (
              <div key={format.id} className="flex items-start gap-2">
                <span className="inline-block w-16 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium uppercase">
                  {format.id}
                </span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{format.name}</div>
                  <div className="text-sm text-gray-600">{format.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            How to Use
          </h2>
          <ol className="space-y-2 text-gray-700">
            <li className="flex gap-2">
              <span className="font-semibold">1.</span>
              <span>Upload your image (max 10MB) by dragging & dropping or clicking to browse</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">2.</span>
              <span>Select your desired output format from the dropdown</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">3.</span>
              <span>Choose a conversion preset based on your needs:</span>
            </li>
            <ul className="ml-6 mt-2 space-y-1 text-sm">
              <li>• <strong>Web Optimized:</strong> Smaller files, good for web use</li>
              <li>• <strong>Balanced:</strong> Recommended balance of quality and size</li>
              <li>• <strong>High Quality:</strong> Maximum quality for professional use</li>
            </ul>
            <li className="flex gap-2">
              <span className="font-semibold">4.</span>
              <span>Click "Convert Image" and download your converted file</span>
            </li>
          </ol>
        </div>

        {/* Notes */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> SVG output uses bitmap tracing, which works best for logos and graphics.
            For photos, consider using PNG or WebP formats instead.
          </p>
        </div>
      </div>
    </div>
  );
};
