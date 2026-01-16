export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceParty {
  name: string;
  address: string;
}

export type VATType = 'amount' | 'percentage';
export type DiscountType = 'amount' | 'percentage';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: Date;
  dueDate?: Date;
  billFrom: InvoiceParty;
  billTo: InvoiceParty;
  billingAddress: string;
  shippingAddress: string;
  lineItems: LineItem[];
  notes: string;
  currency: string; // Currency code (e.g., 'USD', 'EUR')
  subtotal: number;
  showVAT: boolean; // Whether VAT section is visible
  vatType: VATType;
  vatValue: number;
  totalVat: number;
  showDiscount: boolean; // Whether discount section is visible
  discountType: DiscountType;
  discountValue: number;
  totalDiscount: number;
  showShipping: boolean; // Whether shipping fee section is visible
  shippingFee: number;
  grandTotal: number;
}

export interface InvoiceGroup {
  customerKey: string;
  invoice: Invoice;
}
