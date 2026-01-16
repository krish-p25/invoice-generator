import { CSV_COLUMNS } from '../constants/csvTemplate';

export function generateCSVTemplate(): Blob {
  const header = CSV_COLUMNS.join(',');
  const sampleRow = [
    'Your Company Name',
    'Customer Name',
    '123 Billing St, City, Country',
    '456 Shipping Ave, City, Country',
    'Product/Service Description',
    '1',
    '100.00',
    '20',
    'Thank you for your business!',
  ].join(',');

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
