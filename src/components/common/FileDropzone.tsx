import React from 'react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';

interface FileDropzoneProps {
  onFilesAccepted: (files: File[]) => void;
  accept?: DropzoneOptions['accept'];
  maxFiles?: number;
  maxSize?: number;
  multiple?: boolean;
  children?: React.ReactNode;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFilesAccepted,
  accept,
  maxFiles = 1,
  maxSize,
  multiple = false,
  children,
}) => {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: onFilesAccepted,
    accept,
    maxFiles,
    maxSize,
    multiple,
  });

  const getBorderColor = () => {
    if (isDragReject) return 'border-red-500 bg-red-50';
    if (isDragActive) return 'border-primary-500 bg-primary-50';
    return 'border-gray-300 hover:border-gray-400';
  };

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-all duration-200
        ${getBorderColor()}
      `}
    >
      <input {...getInputProps()} />
      {children || (
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
              ? 'Drop the file here'
              : isDragReject
              ? 'File type not accepted'
              : 'Drag & drop a file here, or click to select'}
          </p>
          {maxSize && (
            <p className="mt-1 text-xs text-gray-500">
              Maximum file size: {(maxSize / 1024 / 1024).toFixed(0)}MB
            </p>
          )}
        </div>
      )}
    </div>
  );
};
