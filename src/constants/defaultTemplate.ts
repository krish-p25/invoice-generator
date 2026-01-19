import { TemplateConfig, FieldStyle } from '../types';

const defaultFieldStyle: FieldStyle = {
  fontSize: 14,
  fontFamily: 'inherit',
  fontWeight: 'normal',
  color: '#1f2937',
  backgroundColor: 'transparent',
  borderColor: 'transparent',
  borderWidth: 0,
  padding: 8,
  textAlign: 'left',
};

export const defaultTemplate: TemplateConfig = {
  id: 'default',
  name: 'Default Invoice Template',
  version: 2,
  createdAt: new Date(),
  updatedAt: new Date(),

  globalStyles: {
    primaryColor: '#1a56db',
    secondaryColor: '#6b7280',
    accentColor: '#059669',
    fontFamily: 'Inter, system-ui, sans-serif',
    backgroundColor: '#ffffff',
  },

  logo: {
    url: null,
    dataUrl: null,
    position: { x: 0, y: 0, width: 150, height: 60, zIndex: 1 },
    maxWidth: 200,
    maxHeight: 80,
  },

  fields: {
    logo: {
      id: 'logo',
      type: 'logo',
      label: 'Company Logo',
      visible: true,
      position: { x: 40, y: 40, width: 150, height: 60, zIndex: 1 },
      style: defaultFieldStyle,
    },
    invoiceNumber: {
      id: 'invoiceNumber',
      type: 'invoiceNumber',
      label: 'Invoice Number',
      visible: true,
      position: { x: 500, y: 40, width: 220, height: 30, zIndex: 1 },
      style: { ...defaultFieldStyle, textAlign: 'right' },
    },
    invoiceDate: {
      id: 'invoiceDate',
      type: 'invoiceDate',
      label: 'Invoice Date',
      visible: true,
      position: { x: 500, y: 75, width: 220, height: 30, zIndex: 1 },
      style: { ...defaultFieldStyle, textAlign: 'right' },
    },
    billFrom: {
      id: 'billFrom',
      type: 'billFrom',
      label: 'Bill From',
      visible: true,
      position: { x: 40, y: 130, width: 300, height: 110, zIndex: 1 },
      style: defaultFieldStyle,
    },
    billTo: {
      id: 'billTo',
      type: 'billTo',
      label: 'Bill To',
      visible: true,
      position: { x: 400, y: 130, width: 320, height: 110, zIndex: 1 },
      style: defaultFieldStyle,
    },
    billingAddress: {
      id: 'billingAddress',
      type: 'billingAddress',
      label: 'Billing Address',
      visible: false,
      position: { x: 40, y: 260, width: 300, height: 70, zIndex: 1 },
      style: defaultFieldStyle,
    },
    shippingAddress: {
      id: 'shippingAddress',
      type: 'shippingAddress',
      label: 'Shipping Address',
      visible: true,
      position: { x: 40, y: 260, width: 300, height: 70, zIndex: 1 },
      style: defaultFieldStyle,
    },
    lineItems: {
      id: 'lineItems',
      type: 'lineItems',
      label: 'Line Items',
      visible: true,
      position: { x: 40, y: 360, width: 714, height: 280, zIndex: 1 },
      style: defaultFieldStyle,
    },
    totals: {
      id: 'totals',
      type: 'totals',
      label: 'Totals',
      visible: true,
      position: { x: 480, y: 670, width: 240, height: 120, zIndex: 1 },
      style: { ...defaultFieldStyle, textAlign: 'right' },
    },
    notes: {
      id: 'notes',
      type: 'notes',
      label: 'Notes',
      visible: true,
      position: { x: 40, y: 670, width: 400, height: 120, zIndex: 1 },
      style: { ...defaultFieldStyle, fontSize: 12 },
    },
  },

  layout: {
    headerFields: ['logo', 'invoiceNumber', 'invoiceDate'],
    bodyFields: ['billFrom', 'billTo', 'billingAddress', 'shippingAddress', 'lineItems'],
    footerFields: ['totals', 'notes'],
  },
};
