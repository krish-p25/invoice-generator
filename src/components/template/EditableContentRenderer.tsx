import React from 'react';
import { useDropzone } from 'react-dropzone';
import { FieldType } from '../../types';
import { useTemplateStore } from '../../store/templateStore';
import { usePreviewStore } from '../../store/previewStore';
import { formatCurrency, formatDate_Long } from '../../utils/formatters';
import { DraggableField } from './DraggableField';

const MAX_LOGO_SIZE = 5 * 1024 * 1024; // 5MB
const RemoveLogoButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) =>
  React.createElement('button', props);

interface EditableContentRendererProps {
  isEditMode: boolean;
  selectedField: FieldType | null;
  onFieldSelect: (fieldType: FieldType) => void;
  disableScaling?: boolean;
}

export const EditableContentRenderer: React.FC<EditableContentRendererProps> = ({
  isEditMode,
  selectedField,
  onFieldSelect,
  disableScaling = false,
}) => {
  const [hoveredRowId, setHoveredRowId] = React.useState<string | null>(null);
  const [isVATHovered, setIsVATHovered] = React.useState(false);
  const [isDiscountHovered, setIsDiscountHovered] = React.useState(false);
  const [isShippingHovered, setIsShippingHovered] = React.useState(false);
  const [isLogoHovered, setIsLogoHovered] = React.useState(false);
  const [tableHeight, setTableHeight] = React.useState<number>(0);
  const [scale, setScale] = React.useState<number>(1);
  const tableRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { config, updateFieldPosition, updateLogo } = useTemplateStore();
  const { globalStyles, fields, logo } = config;
  const {
    previewInvoice,
    updateBillFrom,
    updateBillTo,
    updateShippingAddress,
    updateInvoiceNumber,
    updateNotes,
    updateLineItem,
    addLineItem,
    removeLineItem,
    updateVATType,
    updateVATValue,
    toggleVAT,
    updateDiscountType,
    updateDiscountValue,
    toggleDiscount,
    updateShippingFee,
    toggleShipping,
  } = usePreviewStore();

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

  // Update table height when line items change
  React.useEffect(() => {
    if (tableRef.current) {
      setTableHeight(tableRef.current.offsetHeight);
    }
  }, [previewInvoice.lineItems]);

  // Also update on initial render and when isEditMode changes
  React.useEffect(() => {
    const updateHeight = () => {
      if (tableRef.current) {
        setTableHeight(tableRef.current.offsetHeight);
      }
    };

    updateHeight();
    // Add a slight delay to ensure DOM has updated
    const timeout = setTimeout(updateHeight, 100);

    return () => clearTimeout(timeout);
  }, [isEditMode]);

  // Calculate safe position - only push down if there would be overlap
  const calculateSafePosition = (
    fieldType: FieldType,
    configuredPosition: number,
    minSpacing: number = 32
  ) => {
    if (isEditMode) {
      // In edit mode, always use configured position
      return configuredPosition;
    }

    const tableBottom = fields.lineItems.position.y + tableHeight;
    const minSafePosition = tableBottom + minSpacing;

    // Only push down if configured position would cause overlap
    const safePosition = Math.max(configuredPosition, minSafePosition);

    // If position changed due to collision, update stored position
    if (safePosition !== configuredPosition && tableHeight > 0) {
      // Use a timeout to avoid updating during render
      setTimeout(() => {
        updateFieldPosition(fieldType, {
          x: fields[fieldType].position.x,
          y: safePosition,
        });
      }, 0);
    }

    return safePosition;
  };

  const handleTextEdit = (
    e: React.FocusEvent<HTMLElement>,
    updateFn: (value: string) => void
  ) => {
    const text = e.currentTarget.textContent || '';
    updateFn(text);
  };

  // Logo upload handler
  const onDropLogo = React.useCallback(
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

  const { getRootProps: getLogoRootProps, getInputProps: getLogoInputProps, isDragActive: isLogoDragActive } = useDropzone({
    onDrop: onDropLogo,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/svg+xml': ['.svg'],
    },
    maxFiles: 1,
    noClick: isEditMode, // Only allow click when not in edit mode
  });

  const handleRemoveLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateLogo({ url: null, dataUrl: null });
  };

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
        className="invoice-renderer bg-white shadow-lg relative"
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
      {/* Logo */}
      {fields.logo.visible && (
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
          <div
            {...(!isEditMode ? getLogoRootProps() : {})}
            className={`relative ${!isEditMode ? 'cursor-pointer' : ''}`}
            style={{
              minWidth: '150px',
              minHeight: '80px',
            }}
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
          >
            {!isEditMode && <input {...getLogoInputProps()} />}

            {logo.dataUrl ? (
              <>
                <img
                  src={logo.dataUrl}
                  alt="Company Logo"
                  className="max-w-full h-auto"
                  style={{
                    maxWidth: `min(${logo.maxWidth}px, 100%)`,
                    maxHeight: `${logo.maxHeight}px`,
                  }}
                />
                {!isEditMode && (
                  <>
                    {/* Hover overlay for click to change */}
                    {isLogoHovered && (
                      <div className="absolute inset-0 bg-black bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">Click to change</span>
                      </div>
                    )}
                    {/* Remove button on top-left */}
                    {isLogoHovered && (
                      <RemoveLogoButton
                        onClick={handleRemoveLogo}
                        className="absolute -top-2 -left-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-opacity duration-200 shadow-lg z-10"
                        title="Remove logo"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </RemoveLogoButton>
                    )}
                  </>
                )}
              </>
            ) : (
              <div
                className={`
                  border-2 border-dashed rounded-lg flex items-center justify-center h-20
                  transition-colors duration-200
                  ${isLogoDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'}
                  ${isEditMode ? 'bg-gray-100' : ''}
                `}
                style={{
                  minWidth: '150px',
                }}
              >
                {!isEditMode ? (
                  <div className="text-center px-4">
                    <svg
                      className="mx-auto h-8 w-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-xs text-gray-600 mt-1 font-medium">
                      {isLogoDragActive ? 'Drop logo here' : 'Add Logo'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">Click or drag</p>
                  </div>
                ) : (
                  <div className="text-center px-4">
                    <p className="text-xs text-gray-500">Logo Area</p>
                  </div>
                )}
              </div>
            )}
          </div>
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
            className="break-words"
            style={{
              fontSize: `clamp(12px, ${fields.invoiceNumber.style.fontSize * 0.8}px, ${fields.invoiceNumber.style.fontSize}px)`,
              color: fields.invoiceNumber.style.color,
              fontWeight: fields.invoiceNumber.style.fontWeight,
              textAlign: fields.invoiceNumber.style.textAlign,
            }}
          >
            <span className="font-bold">Invoice #:</span>{' '}
            <span
              className="break-words"
              contentEditable={!isEditMode}
              suppressContentEditableWarning
              data-gramm="false"
              data-gramm_editor="false"
              data-enable-grammarly="false"
              onBlur={(e) => handleTextEdit(e, updateInvoiceNumber)}
            >
              {previewInvoice.invoiceNumber}
            </span>
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
            className="break-words"
            style={{
              fontSize: `clamp(11px, ${fields.invoiceDate.style.fontSize * 0.8}px, ${fields.invoiceDate.style.fontSize}px)`,
              color: fields.invoiceDate.style.color,
              fontWeight: fields.invoiceDate.style.fontWeight,
              textAlign: fields.invoiceDate.style.textAlign,
            }}
          >
            <span className="font-bold">Date:</span> {formatDate_Long(previewInvoice.date)}
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
            className="break-words overflow-hidden"
            style={{
              fontSize: `clamp(11px, ${fields.billFrom.style.fontSize * 0.8}px, ${fields.billFrom.style.fontSize}px)`,
              color: fields.billFrom.style.color,
              padding: `${Math.max(4, fields.billFrom.style.padding * 0.7)}px`,
            }}
          >
            <h3 className="font-bold mb-1 sm:mb-2" style={{ color: globalStyles.primaryColor }}>
              From:
            </h3>
            <div
              className="font-semibold break-words"
              contentEditable={!isEditMode}
              suppressContentEditableWarning
              data-gramm="false"
              data-gramm_editor="false"
              data-enable-grammarly="false"
              onBlur={(e) =>
                updateBillFrom(e.currentTarget.textContent || '', previewInvoice.billFrom.address)
              }
            >
              {previewInvoice.billFrom.name}
            </div>
            <div
              className="text-xs sm:text-sm mt-1 whitespace-pre-line break-words"
              contentEditable={!isEditMode}
              suppressContentEditableWarning
              data-gramm="false"
              data-gramm_editor="false"
              data-enable-grammarly="false"
              onBlur={(e) =>
                updateBillFrom(previewInvoice.billFrom.name, e.currentTarget.textContent || '')
              }
            >
              {previewInvoice.billFrom.address}
            </div>
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
            className="break-words overflow-hidden"
            style={{
              fontSize: `clamp(11px, ${fields.billTo.style.fontSize * 0.8}px, ${fields.billTo.style.fontSize}px)`,
              color: fields.billTo.style.color,
              padding: `${Math.max(4, fields.billTo.style.padding * 0.7)}px`,
            }}
          >
            <h3 className="font-bold mb-1 sm:mb-2" style={{ color: globalStyles.primaryColor }}>
              Bill To:
            </h3>
            <div
              className="font-semibold break-words"
              contentEditable={!isEditMode}
              suppressContentEditableWarning
              data-gramm="false"
              data-gramm_editor="false"
              data-enable-grammarly="false"
              onBlur={(e) =>
                updateBillTo(e.currentTarget.textContent || '', previewInvoice.billTo.address)
              }
            >
              {previewInvoice.billTo.name}
            </div>
            <div
              className="text-xs sm:text-sm mt-1 whitespace-pre-line break-words"
              contentEditable={!isEditMode}
              suppressContentEditableWarning
              data-gramm="false"
              data-gramm_editor="false"
              data-enable-grammarly="false"
              onBlur={(e) =>
                updateBillTo(previewInvoice.billTo.name, e.currentTarget.textContent || '')
              }
            >
              {previewInvoice.billTo.address}
            </div>
          </div>
        </DraggableField>
      )}

      {/* Shipping Address */}
      {fields.shippingAddress.visible && previewInvoice.shippingAddress && (
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
            className="break-words overflow-hidden"
            style={{
              fontSize: `clamp(11px, ${fields.shippingAddress.style.fontSize * 0.8}px, ${fields.shippingAddress.style.fontSize}px)`,
              color: fields.shippingAddress.style.color,
              padding: `${Math.max(4, fields.shippingAddress.style.padding * 0.7)}px`,
            }}
          >
            <h3 className="font-bold mb-1 sm:mb-2" style={{ color: globalStyles.primaryColor }}>
              Shipping Address:
            </h3>
            <div
              className="text-xs sm:text-sm whitespace-pre-line break-words"
              contentEditable={!isEditMode}
              suppressContentEditableWarning
              data-gramm="false"
              data-gramm_editor="false"
              data-enable-grammarly="false"
              onBlur={(e) => updateShippingAddress(e.currentTarget.textContent || '')}
            >
              {previewInvoice.shippingAddress}
            </div>
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
            overflow: 'visible',
          }}
        >
          <div ref={tableRef} style={{ overflow: 'visible', position: 'relative' }}>
            <table
              className="w-full border-collapse min-w-full"
              style={{
                fontSize: `clamp(10px, ${fields.lineItems.style.fontSize * 0.8}px, ${fields.lineItems.style.fontSize}px)`,
                color: fields.lineItems.style.color,
                tableLayout: 'auto',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: globalStyles.primaryColor, color: 'white' }}>
                  <th className="border border-gray-300 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-left">Description</th>
                  <th className="border border-gray-300 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-center whitespace-nowrap">Qty</th>
                  <th className="border border-gray-300 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-right whitespace-nowrap">Unit Price</th>
                  <th className="border border-gray-300 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-right whitespace-nowrap">Total</th>
                </tr>
              </thead>
              <tbody>
                {previewInvoice.lineItems.map((item, index) => (
                  <tr
                    key={item.id}
                    onMouseEnter={() => setHoveredRowId(item.id)}
                    onMouseLeave={() => setHoveredRowId(null)}
                    style={{
                      backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb',
                      position: 'relative',
                    }}
                  >
                    <td className="border border-gray-300 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 break-words">
                      <div
                        contentEditable={!isEditMode}
                        suppressContentEditableWarning
                        data-gramm="false"
                        data-gramm_editor="false"
                        data-enable-grammarly="false"
                        onBlur={(e) =>
                          updateLineItem(item.id, { description: e.currentTarget.textContent || '' })
                        }
                        style={{
                          display: 'block',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          wordBreak: 'break-word',
                          whiteSpace: 'pre-wrap',
                          minHeight: '1em',
                          outline: 'none',
                        }}
                      >
                        {item.description}
                      </div>
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-center whitespace-nowrap">
                      <div
                        contentEditable={!isEditMode}
                        suppressContentEditableWarning
                        data-gramm="false"
                        data-gramm_editor="false"
                        data-enable-grammarly="false"
                        onBlur={(e) =>
                          updateLineItem(item.id, {
                            quantity: parseFloat(e.currentTarget.textContent || '1') || 1,
                          })
                        }
                        style={{
                          display: 'block',
                          whiteSpace: 'nowrap',
                          minHeight: '1em',
                          outline: 'none',
                        }}
                      >
                        {item.quantity}
                      </div>
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-right whitespace-nowrap">
                      <div
                        contentEditable={!isEditMode}
                        suppressContentEditableWarning
                        data-gramm="false"
                        data-gramm_editor="false"
                        data-enable-grammarly="false"
                        onBlur={(e) => {
                          const text = e.currentTarget.textContent || '0';
                          const numericValue = parseFloat(text.replace(/[^0-9.-]/g, '')) || 0;
                          updateLineItem(item.id, { unitPrice: numericValue });
                        }}
                        style={{
                          display: 'block',
                          whiteSpace: 'nowrap',
                          minHeight: '1em',
                          outline: 'none',
                        }}
                      >
                        {formatCurrency(item.unitPrice, previewInvoice.currency)}
                      </div>
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-right whitespace-nowrap">
                      {formatCurrency(item.total, previewInvoice.currency)}
                    </td>
                    {/* Delete button that appears on hover */}
                    {!isEditMode && (
                      <td
                        className="border-0 p-0"
                        onMouseEnter={() => setHoveredRowId(item.id)}
                        onMouseLeave={() => setHoveredRowId(null)}
                        style={{
                          position: 'absolute',
                          right: '-48px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          zIndex: 10,
                          opacity: hoveredRowId === item.id ? 1 : 0,
                          pointerEvents: hoveredRowId === item.id ? 'auto' : 'none',
                          transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out',
                          paddingLeft: '20px',
                          width: '60px',
                        }}
                      >
                        <button
                          onClick={() => removeLineItem(item.id)}
                          className="bg-red-500 hover:bg-red-600 hover:scale-110 text-white w-8 h-8 rounded-full shadow-lg flex items-center justify-center transition-all duration-200"
                          style={{ fontSize: '16px', fontWeight: 'bold', marginLeft: 'auto' }}
                          title="Remove row"
                        >
                          ✕
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {!isEditMode && (
              <button
                onClick={addLineItem}
                className="mt-2 text-primary-600 hover:text-primary-800 hover:bg-primary-50 px-3 py-1 rounded text-sm font-medium border border-primary-300 flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                + Add Row
              </button>
            )}
          </div>
        </DraggableField>
      )}

      {/* Notes */}
      {fields.notes.visible && previewInvoice.notes && (
        <DraggableField
          id="field-notes"
          fieldType="notes"
          isEditMode={isEditMode}
          isSelected={selectedField === 'notes'}
          onClick={() => onFieldSelect('notes')}
          style={{
            position: 'absolute',
            top: `${calculateSafePosition('notes', fields.notes.position.y)}px`,
            left: `${fields.notes.position.x}px`,
            width: `${fields.notes.position.width}px`,
            transition: 'top 0.3s ease-in-out',
          }}
        >
          <div
            className="break-words overflow-hidden"
            style={{
              fontSize: `clamp(10px, ${fields.notes.style.fontSize * 0.8}px, ${fields.notes.style.fontSize}px)`,
              color: fields.notes.style.color,
              padding: `${Math.max(4, fields.notes.style.padding * 0.7)}px`,
            }}
          >
            <h3 className="font-bold mb-1 sm:mb-2" style={{ color: globalStyles.primaryColor }}>
              Notes:
            </h3>
            <div
              className="text-xs sm:text-sm whitespace-pre-line break-words"
              contentEditable={!isEditMode}
              suppressContentEditableWarning
              data-gramm="false"
              data-gramm_editor="false"
              data-enable-grammarly="false"
              onBlur={(e) => updateNotes(e.currentTarget.textContent || '')}
            >
              {previewInvoice.notes}
            </div>
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
            top: `${calculateSafePosition('totals', fields.totals.position.y)}px`,
            left: `${fields.totals.position.x}px`,
            width: `${fields.totals.position.width}px`,
            transition: 'top 0.3s ease-in-out',
          }}
        >
          <div
            style={{
              fontSize: `clamp(11px, ${fields.totals.style.fontSize * 0.8}px, ${fields.totals.style.fontSize}px)`,
              color: fields.totals.style.color,
              padding: `${Math.max(4, fields.totals.style.padding * 0.7)}px`,
            }}
          >
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold">{formatCurrency(previewInvoice.subtotal, previewInvoice.currency)}</span>
              </div>

              {/* VAT Section with Toggle */}
              {previewInvoice.showVAT ? (
                <div
                  className="flex justify-between items-center"
                  onMouseEnter={() => setIsVATHovered(true)}
                  onMouseLeave={() => setIsVATHovered(false)}
                >
                  <div className="flex items-center gap-2">
                    <span>VAT:</span>
                    {!isEditMode && (
                      <button
                        onClick={() =>
                          updateVATType(previewInvoice.vatType === 'amount' ? 'percentage' : 'amount')
                        }
                        className="text-xs px-2 py-0.5 rounded bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center whitespace-nowrap"
                        title="Toggle between amount and percentage"
                      >
                        {previewInvoice.vatType === 'amount' ? '$' : '%'}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {!isEditMode ? (
                      <>
                        <div
                          contentEditable={!isEditMode}
                          suppressContentEditableWarning
                          data-gramm="false"
                          data-gramm_editor="false"
                          data-enable-grammarly="false"
                          onBlur={(e) => {
                            const text = e.currentTarget.textContent || '0';
                            const numericValue = parseFloat(text.replace(/[^0-9.-]/g, '')) || 0;
                            updateVATValue(numericValue);
                          }}
                          className="font-semibold"
                        >
                          {previewInvoice.vatType === 'amount'
                            ? formatCurrency(previewInvoice.vatValue, previewInvoice.currency)
                            : `${previewInvoice.vatValue}%`}
                        </div>
                        {isVATHovered && (
                          <button
                            onClick={toggleVAT}
                            className="transition-opacity text-red-500 hover:text-red-700 ml-1"
                            title="Remove VAT"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="font-semibold">
                        {previewInvoice.vatType === 'amount'
                          ? formatCurrency(previewInvoice.vatValue, previewInvoice.currency)
                          : `${previewInvoice.vatValue}%`}
                      </span>
                    )}
                    {previewInvoice.vatType === 'percentage' && (
                      <span className="text-xs text-gray-500">
                        = {formatCurrency(previewInvoice.totalVat, previewInvoice.currency)}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                !isEditMode && (
                  <button
                    onClick={toggleVAT}
                    className="mt-2 text-primary-600 hover:text-primary-800 hover:bg-primary-50 px-3 py-1 rounded text-sm font-medium border border-primary-300 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    + Add VAT
                  </button>
                )
              )}

              {/* Discount Section */}
              {previewInvoice.showDiscount ? (
                <div
                  className="flex justify-between items-center"
                  onMouseEnter={() => setIsDiscountHovered(true)}
                  onMouseLeave={() => setIsDiscountHovered(false)}
                >
                  <div className="flex items-center gap-2">
                    <span>Discount:</span>
                    {!isEditMode && (
                      <button
                        onClick={() =>
                          updateDiscountType(previewInvoice.discountType === 'amount' ? 'percentage' : 'amount')
                        }
                        className="text-xs px-2 py-0.5 rounded bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center whitespace-nowrap"
                        title="Toggle between amount and percentage"
                      >
                        {previewInvoice.discountType === 'amount' ? '$' : '%'}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {!isEditMode ? (
                      <>
                        <div
                          contentEditable={!isEditMode}
                          suppressContentEditableWarning
                          data-gramm="false"
                          data-gramm_editor="false"
                          data-enable-grammarly="false"
                          onBlur={(e) => {
                            const text = e.currentTarget.textContent || '0';
                            const numericValue = parseFloat(text.replace(/[^0-9.-]/g, '')) || 0;
                            updateDiscountValue(numericValue);
                          }}
                          className="font-semibold"
                        >
                          {previewInvoice.discountType === 'amount'
                            ? formatCurrency(previewInvoice.discountValue, previewInvoice.currency)
                            : `${previewInvoice.discountValue}%`}
                        </div>
                        {isDiscountHovered && (
                          <button
                            onClick={toggleDiscount}
                            className="transition-opacity text-red-500 hover:text-red-700 ml-1"
                            title="Remove Discount"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="font-semibold">
                        {previewInvoice.discountType === 'amount'
                          ? formatCurrency(previewInvoice.discountValue, previewInvoice.currency)
                          : `${previewInvoice.discountValue}%`}
                      </span>
                    )}
                    {previewInvoice.discountType === 'percentage' && (
                      <span className="text-xs text-gray-500">
                        = -{formatCurrency(previewInvoice.totalDiscount, previewInvoice.currency)}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                !isEditMode && (
                  <button
                    onClick={toggleDiscount}
                    className="mt-2 text-primary-600 hover:text-primary-800 hover:bg-primary-50 px-3 py-1 rounded text-sm font-medium border border-primary-300 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    + Add Discount
                  </button>
                )
              )}

              {/* Shipping Fee Section */}
              {previewInvoice.showShipping ? (
                <div
                  className="flex justify-between items-center"
                  onMouseEnter={() => setIsShippingHovered(true)}
                  onMouseLeave={() => setIsShippingHovered(false)}
                >
                  <span>Shipping:</span>
                  <div className="flex items-center gap-1">
                    {!isEditMode ? (
                      <>
                        <div
                          contentEditable={!isEditMode}
                          suppressContentEditableWarning
                          data-gramm="false"
                          data-gramm_editor="false"
                          data-enable-grammarly="false"
                          onBlur={(e) => {
                            const text = e.currentTarget.textContent || '0';
                            const numericValue = parseFloat(text.replace(/[^0-9.-]/g, '')) || 0;
                            updateShippingFee(numericValue);
                          }}
                          className="font-semibold"
                        >
                          {formatCurrency(previewInvoice.shippingFee, previewInvoice.currency)}
                        </div>
                        {isShippingHovered && (
                          <button
                            onClick={toggleShipping}
                            className="transition-opacity text-red-500 hover:text-red-700 ml-1"
                            title="Remove Shipping"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="font-semibold">
                        {formatCurrency(previewInvoice.shippingFee, previewInvoice.currency)}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                !isEditMode && (
                  <button
                    onClick={toggleShipping}
                    className="mt-2 text-primary-600 hover:text-primary-800 hover:bg-primary-50 px-3 py-1 rounded text-sm font-medium border border-primary-300 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    + Add Shipping
                  </button>
                )
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
                  {formatCurrency(previewInvoice.grandTotal, previewInvoice.currency)}
                </span>
              </div>
            </div>
          </div>
        </DraggableField>
      )}
      </div>
    </div>
  );
};
