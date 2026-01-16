import React from 'react';
import { Invoice, FieldType } from '../../types';
import { useTemplateStore } from '../../store/templateStore';
import { formatCurrency, formatDate_Long } from '../../utils/formatters';
import { DraggableField } from './DraggableField';

interface EditableInvoiceRendererProps {
  invoice: Invoice;
  isEditMode: boolean;
  selectedField: FieldType | null;
  onFieldSelect: (fieldType: FieldType) => void;
}

export const EditableInvoiceRenderer: React.FC<EditableInvoiceRendererProps> = ({
  invoice,
  isEditMode,
  selectedField,
  onFieldSelect,
}) => {
  const { config } = useTemplateStore();
  const { globalStyles, fields, logo } = config;

  return (
    <div
      className="invoice-renderer bg-white p-8 shadow-lg relative"
      style={{
        fontFamily: globalStyles.fontFamily,
        backgroundColor: globalStyles.backgroundColor,
        maxWidth: '210mm',
        minHeight: '297mm',
        margin: '0 auto',
      }}
    >
      {/* Logo */}
      {fields.logo.visible && logo.dataUrl && (
        <DraggableField
          id="field-logo"
          fieldType="logo"
          isEditMode={isEditMode}
          isSelected={selectedField === 'logo'}
          onClick={() => onFieldSelect('logo')}
          style={{
            position: 'absolute',
            top: `${fields.logo.position.y}px`,
            left: `${fields.logo.position.x}px`,
          }}
        >
          <img
            src={logo.dataUrl}
            alt="Company Logo"
            style={{
              maxWidth: `${logo.maxWidth}px`,
              maxHeight: `${logo.maxHeight}px`,
            }}
          />
        </DraggableField>
      )}

      {/* Invoice Number */}
      {fields.invoiceNumber.visible && (
        <DraggableField
          id="field-invoiceNumber"
          fieldType="invoiceNumber"
          isEditMode={isEditMode}
          isSelected={selectedField === 'invoiceNumber'}
          onClick={() => onFieldSelect('invoiceNumber')}
          style={{
            position: 'absolute',
            top: `${fields.invoiceNumber.position.y}px`,
            left: `${fields.invoiceNumber.position.x}px`,
            width: `${fields.invoiceNumber.position.width}px`,
          }}
        >
          <div
            style={{
              fontSize: `${fields.invoiceNumber.style.fontSize}px`,
              color: fields.invoiceNumber.style.color,
              fontWeight: fields.invoiceNumber.style.fontWeight,
              textAlign: fields.invoiceNumber.style.textAlign,
            }}
          >
            <span className="font-bold">Invoice #:</span> {invoice.invoiceNumber}
          </div>
        </DraggableField>
      )}

      {/* Invoice Date */}
      {fields.invoiceDate.visible && (
        <DraggableField
          id="field-invoiceDate"
          fieldType="invoiceDate"
          isEditMode={isEditMode}
          isSelected={selectedField === 'invoiceDate'}
          onClick={() => onFieldSelect('invoiceDate')}
          style={{
            position: 'absolute',
            top: `${fields.invoiceDate.position.y}px`,
            left: `${fields.invoiceDate.position.x}px`,
            width: `${fields.invoiceDate.position.width}px`,
          }}
        >
          <div
            style={{
              fontSize: `${fields.invoiceDate.style.fontSize}px`,
              color: fields.invoiceDate.style.color,
              fontWeight: fields.invoiceDate.style.fontWeight,
              textAlign: fields.invoiceDate.style.textAlign,
            }}
          >
            <span className="font-bold">Date:</span> {formatDate_Long(invoice.date)}
          </div>
        </DraggableField>
      )}

      {/* Bill From */}
      {fields.billFrom.visible && (
        <DraggableField
          id="field-billFrom"
          fieldType="billFrom"
          isEditMode={isEditMode}
          isSelected={selectedField === 'billFrom'}
          onClick={() => onFieldSelect('billFrom')}
          style={{
            position: 'absolute',
            top: `${fields.billFrom.position.y}px`,
            left: `${fields.billFrom.position.x}px`,
            width: `${fields.billFrom.position.width}px`,
          }}
        >
          <div
            style={{
              fontSize: `${fields.billFrom.style.fontSize}px`,
              color: fields.billFrom.style.color,
              padding: `${fields.billFrom.style.padding}px`,
            }}
          >
            <h3 className="font-bold mb-2" style={{ color: globalStyles.primaryColor }}>
              From:
            </h3>
            <div className="font-semibold">{invoice.billFrom.name}</div>
            <div className="text-sm mt-1 whitespace-pre-line">{invoice.billFrom.address}</div>
          </div>
        </DraggableField>
      )}

      {/* Bill To */}
      {fields.billTo.visible && (
        <DraggableField
          id="field-billTo"
          fieldType="billTo"
          isEditMode={isEditMode}
          isSelected={selectedField === 'billTo'}
          onClick={() => onFieldSelect('billTo')}
          style={{
            position: 'absolute',
            top: `${fields.billTo.position.y}px`,
            left: `${fields.billTo.position.x}px`,
            width: `${fields.billTo.position.width}px`,
          }}
        >
          <div
            style={{
              fontSize: `${fields.billTo.style.fontSize}px`,
              color: fields.billTo.style.color,
              padding: `${fields.billTo.style.padding}px`,
            }}
          >
            <h3 className="font-bold mb-2" style={{ color: globalStyles.primaryColor }}>
              Bill To:
            </h3>
            <div className="font-semibold">{invoice.billTo.name}</div>
            <div className="text-sm mt-1 whitespace-pre-line">{invoice.billTo.address}</div>
          </div>
        </DraggableField>
      )}

      {/* Shipping Address */}
      {fields.shippingAddress.visible && invoice.shippingAddress && (
        <DraggableField
          id="field-shippingAddress"
          fieldType="shippingAddress"
          isEditMode={isEditMode}
          isSelected={selectedField === 'shippingAddress'}
          onClick={() => onFieldSelect('shippingAddress')}
          style={{
            position: 'absolute',
            top: `${fields.shippingAddress.position.y}px`,
            left: `${fields.shippingAddress.position.x}px`,
            width: `${fields.shippingAddress.position.width}px`,
          }}
        >
          <div
            style={{
              fontSize: `${fields.shippingAddress.style.fontSize}px`,
              color: fields.shippingAddress.style.color,
              padding: `${fields.shippingAddress.style.padding}px`,
            }}
          >
            <h3 className="font-bold mb-2" style={{ color: globalStyles.primaryColor }}>
              Shipping Address:
            </h3>
            <div className="text-sm whitespace-pre-line">{invoice.shippingAddress}</div>
          </div>
        </DraggableField>
      )}

      {/* Line Items Table */}
      {fields.lineItems.visible && (
        <DraggableField
          id="field-lineItems"
          fieldType="lineItems"
          isEditMode={isEditMode}
          isSelected={selectedField === 'lineItems'}
          onClick={() => onFieldSelect('lineItems')}
          style={{
            position: 'absolute',
            top: `${fields.lineItems.position.y}px`,
            left: `${fields.lineItems.position.x}px`,
            width: `${fields.lineItems.position.width}px`,
          }}
        >
          <div className="overflow-x-auto">
            <table
              className="w-full border-collapse"
              style={{
                fontSize: `${fields.lineItems.style.fontSize}px`,
                color: fields.lineItems.style.color,
              }}
            >
              <thead>
                <tr style={{ backgroundColor: globalStyles.primaryColor, color: 'white' }}>
                  <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Qty</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Unit Price</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">VAT %</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
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
                    <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {item.vatRate}%
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DraggableField>
      )}

      {/* Notes */}
      {fields.notes.visible && invoice.notes && (
        <DraggableField
          id="field-notes"
          fieldType="notes"
          isEditMode={isEditMode}
          isSelected={selectedField === 'notes'}
          onClick={() => onFieldSelect('notes')}
          style={{
            position: 'absolute',
            top: `${fields.notes.position.y}px`,
            left: `${fields.notes.position.x}px`,
            width: `${fields.notes.position.width}px`,
          }}
        >
          <div
            style={{
              fontSize: `${fields.notes.style.fontSize}px`,
              color: fields.notes.style.color,
              padding: `${fields.notes.style.padding}px`,
            }}
          >
            <h3 className="font-bold mb-2" style={{ color: globalStyles.primaryColor }}>
              Notes:
            </h3>
            <div className="text-sm whitespace-pre-line">{invoice.notes}</div>
          </div>
        </DraggableField>
      )}

      {/* Totals */}
      {fields.totals.visible && (
        <DraggableField
          id="field-totals"
          fieldType="totals"
          isEditMode={isEditMode}
          isSelected={selectedField === 'totals'}
          onClick={() => onFieldSelect('totals')}
          style={{
            position: 'absolute',
            top: `${fields.totals.position.y}px`,
            left: `${fields.totals.position.x}px`,
            width: `${fields.totals.position.width}px`,
          }}
        >
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
                <span className="font-semibold">{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total VAT:</span>
                <span className="font-semibold">{formatCurrency(invoice.totalVat)}</span>
              </div>
              <div
                className="flex justify-between pt-2 border-t-2"
                style={{ borderColor: globalStyles.primaryColor }}
              >
                <span className="font-bold">Grand Total:</span>
                <span
                  className="font-bold text-lg"
                  style={{ color: globalStyles.accentColor }}
                >
                  {formatCurrency(invoice.grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </DraggableField>
      )}
    </div>
  );
};
