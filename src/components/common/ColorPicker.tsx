import React, { useState } from 'react';
import { COLOR_PRESETS } from '../../constants/styleOptions';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center gap-2">
        {/* Color preview button */}
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="w-12 h-12 rounded border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
          style={{ backgroundColor: value }}
        />

        {/* Hex input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="#000000"
        />
      </div>

      {/* Color presets */}
      {showPicker && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-xs font-medium text-gray-600 mb-2">Presets:</div>
          <div className="grid grid-cols-7 gap-2">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => {
                  onChange(preset.value);
                  setShowPicker(false);
                }}
                className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: preset.value }}
                title={preset.name}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
