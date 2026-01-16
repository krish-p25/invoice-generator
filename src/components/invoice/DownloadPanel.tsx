import React, { useState } from 'react';
import { Invoice } from '../../types';
import { Button } from '../common/Button';
import { generateInvoicePDF, generateBulkPDFs, downloadPDF } from '../../services/pdfService';
import { createInvoiceZip, downloadZip } from '../../services/zipService';

interface DownloadPanelProps {
  invoice: Invoice;
}

export const DownloadPanel: React.FC<DownloadPanelProps> = ({ invoice }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const elementId = `invoice-renderer-${invoice.id}`;
      const blob = await generateInvoicePDF(invoice, elementId);
      const fileName = `${invoice.invoiceNumber}_${invoice.billTo.name.replace(/[^a-z0-9]/gi, '_')}.pdf`;
      downloadPDF(blob, fileName);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    const elementId = `invoice-renderer-${invoice.id}`;
    const element = document.getElementById(elementId);
    if (!element) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            @media print {
              body { margin: 0; }
              @page { margin: 0; }
            }
          </style>
        </head>
        <body>
          ${element.innerHTML}
          <script>
            window.onload = function() {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="primary"
        size="sm"
        onClick={handleDownloadPDF}
        loading={isDownloading}
        disabled={isDownloading}
      >
        <svg
          className="inline-block w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        PDF
      </Button>

      <Button variant="outline" size="sm" onClick={handlePrint}>
        <svg
          className="inline-block w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
          />
        </svg>
        Print
      </Button>
    </div>
  );
};

interface BulkDownloadPanelProps {
  invoices: Invoice[];
}

export const BulkDownloadPanel: React.FC<BulkDownloadPanelProps> = ({ invoices }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleBulkDownload = async () => {
    if (invoices.length === 0) return;

    setIsDownloading(true);
    setProgress(0);

    try {
      // Generate all PDFs
      const pdfBlobs = await generateBulkPDFs(invoices, (current, total) => {
        setProgress((current / total) * 50); // First 50% for PDF generation
      });

      // Create ZIP
      const zipBlob = await createInvoiceZip(pdfBlobs, (zipProgress) => {
        setProgress(50 + zipProgress * 50); // Last 50% for ZIP creation
      });

      // Download ZIP
      const timestamp = new Date().toISOString().split('T')[0];
      downloadZip(zipBlob, `invoices_${timestamp}.zip`);

      setProgress(100);
    } catch (error) {
      console.error('Failed to create bulk download:', error);
      alert('Failed to create bulk download. Please try again.');
    } finally {
      setTimeout(() => {
        setIsDownloading(false);
        setProgress(0);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
      <Button
        variant="success"
        onClick={handleBulkDownload}
        loading={isDownloading}
        disabled={isDownloading || invoices.length === 0}
        fullWidth
        className="sm:w-auto"
      >
        <svg
          className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        <span className="hidden sm:inline">Download All as ZIP ({invoices.length} invoices)</span>
        <span className="sm:hidden">ZIP All ({invoices.length})</span>
      </Button>

      {isDownloading && (
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex-1 sm:w-48 bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  );
};
