import { converterService } from '../../services/converterService';
import type { ConversionPreset } from '../../types/converter.types';

interface PresetSelectorProps {
  value: ConversionPreset;
  onChange: (preset: ConversionPreset) => void;
  disabled?: boolean;
}

export const PresetSelector = ({ value, onChange, disabled }: PresetSelectorProps) => {
  const presets = converterService.getPresetInfo();

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Conversion Preset
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onChange(preset.id)}
            disabled={disabled}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              value === preset.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            } ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <div className="font-semibold text-gray-900 mb-1">
              {preset.name}
            </div>
            <div className="text-sm text-gray-600">
              {preset.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
