import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  DragOverlay,
} from '@dnd-kit/core';
import { EditableContentRenderer } from './EditableContentRenderer';
import { InvoiceRenderer } from '../invoice/InvoiceRenderer';
import { Button } from '../common/Button';
import { FieldType } from '../../types';
import { useTemplateStore } from '../../store/templateStore';
import { usePreviewStore } from '../../store/previewStore';
import { CURRENCIES } from '../../constants/currencies';
import { generateInvoicePDF, downloadPDF } from '../../services/pdfService';

export const TemplateCanvas: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedField, setSelectedField] = useState<FieldType | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const { config, updateFieldPosition } = useTemplateStore();
  const { previewInvoice, resetToSample, updateCurrency, incrementInvoiceNumber } = usePreviewStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;

    if (!delta.x && !delta.y) return; // No movement

    // Extract field type from the drag ID (format: "field-logo" -> "logo")
    const fieldId = active.id.toString();
    const fieldType = fieldId.replace('field-', '') as FieldType;

    // Get current position
    const currentField = config.fields[fieldType];
    if (!currentField) return;

    // Calculate new position
    const newX = currentField.position.x + delta.x;
    const newY = currentField.position.y + delta.y;

    // Update position in store
    updateFieldPosition(fieldType, {
      x: Math.max(0, newX), // Don't go negative
      y: Math.max(0, newY),
    });

    console.log(`Moved ${fieldType} by (${delta.x}, ${delta.y}) to (${newX}, ${newY})`);
  };

  const handleDragMove = (event: DragMoveEvent) => {
    // Real-time position feedback during drag
  };

  const handleFieldSelect = (fieldType: FieldType) => {
    if (isEditMode) {
      setSelectedField(fieldType);
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      setSelectedField(null);
    }
  };

  const handleDownloadInvoice = async () => {
    setIsDownloading(true);
    try {
      const elementId = `preview-invoice-renderer`;
      const blob = await generateInvoicePDF(previewInvoice, elementId);
      const fileName = `${previewInvoice.invoiceNumber}_${previewInvoice.billTo.name.replace(/[^a-z0-9]/gi, '_')}.pdf`;
      downloadPDF(blob, fileName);

      // Automatically increment invoice number after successful download
      incrementInvoiceNumber();
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Template Preview</h3>
          {isEditMode ? (
            <span className="flex items-center gap-2 text-xs sm:text-sm text-primary-600 font-medium">
              <svg className="w-4 h-4 animate-pulse flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="hidden sm:inline">Edit Mode Active - Click and drag fields to reposition</span>
              <span className="sm:hidden">Edit Mode - Drag to move</span>
            </span>
          ) : ''}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Currency Selector */}
          <select
            value={previewInvoice.currency}
            onChange={(e) => updateCurrency(e.target.value)}
            className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md bg-white hover:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          >
            {CURRENCIES.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code} - {currency.name}
              </option>
            ))}
          </select>

          {!isEditMode && (
            <Button variant="outline" size="sm" onClick={resetToSample}>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">Reset</span>
            </Button>
          )}
          {isEditMode && (
            <Button variant="outline" size="sm" onClick={() => setShowGrid(!showGrid)}>
              <span className="hidden sm:inline">{showGrid ? 'Hide' : 'Show'} Grid</span>
              <span className="sm:hidden">{showGrid ? 'Hide' : 'Show'}</span>
            </Button>
          )}
          <Button
            variant={isEditMode ? 'success' : 'primary'}
            size="sm"
            onClick={toggleEditMode}
          >
            {isEditMode ? (
              <>
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="hidden sm:inline">Done Editing</span>
                <span className="sm:hidden">Done</span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span className="hidden sm:inline">Edit Layout</span>
                <span className="sm:hidden">Edit</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Instructions Overlay - Above Canvas */}
      <div className="mb-4">
        {!isEditMode && (
          <div className="bg-blue-100 border border-blue-300 rounded-lg p-2 sm:p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="text-xs sm:text-sm text-blue-900">
                  <p className="font-semibold mb-1">Edit Invoice Content</p>
                  <p className="hidden sm:block">
                    <strong>Click on any text</strong> to edit it with your details. Add/remove table rows.
                    Use <strong>"Edit Layout"</strong> to reposition fields.
                  </p>
                  <p className="sm:hidden">
                    Tap text to edit. Tap <strong>"Edit"</strong> for layout
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDownloadInvoice}
                loading={isDownloading}
                disabled={isDownloading}
                className="flex-shrink-0"
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
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
                <span className="hidden sm:inline">Download</span>
              </Button>
            </div>
          </div>
        )}

        {isEditMode && (
          <div className="bg-green-100 border border-green-300 rounded-lg p-2 sm:p-3">
            <div className="flex items-start gap-2">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <div className="text-xs sm:text-sm text-green-900">
                <p className="font-semibold mb-1">Edit Mode Active</p>
                <ul className="space-y-1 text-xs">
                  <li className="hidden sm:list-item">• Click any field to select it</li>
                  <li className="hidden sm:list-item">• Drag fields to move them</li>
                  <li className="hidden sm:list-item">• Changes save automatically</li>
                  <li className="sm:hidden">• Tap & hold to drag</li>
                  <li className="sm:hidden">• Auto-saves changes</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Canvas */}
      <div className="relative">
        {/* Grid Background */}
        {showGrid && isEditMode && (
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
              opacity: 0.5,
            }}
          />
        )}

        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          onDragMove={handleDragMove}
        >
          <div className="relative">
            <EditableContentRenderer
              isEditMode={isEditMode}
              selectedField={selectedField}
              onFieldSelect={handleFieldSelect}
            />
          </div>
        </DndContext>

        {/* Selected Field Info */}
        {isEditMode && selectedField && (
          <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-primary-600 text-white rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 shadow-lg">
            <div className="flex items-center gap-2">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs sm:text-sm font-medium">Selected: {selectedField}</span>
            </div>
          </div>
        )}
      </div>

      {/* Hidden renderer for PDF generation - positioned off-screen */}
      <div style={{ position: 'absolute', left: '-9999px', top: '0', width: '794px' }}>
        <div id="preview-invoice-renderer">
          <EditableContentRenderer
            isEditMode={true}
            selectedField={null}
            onFieldSelect={() => {}}
            disableScaling={true}
          />
        </div>
      </div>
    </div>
  );
};
