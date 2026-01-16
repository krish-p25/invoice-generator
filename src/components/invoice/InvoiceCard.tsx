import React from 'react';
import { Invoice } from '../../types';
import { InvoicePreview } from './InvoicePreview';
import { DownloadPanel } from './DownloadPanel';
import { InvoiceRenderer } from './InvoiceRenderer';

interface InvoiceCardProps {
  invoice: Invoice;
}

export const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice }) => {
  return (
    <>
      {/* Hidden renderer for PDF generation */}
      <div className="hidden">
        <InvoiceRenderer invoice={invoice} id={`invoice-renderer-${invoice.id}`} />
      </div>

      {/* Visible card */}
      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow bg-white">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {invoice.billTo.name}
            </h3>
            <p className="text-sm text-gray-600">{invoice.invoiceNumber}</p>
          </div>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
            Ready
          </span>
        </div>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex justify-between">
            <span>Items:</span>
            <span className="font-medium">{invoice.lineItems.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-medium">${invoice.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>VAT:</span>
            <span className="font-medium">${invoice.totalVat.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <span className="font-semibold">Total:</span>
            <span className="font-bold text-green-600">
              ${invoice.grandTotal.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <InvoicePreview invoice={invoice} />
          <div className="flex-1">
            <DownloadPanel invoice={invoice} />
          </div>
        </div>
      </div>
    </>
  );
};
