import { FormEvent } from 'react';
import { useFaviconConverter } from '@/hooks/useFaviconConverter';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import FileUpload from '@/components/common/FileUpload';
import SizeSelector from './SizeSelector';
import ImagePreview from './ImagePreview';
import DownloadButton from './DownloadButton';
import { Loader2 } from 'lucide-react';

const FaviconConverter = () => {
  const {
    file,
    setFile,
    sizes,
    setSizes,
    isLoading,
    result,
    error,
    convertFavicon,
    reset
  } = useFaviconConverter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!file) {
      return;
    }

    await convertFavicon(file, sizes);
  };

  const handleReset = () => {
    reset();
  };

  return (
    <Card
      title="Favicon Converter"
      description="Convert your images to ready-to-use favicon (.ico) format"
    >
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <FileUpload
            onFileSelect={setFile}
            currentFile={file}
          />

          {file && <ImagePreview file={file} />}

          <SizeSelector
            value={sizes}
            onChange={setSizes}
            disabled={isLoading}
          />

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            fullWidth
            disabled={!file || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 inline animate-spin" />
                Converting...
              </>
            ) : (
              'Convert to Favicon'
            )}
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          <DownloadButton result={result} />

          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
            fullWidth
          >
            Convert Another Image
          </Button>
        </div>
      )}
    </Card>
  );
};

export default FaviconConverter;
