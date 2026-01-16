import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Invoice, TemplateConfig } from '../types';

export async function generateInvoicePDF(
  invoice: Invoice,
  elementId: string
): Promise<Blob> {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Invoice element not found');

  // Capture the styled element with high resolution
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

  const imgX = (pdfWidth - imgWidth * ratio) / 2;
  const imgY = 10;

  pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

  return pdf.output('blob');
}

export async function generateBulkPDFs(
  invoices: Invoice[],
  onProgress?: (current: number, total: number) => void
): Promise<Map<string, Blob>> {
  const results = new Map<string, Blob>();

  for (let i = 0; i < invoices.length; i++) {
    const invoice = invoices[i];
    const elementId = `invoice-renderer-${invoice.id}`;

    try {
      const blob = await generateInvoicePDF(invoice, elementId);
      const fileName = `${invoice.invoiceNumber}_${invoice.billTo.name.replace(/[^a-z0-9]/gi, '_')}.pdf`;
      results.set(fileName, blob);
      onProgress?.(i + 1, invoices.length);
    } catch (error) {
      console.error(`Failed to generate PDF for invoice ${invoice.invoiceNumber}:`, error);
    }
  }

  return results;
}

export function downloadPDF(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
