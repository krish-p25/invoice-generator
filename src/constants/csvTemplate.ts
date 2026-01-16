import { CSVColumnMapping } from '../types';

export const CSV_COLUMNS = [
  'bill from',
  'bill to',
  'billing address',
  'shipping address',
  'item description',
  'item quantity',
  'item price',
  'item VAT',
  'invoice notes',
] as const;

export const CSV_COLUMN_MAPPINGS: CSVColumnMapping[] = [
  {
    csvHeader: 'bill from',
    internalField: 'billFrom',
    required: true,
  },
  {
    csvHeader: 'bill to',
    internalField: 'billTo',
    required: true,
  },
  {
    csvHeader: 'billing address',
    internalField: 'billingAddress',
    required: true,
  },
  {
    csvHeader: 'shipping address',
    internalField: 'shippingAddress',
    required: false,
  },
  {
    csvHeader: 'item description',
    internalField: 'itemDescription',
    required: true,
  },
  {
    csvHeader: 'item quantity',
    internalField: 'itemQuantity',
    required: true,
    validator: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) > 0,
  },
  {
    csvHeader: 'item price',
    internalField: 'itemPrice',
    required: true,
    validator: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
  },
  {
    csvHeader: 'item VAT',
    internalField: 'itemVAT',
    required: false,
    validator: (value: string) => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
  },
  {
    csvHeader: 'invoice notes',
    internalField: 'invoiceNotes',
    required: false,
  },
];
