import React, { useState, useRef, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragMoveEvent,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  Modifier,
} from '@dnd-kit/core';
import { EditableContentRenderer } from './EditableContentRenderer';
import { Button } from '../common/Button';
import { FieldType, TemplateConfig } from '../../types';
import { useTemplateStore } from '../../store/templateStore';
import { usePreviewStore } from '../../store/previewStore';
import { CURRENCIES } from '../../constants/currencies';
import { generateInvoicePDF, downloadPDF } from '../../services/pdfService';

const SNAP_THRESHOLD = 10; // px in invoice coordinate space

interface SnapGuides {
  x: number[]; // vertical lines (snap to x-alignment)
  y: number[]; // horizontal lines (snap to y-alignment)
}

type SnapCandidate = {
  dist: number;
  guide: number;
  newT: number;
};

function computeSnap(
  activeType: FieldType,
  transform: { x: number; y: number },
  fields: TemplateConfig['fields']
): { transform: { x: number; y: number }; guides: SnapGuides } {
  const active = fields[activeType];
  if (!active) return { transform, guides: { x: [], y: [] } };

  const ax = active.position.x + transform.x;
  const ay = active.position.y + transform.y;
  const aw = active.position.width;
  const ah = active.position.height;

  // [currentValue, offsetToApplyToTransform]
  const dragX: [number, number][] = [
    [ax, 0],
    [ax + aw / 2, -aw / 2],
    [ax + aw, -aw],
  ];
  const dragY: [number, number][] = [
    [ay, 0],
    [ay + ah / 2, -ah / 2],
    [ay + ah, -ah],
  ];

  let bestX: SnapCandidate | null = null;
  let bestY: SnapCandidate | null = null;

  (Object.entries(fields) as [FieldType, typeof fields[FieldType]][]).forEach(
    ([fType, field]) => {
      if (fType === activeType || !field.visible) return;

      const { x: fx, y: fy, width: fw, height: fh } = field.position;
      const targetsX = [fx, fx + fw / 2, fx + fw];
      const targetsY = [fy, fy + fh / 2, fy + fh];

      dragX.forEach(([dx, off]) => {
        targetsX.forEach((tx) => {
          const d = Math.abs(dx - tx);
          if (d < SNAP_THRESHOLD && (!bestX || d < bestX.dist)) {
            bestX = { dist: d, guide: tx, newT: tx + off - active.position.x };
          }
        });
      });

      dragY.forEach(([dy, off]) => {
        targetsY.forEach((ty) => {
          const d = Math.abs(dy - ty);
          if (d < SNAP_THRESHOLD && (!bestY || d < bestY.dist)) {
            bestY = { dist: d, guide: ty, newT: ty + off - active.position.y };
          }
        });
      });
    }
  );

  return {
    transform: {
      x: bestX ? (bestX as SnapCandidate).newT : transform.x,
      y: bestY ? (bestY as SnapCandidate).newT : transform.y,
    },
    guides: {
      x: bestX ? [(bestX as SnapCandidate).guide] : [],
      y: bestY ? [(bestY as SnapCandidate).guide] : [],
    },
  };
}

