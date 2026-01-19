import { v4 as uuidv4 } from 'uuid';
import { CSVRow, Invoice } from '../types';
import { format } from 'date-fns';

export function groupCSVRowsToInvoices(rows: CSVRow[]): Invoice[] {
  const invoiceMap = new Map<string, Invoice>();
  const customerVATMap = new Map<string, number>(); // Track VAT rate per customer

  rows.forEach((row) => {
    const customerKey = row.billTo.trim().toLowerCase();
    const vatRate = parseFloat(String(row.itemVAT)) || 0;

    // Store first VAT rate encountered for this customer
    if (!customerVATMap.has(customerKey)) {
      customerVATMap.set(customerKey, vatRate);
    }

    if (!invoiceMap.has(customerKey)) {
      // Create new invoice for this customer
      invoiceMap.set(customerKey, {
        id: uuidv4(),
        invoiceNumber: generateInvoiceNumber(invoiceMap.size),
        date: new Date(),
        billFrom: {
          name: row.billFrom,
          address: row.billingAddress,
        },
        billTo: {
          name: row.billTo,
          address: row.shippingAddress,
        },
        billingAddress: row.billingAddress,
        shippingAddress: row.shippingAddress,
        lineItems: [],
        notes: row.invoiceNotes,
        currency: 'USD',
        subtotal: 0,
        showVAT: vatRate > 0,
        vatType: 'percentage',
        vatValue: vatRate,
        totalVat: 0,
        showDiscount: false,
        discountType: 'percentage',
        discountValue: 0,
        totalDiscount: 0,
        showShipping: false,
        shippingFee: 0,
        grandTotal: 0,
      });
    }

    // Add line item to existing invoice
    const invoice = invoiceMap.get(customerKey)!;
    const quantity = parseFloat(String(row.itemQuantity)) || 0;
    const unitPrice = parseFloat(String(row.itemPrice)) || 0;
    const itemTotal = quantity * unitPrice;

    invoice.lineItems.push({
      id: uuidv4(),
      description: row.itemDescription,
      quantity,
      unitPrice,
      total: itemTotal,
    });

    // Update invoice notes (concatenate if different)
    if (row.invoiceNotes && !invoice.notes.includes(row.invoiceNotes)) {
      invoice.notes = invoice.notes
        ? `${invoice.notes}\n${row.invoiceNotes}`
        : row.invoiceNotes;
    }
  });

  // Calculate totals for each invoice
  invoiceMap.forEach((invoice) => {
    invoice.subtotal = invoice.lineItems.reduce((sum, item) => sum + item.total, 0);

    // Calculate VAT based on type
    if (invoice.vatType === 'percentage') {
      invoice.totalVat = invoice.subtotal * (invoice.vatValue / 100);
    } else {
      invoice.totalVat = invoice.vatValue;
    }

    invoice.grandTotal = invoice.subtotal + invoice.totalVat;
  });

  return Array.from(invoiceMap.values());
}

function generateInvoiceNumber(index: number): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const sequence = String(index + 1).padStart(4, '0');
  return `INV-${year}${month}-${sequence}`;
}

export function getInvoiceFileName(invoice: Invoice): string {
  const customerName = invoice.billTo.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const date = format(invoice.date, 'yyyy-MM-dd');
  return `invoice_${customerName}_${date}_${invoice.invoiceNumber}.pdf`;
}
