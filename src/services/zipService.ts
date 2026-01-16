import JSZip from 'jszip';

export async function createInvoiceZip(
  pdfBlobs: Map<string, Blob>,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const zip = new JSZip();
  const invoicesFolder = zip.folder('invoices');

  if (!invoicesFolder) throw new Error('Failed to create ZIP folder');

  let processed = 0;
  const total = pdfBlobs.size;

  for (const [filename, blob] of pdfBlobs) {
    invoicesFolder.file(filename, blob);
    processed++;
    onProgress?.(processed / total);
  }

  return zip.generateAsync(
    { type: 'blob', compression: 'DEFLATE' },
    (metadata) => onProgress?.(metadata.percent / 100)
  );
}

export function downloadZip(blob: Blob, filename: string = 'invoices.zip'): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
