import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { FieldType } from '../../types';

interface DraggableFieldProps {
  id: string;
  fieldType: FieldType;
  children: React.ReactNode;
  isEditMode: boolean;
  isSelected: boolean;
  onClick: () => void;
  style?: React.CSSProperties;
}

export const DraggableField: React.FC<DraggableFieldProps> = ({
  id,
  fieldType,
  children,
  isEditMode,
  isSelected,
  onClick,
  style,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled: !isEditMode,
  });

  const draggableStyle: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    cursor: isEditMode ? 'move' : 'default',
    position: 'relative',
    transition: isDragging ? 'none' : 'all 0.2s ease',
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : isSelected ? 100 : 1,
    ...style,
  };

  return (
    <div
      ref={setNodeRef}
      style={draggableStyle}
      {...(isEditMode ? { ...listeners, ...attributes } : {})}
      onClick={isEditMode ? onClick : undefined}
      className={`
        ${isEditMode ? 'hover:ring-2 hover:ring-primary-400' : ''}
        ${isSelected ? 'ring-2 ring-primary-600 ring-offset-2' : ''}
        ${isEditMode ? 'transition-shadow' : ''}
      `}
    >
      {children}

      {isEditMode && isSelected && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Selection border */}
          <div className="absolute inset-0 border-2 border-primary-600" />

          {/* Field label */}
          <div className="absolute -top-6 left-0 bg-primary-600 text-white text-xs px-2 py-1 rounded">
            {fieldType}
          </div>

          {/* Resize handles */}
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-white border-2 border-primary-600 rounded-full" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-white border-2 border-primary-600 rounded-full" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border-2 border-primary-600 rounded-full" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border-2 border-primary-600 rounded-full" />
        </div>
      )}
    </div>
  );
};
