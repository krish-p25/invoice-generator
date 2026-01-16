export type FieldType =
  | 'logo'
  | 'invoiceNumber'
  | 'invoiceDate'
  | 'billFrom'
  | 'billTo'
  | 'billingAddress'
  | 'shippingAddress'
  | 'lineItems'
  | 'notes'
  | 'totals';

export interface FieldPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

export interface FieldStyle {
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  color: string;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  padding: number;
  textAlign: 'left' | 'center' | 'right';
}

export interface FieldConfig {
  id: string;
  type: FieldType;
  label: string;
  visible: boolean;
  position: FieldPosition;
  style: FieldStyle;
}

export interface TemplateConfig {
  id: string;
  name: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;

  globalStyles: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
    backgroundColor: string;
  };

  logo: {
    url: string | null;
    dataUrl: string | null;
    position: FieldPosition;
    maxWidth: number;
    maxHeight: number;
  };

  fields: Record<FieldType, FieldConfig>;

  layout: {
    headerFields: FieldType[];
    bodyFields: FieldType[];
    footerFields: FieldType[];
  };
}

export interface TemplatePreset {
  id: string;
  name: string;
  thumbnail: string;
  config: TemplateConfig;
}
