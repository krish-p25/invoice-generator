import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTemplateStore } from '../../store/templateStore';
import { Button } from '../common/Button';

const MAX_LOGO_SIZE = 5 * 1024 * 1024; // 5MB

export const LogoUploader: React.FC = () => {
  const { config, updateLogo } = useTemplateStore();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > MAX_LOGO_SIZE) {
        alert('Logo file must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        updateLogo({
          url: URL.createObjectURL(file),
          dataUrl,
        });
      };
      reader.readAsDataURL(file);
    },
    [updateLogo]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/svg+xml': ['.svg'],
    },
    maxFiles: 1,
  });

  const handleRemove = () => {
    updateLogo({ url: null, dataUrl: null });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Company Logo</h3>

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'}
        `}
      >
        <input {...getInputProps()} />
        {config.logo.dataUrl ? (
          <div className="space-y-2">
            <img
              src={config.logo.dataUrl}
              alt="Company Logo"
              className="max-h-24 mx-auto"
            />
            <p className="text-sm text-gray-600">Click or drag to replace</p>
          </div>
        ) : (
          <div>
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              {isDragActive
                ? 'Drop your logo here'
                : 'Drag & drop logo, or click to select'}
            </p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, or SVG (max 5MB)</p>
          </div>
        )}
      </div>

      {config.logo.dataUrl && (
        <Button variant="danger" size="sm" onClick={handleRemove} fullWidth>
          Remove Logo
        </Button>
      )}
    </div>
  );
};
