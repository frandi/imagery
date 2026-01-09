import { converterService } from '../../services/converterService';
import type { ImageFormat } from '../../types/converter.types';

interface FormatSelectorProps {
  value: ImageFormat;
  onChange: (format: ImageFormat) => void;
  disabled?: boolean;
}

export const FormatSelector = ({ value, onChange, disabled }: FormatSelectorProps) => {
  const formats = converterService.getFormatInfo();

  return (
    <div className="space-y-2">
      <label htmlFor="format-select" className="block text-sm font-medium text-gray-700">
        Target Format
      </label>
      <select
        id="format-select"
        value={value}
        onChange={(e) => onChange(e.target.value as ImageFormat)}
        disabled={disabled}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        {formats.map((format) => (
          <option key={format.id} value={format.id}>
            {format.name} - {format.description}
          </option>
        ))}
      </select>
    </div>
  );
};
