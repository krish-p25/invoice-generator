import React from 'react';
import { Invoice } from '../../types';
import { useTemplateStore } from '../../store/templateStore';
import { formatCurrency, formatDate_Long } from '../../utils/formatters';

interface InvoiceRendererProps {
  invoice: Invoice;
  id?: string;
}

export const InvoiceRenderer: React.FC<InvoiceRendererProps> = ({ invoice, id }) => {
  const { config } = useTemplateStore();
  const { globalStyles, fields, logo } = config;

  return (
    <div
      id={id}
      className="invoice-renderer bg-white p-4 sm:p-6 md:p-8 shadow-lg overflow-hidden"
      style={{
        fontFamily: globalStyles.fontFamily,
        backgroundColor: globalStyles.backgroundColor,
        maxWidth: '210mm',
        minHeight: '297mm',
        margin: '0 auto',
        width: '100%',
        fontSize: 'clamp(10px, 2vw, 16px)',
      }}
    >
      {/* Header Section */}
      <div className="invoice-header mb-4 sm:mb-6 md:mb-8 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          {/* Logo */}
          {fields.logo.visible && logo.dataUrl && (
            <div className="logo-container flex-shrink-0">
              <img
                src={logo.dataUrl}
                alt="Company Logo"
                className="max-w-full h-auto"
                style={{
                  maxWidth: `min(${logo.maxWidth}px, 100%)`,
                  maxHeight: `${logo.maxHeight}px`,
                }}
              />
            </div>
          )}

          {/* Invoice Number and Date */}
          <div className="text-left sm:text-right w-full sm:w-auto">
            {fields.invoiceNumber.visible && (
              <div
                className="mb-1 sm:mb-2 break-words"
                style={{
                  fontSize: `clamp(12px, ${fields.invoiceNumber.style.fontSize * 0.8}px, ${fields.invoiceNumber.style.fontSize}px)`,
                  color: fields.invoiceNumber.style.color,
                  fontWeight: fields.invoiceNumber.style.fontWeight,
                }}
              >
                <span className="font-bold">Invoice #:</span> {invoice.invoiceNumber}
              </div>
            )}
            {fields.invoiceDate.visible && (
              <div
                className="break-words"
                style={{
                  fontSize: `clamp(11px, ${fields.invoiceDate.style.fontSize * 0.8}px, ${fields.invoiceDate.style.fontSize}px)`,
                  color: fields.invoiceDate.style.color,
                  fontWeight: fields.invoiceDate.style.fontWeight,
                }}
              >
                <span className="font-bold">Date:</span> {formatDate_Long(invoice.date)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bill From / Bill To Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6 md:mb-8">
        {/* Bill From */}
        {fields.billFrom.visible && (
          <div
            className="break-words overflow-hidden"
            style={{
              fontSize: `clamp(11px, ${fields.billFrom.style.fontSize * 0.8}px, ${fields.billFrom.style.fontSize}px)`,
              color: fields.billFrom.style.color,
              padding: `${Math.max(4, fields.billFrom.style.padding * 0.7)}px`,
            }}
          >
            <h3
              className="font-bold mb-1 sm:mb-2"
              style={{ color: globalStyles.primaryColor }}
            >
              From:
            </h3>
            <div className="font-semibold break-words">{invoice.billFrom.name}</div>
            <div className="text-xs sm:text-sm mt-1 whitespace-pre-line break-words">
              {invoice.billFrom.address}
            </div>
          </div>
        )}

        {/* Bill To */}
        {fields.billTo.visible && (
          <div
            className="break-words overflow-hidden"
            style={{
              fontSize: `clamp(11px, ${fields.billTo.style.fontSize * 0.8}px, ${fields.billTo.style.fontSize}px)`,
              color: fields.billTo.style.color,
              padding: `${Math.max(4, fields.billTo.style.padding * 0.7)}px`,
            }}
          >
            <h3
              className="font-bold mb-1 sm:mb-2"
              style={{ color: globalStyles.primaryColor }}
            >
              Bill To:
            </h3>
            <div className="font-semibold break-words">{invoice.billTo.name}</div>
            <div className="text-xs sm:text-sm mt-1 whitespace-pre-line break-words">
              {invoice.billTo.address}
            </div>
          </div>
        )}
      </div>

      {/* Shipping Address */}
      {fields.shippingAddress.visible && invoice.shippingAddress && (
        <div
          className="mb-4 sm:mb-6 md:mb-8 break-words overflow-hidden"
          style={{
            fontSize: `clamp(11px, ${fields.shippingAddress.style.fontSize * 0.8}px, ${fields.shippingAddress.style.fontSize}px)`,
            color: fields.shippingAddress.style.color,
            padding: `${Math.max(4, fields.shippingAddress.style.padding * 0.7)}px`,
          }}
        >
          <h3
            className="font-bold mb-1 sm:mb-2"
            style={{ color: globalStyles.primaryColor }}
          >
            Shipping Address:
          </h3>
          <div className="text-xs sm:text-sm whitespace-pre-line break-words">{invoice.shippingAddress}</div>
        </div>
      )}

      {/* Line Items Table */}
      {fields.lineItems.visible && (
        <div className="mb-8 overflow-x-auto">
          <table
            className="w-full border-collapse"
            style={{
              fontSize: `${fields.lineItems.style.fontSize}px`,
              color: fields.lineItems.style.color,
              tableLayout: 'fixed',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: globalStyles.primaryColor, color: 'white' }}>
                <th className="border border-gray-300 px-4 py-2 text-left" style={{ width: '50%' }}>Description</th>
                <th className="border border-gray-300 px-4 py-2 text-center" style={{ width: '10%' }}>Qty</th>
                <th className="border border-gray-300 px-4 py-2 text-right" style={{ width: '20%' }}>Unit Price</th>
                <th className="border border-gray-300 px-4 py-2 text-right" style={{ width: '20%' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((item, index) => (
                <tr
                  key={item.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb',
                  }}
                >
                  <td className="border border-gray-300 px-4 py-2" style={{ wordWrap: 'break-word', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                    {item.description}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    {formatCurrency(item.unitPrice, invoice.currency)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    {formatCurrency(item.total, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Totals and Notes Section */}
      <div className="grid grid-cols-2 gap-8">
        {/* Notes */}
        {fields.notes.visible && invoice.notes && (
          <div
            style={{
              fontSize: `${fields.notes.style.fontSize}px`,
              color: fields.notes.style.color,
              padding: `${fields.notes.style.padding}px`,
            }}
          >
            <h3
              className="font-bold mb-2"
              style={{ color: globalStyles.primaryColor }}
            >
              Notes:
            </h3>
            <div className="text-sm whitespace-pre-line">{invoice.notes}</div>
          </div>
        )}

        {/* Totals */}
        {fields.totals.visible && (
          <div
            style={{
              fontSize: `${fields.totals.style.fontSize}px`,
              color: fields.totals.style.color,
              padding: `${fields.totals.style.padding}px`,
            }}
          >
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold">{formatCurrency(invoice.subtotal, invoice.currency)}</span>
              </div>
              {invoice.showVAT && (
                <div className="flex justify-between">
                  <span>
                    VAT {invoice.vatType === 'percentage' ? `(${invoice.vatValue}%)` : ''}:
                  </span>
                  <span className="font-semibold">{formatCurrency(invoice.totalVat, invoice.currency)}</span>
                </div>
              )}
              {invoice.showDiscount && (
                <div className="flex justify-between">
                  <span>
                    Discount {invoice.discountType === 'percentage' ? `(${invoice.discountValue}%)` : ''}:
                  </span>
                  <span className="font-semibold">-{formatCurrency(invoice.totalDiscount, invoice.currency)}</span>
                </div>
              )}
              {invoice.showShipping && (
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="font-semibold">{formatCurrency(invoice.shippingFee, invoice.currency)}</span>
                </div>
              )}
              <div
                className="flex justify-between pt-2 border-t-2"
                style={{ borderColor: globalStyles.primaryColor }}
              >
                <span className="font-bold">Grand Total:</span>
                <span
                  className="font-bold text-lg"
                  style={{ color: globalStyles.accentColor }}
                >
                  {formatCurrency(invoice.grandTotal, invoice.currency)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
