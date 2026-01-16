import React from 'react';
import { FONT_FAMILIES } from '../../constants/styleOptions';

interface FontSelectorProps {
  label: string;
  value: string;
  onChange: (font: string) => void;
}

export const FontSelector: React.FC<FontSelectorProps> = ({ label, value, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        {FONT_FAMILIES.map((font) => (
          <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
            {font.name}
          </option>
        ))}
      </select>
    </div>
  );
};
