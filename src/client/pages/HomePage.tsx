import FaviconConverter from '@/components/favicon/FaviconConverter';

const HomePage = () => {
  return (
    <div className="container-custom">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Welcome to Imagery
          </h1>
          <p className="text-lg text-gray-600">
            Simple image editing tools for web developers
          </p>
        </div>

        <FaviconConverter />

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            How to use:
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Upload your image (PNG, JPG, or WEBP format)</li>
            <li>Select the desired favicon size</li>
            <li>Click "Convert to Favicon"</li>
            <li>Download your ready-to-use .ico file</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
