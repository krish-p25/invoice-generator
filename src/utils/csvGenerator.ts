import { CSV_COLUMNS } from '../constants/csvTemplate';

type CSVColumn = (typeof CSV_COLUMNS)[number];

// Keyed by column name rather than positional, so adding a column to
// CSV_COLUMNS is a compile error here until a sample value is supplied.
const SAMPLE_VALUES: Record<CSVColumn, string> = {
  'bill from': 'Your Company Name',
  'bill to': 'Customer Name',
  'billing address': '123 Billing St, City, Country',
  'shipping address': '456 Shipping Ave, City, Country',
  'show shipping address': 'yes',
  'item description': 'Product/Service Description',
  'item quantity': '1',
  'item price': '100.00',
  'item VAT': '20',
  'invoice notes': 'Thank you for your business!',
};

// Values containing a comma, quote or newline must be quoted, or the sample
// addresses split into extra columns and the template parses misaligned.
function escapeCSVValue(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function generateCSVTemplate(): Blob {
  const header = CSV_COLUMNS.map(escapeCSVValue).join(',');
  const sampleRow = CSV_COLUMNS.map((column) =>
    escapeCSVValue(SAMPLE_VALUES[column])
  ).join(',');

  const csvContent = `${header}\n${sampleRow}`;
  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
}

export function downloadCSVTemplate(): void {
  const blob = generateCSVTemplate();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'invoice_template.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
