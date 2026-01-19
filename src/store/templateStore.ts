import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TemplateConfig, FieldType, FieldConfig } from '../types';
import { defaultTemplate } from '../constants/defaultTemplate';

interface TemplateState {
  config: TemplateConfig;
  isDirty: boolean;

  // Actions
  updateGlobalStyles: (styles: Partial<TemplateConfig['globalStyles']>) => void;
  updateFieldVisibility: (fieldType: FieldType, visible: boolean) => void;
  updateFieldPosition: (
    fieldType: FieldType,
    position: Partial<FieldConfig['position']>
  ) => void;
  updateFieldStyle: (fieldType: FieldType, style: Partial<FieldConfig['style']>) => void;
  updateLogo: (logoData: Partial<TemplateConfig['logo']>) => void;
  reorderFields: (
    zone: 'headerFields' | 'bodyFields' | 'footerFields',
    fieldTypes: FieldType[]
  ) => void;
  resetToDefault: () => void;
  loadTemplate: (config: TemplateConfig) => void;
}

export const useTemplateStore = create<TemplateState>()(
  persist(
    (set) => ({
      config: defaultTemplate,
      isDirty: false,

      updateGlobalStyles: (styles) =>
        set((state) => ({
          config: {
            ...state.config,
            globalStyles: { ...state.config.globalStyles, ...styles },
            updatedAt: new Date(),
          },
          isDirty: true,
        })),

      updateFieldVisibility: (fieldType, visible) =>
        set((state) => ({
          config: {
            ...state.config,
            fields: {
              ...state.config.fields,
              [fieldType]: {
                ...state.config.fields[fieldType],
                visible,
              },
            },
            updatedAt: new Date(),
          },
          isDirty: true,
        })),

      updateFieldPosition: (fieldType, position) =>
        set((state) => ({
          config: {
            ...state.config,
            fields: {
              ...state.config.fields,
              [fieldType]: {
                ...state.config.fields[fieldType],
                position: {
                  ...state.config.fields[fieldType].position,
                  ...position,
                },
              },
            },
            updatedAt: new Date(),
          },
          isDirty: true,
        })),

      updateFieldStyle: (fieldType, style) =>
        set((state) => ({
          config: {
            ...state.config,
            fields: {
              ...state.config.fields,
              [fieldType]: {
                ...state.config.fields[fieldType],
                style: {
                  ...state.config.fields[fieldType].style,
                  ...style,
                },
              },
            },
            updatedAt: new Date(),
          },
          isDirty: true,
        })),

      updateLogo: (logoData) =>
        set((state) => ({
          config: {
            ...state.config,
            logo: {
              ...state.config.logo,
              ...logoData,
            },
            updatedAt: new Date(),
          },
          isDirty: true,
        })),

      reorderFields: (zone, fieldTypes) =>
        set((state) => ({
          config: {
            ...state.config,
            layout: {
              ...state.config.layout,
              [zone]: fieldTypes,
            },
            updatedAt: new Date(),
          },
          isDirty: true,
        })),

      resetToDefault: () =>
        set({
          config: defaultTemplate,
          isDirty: false,
        }),

      loadTemplate: (config) =>
        set({
          config,
          isDirty: false,
        }),
    }),
    {
      name: 'invoice-template-config',
      version: 2,
      migrate: (persistedState: any) => {
        // Migrate old table width (680) to new centered width (714)
        if (persistedState?.config?.fields?.lineItems?.position?.width === 680) {
          persistedState.config.fields.lineItems.position.width = 714;
        }
        return persistedState;
      },
    }
  )
);
