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
      className="invoice-renderer bg-white p-8 shadow-lg"
      style={{
        fontFamily: globalStyles.fontFamily,
        backgroundColor: globalStyles.backgroundColor,
        maxWidth: '210mm',
        minHeight: '297mm',
        margin: '0 auto',
      }}
    >
      {/* Header Section */}
      <div className="invoice-header mb-8 relative">
        <div className="flex justify-between items-start">
          {/* Logo */}
          {fields.logo.visible && logo.dataUrl && (
            <div className="logo-container">
              <img
                src={logo.dataUrl}
                alt="Company Logo"
                style={{
                  maxWidth: `${logo.maxWidth}px`,
                  maxHeight: `${logo.maxHeight}px`,
                }}
              />
            </div>
          )}

          {/* Invoice Number and Date */}
          <div className="text-right">
            {fields.invoiceNumber.visible && (
              <div
                className="mb-2"
                style={{
                  fontSize: `${fields.invoiceNumber.style.fontSize}px`,
                  color: fields.invoiceNumber.style.color,
                  fontWeight: fields.invoiceNumber.style.fontWeight,
                }}
              >
                <span className="font-bold">Invoice #:</span> {invoice.invoiceNumber}
              </div>
            )}
            {fields.invoiceDate.visible && (
              <div
                style={{
                  fontSize: `${fields.invoiceDate.style.fontSize}px`,
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
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Bill From */}
        {fields.billFrom.visible && (
          <div
            style={{
              fontSize: `${fields.billFrom.style.fontSize}px`,
              color: fields.billFrom.style.color,
              padding: `${fields.billFrom.style.padding}px`,
            }}
          >
            <h3
              className="font-bold mb-2"
              style={{ color: globalStyles.primaryColor }}
            >
              From:
            </h3>
            <div className="font-semibold">{invoice.billFrom.name}</div>
            <div className="text-sm mt-1 whitespace-pre-line">
              {invoice.billFrom.address}
            </div>
          </div>
        )}

        {/* Bill To */}
        {fields.billTo.visible && (
          <div
            style={{
              fontSize: `${fields.billTo.style.fontSize}px`,
              color: fields.billTo.style.color,
              padding: `${fields.billTo.style.padding}px`,
            }}
          >
            <h3
              className="font-bold mb-2"
              style={{ color: globalStyles.primaryColor }}
            >
              Bill To:
            </h3>
            <div className="font-semibold">{invoice.billTo.name}</div>
            <div className="text-sm mt-1 whitespace-pre-line">
              {invoice.billTo.address}
            </div>
          </div>
        )}
      </div>

      {/* Shipping Address */}
      {fields.shippingAddress.visible && invoice.shippingAddress && (
        <div
          className="mb-8"
          style={{
            fontSize: `${fields.shippingAddress.style.fontSize}px`,
            color: fields.shippingAddress.style.color,
            padding: `${fields.shippingAddress.style.padding}px`,
          }}
        >
          <h3
            className="font-bold mb-2"
            style={{ color: globalStyles.primaryColor }}
          >
            Shipping Address:
          </h3>
          <div className="text-sm whitespace-pre-line">{invoice.shippingAddress}</div>
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