export const TemplateCanvas: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedField, setSelectedField] = useState<FieldType | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [snapGuides, setSnapGuides] = useState<SnapGuides>({ x: [], y: [] });

  const { config, updateFieldPosition } = useTemplateStore();
  const { previewInvoice, resetToSample, updateCurrency, incrementInvoiceNumber } = usePreviewStore();

  // Refs so modifier and handlers always see the latest values without stale closure issues
  const configRef = useRef(config);
  configRef.current = config;

  const activeFieldTypeRef = useRef<FieldType | null>(null);
  const snapGuidesRef = useRef<SnapGuides>({ x: [], y: [] });
  const lastSnappedTransformRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  // Modifier: runs on every drag move, snaps the visual transform and stores guides
  const snapModifier: Modifier = useCallback(({ transform, active }) => {
    if (!active || !activeFieldTypeRef.current) return transform;

    const result = computeSnap(
      activeFieldTypeRef.current,
      { x: transform.x, y: transform.y },
      configRef.current.fields
    );

    lastSnappedTransformRef.current = result.transform;
    snapGuidesRef.current = result.guides;

    return { ...transform, x: result.transform.x, y: result.transform.y };
  }, []);

  const handleDragStart = ({ active }: DragStartEvent) => {
    const fieldType = active.id.toString().replace('field-', '') as FieldType;
    activeFieldTypeRef.current = fieldType;
    lastSnappedTransformRef.current = { x: 0, y: 0 };
    snapGuidesRef.current = { x: [], y: [] };
  };

  const handleDragMove = (_event: DragMoveEvent) => {
    // Sync the ref (updated by the modifier) to state so guides render
    setSnapGuides({ ...snapGuidesRef.current });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active } = event;

    // Clear guides
    setSnapGuides({ x: [], y: [] });
    activeFieldTypeRef.current = null;

    const fieldType = active.id.toString().replace('field-', '') as FieldType;
    const currentField = configRef.current.fields[fieldType];
    if (!currentField) return;

    const { x: tx, y: ty } = lastSnappedTransformRef.current;
    if (!tx && !ty) return;

    updateFieldPosition(fieldType, {
      x: Math.max(0, currentField.position.x + tx),
      y: Math.max(0, currentField.position.y + ty),
    });
  };

  const handleFieldSelect = (fieldType: FieldType) => {
    if (isEditMode) setSelectedField(fieldType);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setSelectedField(null);
    setSnapGuides({ x: [], y: [] });
    activeFieldTypeRef.current = null;
  };

  const handleDownloadInvoice = async () => {
    setIsDownloading(true);
    try {
      const elementId = `preview-invoice-renderer`;
      const blob = await generateInvoicePDF(elementId);
      const fileName = `${previewInvoice.invoiceNumber}_${previewInvoice.billTo.name.replace(/[^a-z0-9]/gi, '_')}.pdf`;
      downloadPDF(blob, fileName);
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
        </div>
        <div className="flex items-center gap-2 flex-wrap">
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

          <Button variant={isEditMode ? 'success' : 'primary'} size="sm" onClick={toggleEditMode}>
            {isEditMode ? (
              <>
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="hidden sm:inline">Done Editing</span>
                <span className="sm:hidden">Done</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="hidden sm:inline">Edit Layout</span>
                <span className="sm:hidden">Edit</span>
              </>
            )}
          </Button>

          {!isEditMode && (
            <Button variant="primary" size="sm" onClick={handleDownloadInvoice} loading={isDownloading} disabled={isDownloading}>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden sm:inline">Download</span>
            </Button>
          )}
        </div>
      </div>

      {/* Instructions Overlay */}
      <div className="mb-4">
        {!isEditMode && (
          <div className="bg-blue-100 border border-blue-300 rounded-lg p-2 sm:p-3">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-xs sm:text-sm text-blue-900">
                <p className="font-semibold mb-1">Editting Invoice Content</p>
                <p className="hidden sm:block">
                  <strong>Click on any text</strong> to edit it with your details. Add/remove table rows.
                  Use <strong>"Edit Layout"</strong> to reposition fields.
                </p>
                <p className="sm:hidden">Tap text to edit. Tap <strong>"Edit"</strong> for layout</p>
              </div>
            </div>
          </div>
        )}

        {isEditMode && (
          <div className="bg-green-100 border border-green-300 rounded-lg p-2 sm:p-3">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <div className="text-xs sm:text-sm text-green-900">
                <p className="font-semibold mb-1">Editting Invoice Layout</p>
                <ul className="space-y-1 text-xs">
                  <li className="hidden sm:list-item">• Drag fields to reposition — blue lines appear when aligned</li>
                  <li className="hidden sm:list-item">• Fields snap to edges and centers of other fields</li>
                  <li className="hidden sm:list-item">• Changes save automatically</li>
                  <li className="sm:hidden">• Tap &amp; hold to drag, snaps to align</li>
                  <li className="sm:hidden">• Auto-saves changes</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Canvas */}
      <div className="relative">
        {isEditMode && (
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
          modifiers={isEditMode ? [snapModifier] : []}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
        >
          <div className="relative">
            <EditableContentRenderer
              isEditMode={isEditMode}
              selectedField={selectedField}
              onFieldSelect={handleFieldSelect}
              snapGuides={isEditMode ? snapGuides : undefined}
            />
          </div>
        </DndContext>

        {isEditMode && selectedField && (
          <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-primary-600 text-white rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 shadow-lg">
            <div className="flex items-center gap-2">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-xs sm:text-sm font-medium">Selected: {selectedField}</span>
            </div>
          </div>
        )}
      </div>

      {/* Hidden renderer for PDF generation */}
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
