import React from 'react';
import { Invoice } from '../../types';
import { InvoicePreview } from './InvoicePreview';
import { DownloadPanel } from './DownloadPanel';
import { InvoiceRenderer } from './InvoiceRenderer';
import { useInvoiceStore } from '../../store/invoiceStore';
import { useTemplateStore } from '../../store/templateStore';
import { Toggle } from '../common/Toggle';

interface InvoiceCardProps {
  invoice: Invoice;
}

export const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice }) => {
  const toggleShippingAddress = useInvoiceStore((state) => state.toggleShippingAddress);
  const templateFieldVisible = useTemplateStore(
    (state) => state.config.fields.shippingAddress.visible
  );

  // The template-level field switch is the master kill-switch: with it off the
  // renderers hide the address regardless of this per-invoice flag, so leaving
  // the toggle live would let the user flip a control that does nothing. Prefer
  // disabling it and naming the place that actually governs it. The note is
  // rendered only in that state, so it doesn't repeat down a long invoice list.
  const toggleDisabled = !templateFieldVisible;
  const toggleNote = templateFieldVisible
    ? null
    : 'Hidden on every invoice. Turn it back on under Customize → Fields.';

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

        <div className="mb-4 pb-4 border-b border-gray-200">
          <Toggle
            label="Shipping address"
            checked={invoice.showShippingAddress}
            disabled={toggleDisabled}
            onChange={() => toggleShippingAddress(invoice.id)}
          />
          {toggleNote && <p className="mt-1.5 text-xs text-gray-500">{toggleNote}</p>}
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
