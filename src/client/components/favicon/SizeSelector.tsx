import { FaviconSize } from '@/types/favicon.types';

interface SizeSelectorProps {
  value: FaviconSize;
  onChange: (size: FaviconSize) => void;
  disabled?: boolean;
}

const SizeSelector = ({ value, onChange, disabled = false }: SizeSelectorProps) => {
  const options: { value: FaviconSize; label: string; description: string }[] = [
    { value: '16', label: '16x16px', description: 'Small size (browser tabs)' },
    { value: '32', label: '32x32px', description: 'Standard size (bookmarks)' },
    { value: 'both', label: 'Both sizes', description: 'Includes 16x16 and 32x32' }
  ];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Select Favicon Size
      </label>

      <div className="space-y-2">
        {options.map(option => (
          <label
            key={option.value}
            className={`
              flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors
              ${value === option.value
                ? 'border-primary bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input
              type="radio"
              name="size"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              disabled={disabled}
              className="mt-1 mr-3 text-primary focus:ring-primary"
            />
            <div>
              <div className="font-medium text-gray-900">{option.label}</div>
              <div className="text-sm text-gray-600">{option.description}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;
