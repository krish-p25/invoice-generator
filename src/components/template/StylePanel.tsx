import React from 'react';
import { useTemplateStore } from '../../store/templateStore';
import { ColorPicker } from '../common/ColorPicker';
import { FontSelector } from '../common/FontSelector';
import { Button } from '../common/Button';

export const StylePanel: React.FC = () => {
  const { config, updateGlobalStyles, resetToDefault } = useTemplateStore();

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-gray-900">Global Styles</h3>

      {/* Colors */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Colors</h4>

        <ColorPicker
          label="Primary Color"
          value={config.globalStyles.primaryColor}
          onChange={(color) => updateGlobalStyles({ primaryColor: color })}
        />

        <ColorPicker
          label="Secondary Color"
          value={config.globalStyles.secondaryColor}
          onChange={(color) => updateGlobalStyles({ secondaryColor: color })}
        />

        <ColorPicker
          label="Accent Color"
          value={config.globalStyles.accentColor}
          onChange={(color) => updateGlobalStyles({ accentColor: color })}
        />

        <ColorPicker
          label="Background Color"
          value={config.globalStyles.backgroundColor}
          onChange={(color) => updateGlobalStyles({ backgroundColor: color })}
        />
      </div>

      {/* Typography */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Typography</h4>

        <FontSelector
          label="Font Family"
          value={config.globalStyles.fontFamily}
          onChange={(font) => updateGlobalStyles({ fontFamily: font })}
        />
      </div>

      {/* Reset Button */}
      <div className="pt-4 border-t border-gray-200">
        <Button variant="outline" size="sm" onClick={resetToDefault} fullWidth>
          <svg
            className="inline-block w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Reset to Default
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          This will reset all customizations to the default template.
        </p>
      </div>
    </div>
  );
};
