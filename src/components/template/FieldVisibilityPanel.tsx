import React from 'react';
import { useTemplateStore } from '../../store/templateStore';
import { Toggle } from '../common/Toggle';
import { FieldType } from '../../types';

export const FieldVisibilityPanel: React.FC = () => {
  const { config, updateFieldVisibility } = useTemplateStore();

  const fieldGroups = [
    {
      name: 'Header',
      fields: config.layout.headerFields,
    },
    {
      name: 'Body',
      fields: config.layout.bodyFields,
    },
    {
      name: 'Footer',
      fields: config.layout.footerFields,
    },
  ];

  const getFieldLabel = (fieldType: FieldType): string => {
    return config.fields[fieldType]?.label || fieldType;
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-gray-900">Field Visibility</h3>

      {fieldGroups.map((group) => (
        <div key={group.name} className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
            {group.name}
          </h4>
          <div className="space-y-2">
            {group.fields.map((fieldType) => (
              <Toggle
                key={fieldType}
                label={getFieldLabel(fieldType)}
                checked={config.fields[fieldType]?.visible || false}
                onChange={(checked) => updateFieldVisibility(fieldType, checked)}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Toggle fields on/off to customize your invoice template. Hidden fields won't
          appear in the generated invoices.
        </p>
      </div>
    </div>
  );
};
