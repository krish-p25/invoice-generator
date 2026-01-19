import React from 'react';
import { Invoice } from '../../types';
import { useTemplateStore } from '../../store/templateStore';
import { formatCurrency, formatDate_Long } from '../../utils/formatters';

interface InvoiceRendererProps {
  invoice: Invoice;
  id?: string;
  disableScaling?: boolean;
}

export const InvoiceRenderer: React.FC<InvoiceRendererProps> = ({ invoice, id, disableScaling = false }) => {
  const { config } = useTemplateStore();
  const { globalStyles, fields, logo } = config;
  const [scale, setScale] = React.useState<number>(1);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Calculate scale factor based on container width
  React.useEffect(() => {
    if (disableScaling) {
      setScale(1);
      return;
    }

    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // Base canvas width is 794px (210mm at 96dpi)
        const baseWidth = 794;
        // Calculate scale, but don't scale up beyond 1
        const newScale = Math.min(containerWidth / baseWidth, 1);
        setScale(newScale);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [disableScaling]);

  return (
    <div
      ref={containerRef}
      className="invoice-renderer-container"
      style={{
        width: '100%',
        maxWidth: '100%',
        margin: '0 auto',
        overflow: 'visible',
      }}
    >
      <div
        id={id}
        className="invoice-renderer bg-white shadow-lg"
        style={{
          fontFamily: globalStyles.fontFamily,
          backgroundColor: globalStyles.backgroundColor,
          width: '794px',
          minHeight: '1123px',
          padding: '32px',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          fontSize: '16px',
        }}
      >
      {/* Header Section */}
      <div className="invoice-header mb-8 relative">
        <div className="flex justify-between items-start gap-4">
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
          <div className="text-right">
            {fields.invoiceNumber.visible && (
              <div
                className="mb-2 break-words"
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
                className="break-words"
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
            className="break-words overflow-hidden"
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
            <div className="font-semibold break-words">{invoice.billFrom.name}</div>
            <div className="text-sm mt-1 whitespace-pre-line break-words">
              {invoice.billFrom.address}
            </div>
          </div>
        )}

        {/* Bill To */}
        {fields.billTo.visible && (
          <div
            className="break-words overflow-hidden"
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
            <div className="font-semibold break-words">{invoice.billTo.name}</div>
            <div className="text-sm mt-1 whitespace-pre-line break-words">
              {invoice.billTo.address}
            </div>
          </div>
        )}
      </div>

      {/* Shipping Address */}
      {fields.shippingAddress.visible && invoice.shippingAddress && (
        <div
          className="mb-8 break-words overflow-hidden"
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
          <div className="text-sm whitespace-pre-line break-words">{invoice.shippingAddress}</div>
        </div>
      )}

      {/* Line Items Table */}
      {fields.lineItems.visible && (
        <div className="mb-8">
          <table
            className="w-full border-collapse"
            style={{
              fontSize: `${fields.lineItems.style.fontSize}px`,
              color: fields.lineItems.style.color,
              tableLayout: 'auto',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: globalStyles.primaryColor, color: 'white' }}>
                <th className="border border-gray-300" style={{ padding: 0, textAlign: 'left', height: '40px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', height: '100%', paddingLeft: '16px', paddingRight: '16px' }}>Description</div>
                </th>
                <th className="border border-gray-300" style={{ padding: 0, textAlign: 'center', whiteSpace: 'nowrap', height: '40px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', paddingLeft: '16px', paddingRight: '16px' }}>Qty</div>
                </th>
                <th className="border border-gray-300" style={{ padding: 0, textAlign: 'right', whiteSpace: 'nowrap', height: '40px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%', paddingLeft: '16px', paddingRight: '16px' }}>Unit Price</div>
                </th>
                <th className="border border-gray-300" style={{ padding: 0, textAlign: 'right', whiteSpace: 'nowrap', height: '40px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%', paddingLeft: '16px', paddingRight: '16px' }}>Total</div>
                </th>
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
                  <td className="border border-gray-300" style={{ padding: 0, height: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%', paddingLeft: '16px', paddingRight: '16px', wordWrap: 'break-word', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                      {item.description}
                    </div>
                  </td>
                  <td className="border border-gray-300" style={{ padding: 0, textAlign: 'center', whiteSpace: 'nowrap', height: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', paddingLeft: '16px', paddingRight: '16px' }}>
                      {item.quantity}
                    </div>
                  </td>
                  <td className="border border-gray-300" style={{ padding: 0, textAlign: 'right', whiteSpace: 'nowrap', height: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%', paddingLeft: '16px', paddingRight: '16px' }}>
                      {formatCurrency(item.unitPrice, invoice.currency)}
                    </div>
                  </td>
                  <td className="border border-gray-300" style={{ padding: 0, textAlign: 'right', whiteSpace: 'nowrap', height: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%', paddingLeft: '16px', paddingRight: '16px' }}>
                      {formatCurrency(item.total, invoice.currency)}
                    </div>
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
            className="break-words overflow-hidden"
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
            <div className="text-sm whitespace-pre-line break-words">{invoice.notes}</div>
          </div>
        )}

        {/* Totals */}
        {fields.totals.visible && (
          <div
            className="break-words overflow-hidden"
            style={{
              fontSize: `${fields.totals.style.fontSize}px`,
              color: fields.totals.style.color,
              padding: `${fields.totals.style.padding}px`,
            }}
          >
            <div className="space-y-2">
              <div className="flex justify-between gap-2">
                <span className="flex-shrink-0">Subtotal:</span>
                <span className="font-semibold text-right break-all">{formatCurrency(invoice.subtotal, invoice.currency)}</span>
              </div>
              {invoice.showVAT && (
                <div className="flex justify-between gap-2">
                  <span className="flex-shrink-0">
                    VAT {invoice.vatType === 'percentage' ? `(${invoice.vatValue}%)` : ''}:
                  </span>
                  <span className="font-semibold text-right break-all">{formatCurrency(invoice.totalVat, invoice.currency)}</span>
                </div>
              )}
              {invoice.showDiscount && (
                <div className="flex justify-between gap-2">
                  <span className="flex-shrink-0">
                    Discount {invoice.discountType === 'percentage' ? `(${invoice.discountValue}%)` : ''}:
                  </span>
                  <span className="font-semibold text-right break-all">-{formatCurrency(invoice.totalDiscount, invoice.currency)}</span>
                </div>
              )}
              {invoice.showShipping && (
                <div className="flex justify-between gap-2">
                  <span className="flex-shrink-0">Shipping:</span>
                  <span className="font-semibold text-right break-all">{formatCurrency(invoice.shippingFee, invoice.currency)}</span>
                </div>
              )}
              <div
                className="flex justify-between gap-2 pt-2 border-t-2"
                style={{ borderColor: globalStyles.primaryColor }}
              >
                <span className="font-bold flex-shrink-0">Grand Total:</span>
                <span
                  className="font-bold text-lg text-right break-all"
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
    </div>
  );
};
