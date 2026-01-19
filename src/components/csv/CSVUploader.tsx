import React, { useState } from 'react';
import { FileDropzone } from '../common/FileDropzone';
import { Button } from '../common/Button';
import { parseCSVFile } from '../../utils/csvParser';
import { groupCSVRowsToInvoices } from '../../utils/invoiceGrouper';
import { useInvoiceStore } from '../../store/invoiceStore';
import { CSVParseResult } from '../../types';

export const CSVUploader: React.FC = () => {
  const [fileName, setFileName] = useState<string>('');
  const [parseResult, setParseResult] = useState<CSVParseResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { setRawCSVData, setGroupedInvoices, setProcessing, addError } = useInvoiceStore();

  const handleFilesAccepted = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);

    try {
      const result = await parseCSVFile(file);
      setParseResult(result);

      if (result.errors.length > 0) {
        result.errors.forEach((error) => {
          addError(`Row ${error.row}: ${error.message}`);
        });
      }

      if (result.data.length > 0) {
        setRawCSVData(result.data);
        setProcessing(true);

        // Group rows into invoices
        const invoices = groupCSVRowsToInvoices(result.data);
        setGroupedInvoices(invoices);

        setProcessing(false);
      }
    } catch (error) {
      addError(error instanceof Error ? error.message : 'Failed to parse CSV file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setFileName('');
    setParseResult(null);
    useInvoiceStore.getState().clearInvoices();
  };

  return (
    <div className="space-y-4">
      <FileDropzone
        onFilesAccepted={handleFilesAccepted}
        accept={{ 'text/csv': ['.csv'] }}
        maxFiles={1}
        maxSize={10 * 1024 * 1024} // 10MB
      >
        {fileName ? (
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mt-2 text-sm font-medium text-gray-900">{fileName}</p>
            <p className="text-xs text-gray-500">
              {parseResult && `${parseResult.data.length} rows parsed`}
            </p>
            {parseResult && parseResult.errors.length > 0 && (
              <p className="text-xs text-red-600 mt-1">
                {parseResult.errors.length} errors found
              </p>
            )}
          </div>
        ) : null}
      </FileDropzone>

      {fileName && (
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleClear} fullWidth>
            Clear
          </Button>
        </div>
      )}

      {isUploading && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 flex-shrink-0"></div>
          <span>Processing CSV...</span>
        </div>
      )}
    </div>
  );
};
