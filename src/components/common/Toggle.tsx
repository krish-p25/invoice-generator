import React from 'react';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
        {label}
      </span>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div
          className={`
            block w-11 h-6 rounded-full transition-colors duration-200
            ${checked ? 'bg-primary-600' : 'bg-gray-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        ></div>
        <div
          className={`
            absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200
            ${checked ? 'transform translate-x-5' : ''}
          `}
        ></div>
      </div>
    </label>
  );
};
