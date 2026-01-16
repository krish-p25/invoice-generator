export interface CSVRow {
  billFrom: string;
  billTo: string;
  billingAddress: string;
  shippingAddress: string;
  itemDescription: string;
  itemQuantity: string | number;
  itemPrice: string | number;
  itemVAT: string | number;
  invoiceNotes: string;
}

export interface CSVParseResult {
  data: CSVRow[];
  errors: CSVParseError[];
  meta: {
    delimiter: string;
    linebreak: string;
    fields: string[];
  };
}

export interface CSVParseError {
  row: number;
  code: string;
  message: string;
  type: 'FieldMismatch' | 'QuoteError' | 'InvalidType';
}

export interface CSVColumnMapping {
  csvHeader: string;
  internalField: keyof CSVRow;
  required: boolean;
  validator?: (value: string) => boolean;
}
