import { Invoice } from '../types';

export const SAMPLE_INVOICE: Invoice = {
  id: 'sample',
  invoiceNumber: 'INV-2026-0001',
  date: new Date('2026-01-15'),
  billFrom: {
    name: 'Your Company Name',
    address: '123 Business Street\nCity, State 12345\nCountry',
  },
  billTo: {
    name: 'Customer Name',
    address: '456 Customer Avenue\nCity, State 67890\nCountry',
  },
  billingAddress: '123 Business Street, City, State 12345, Country',
  shippingAddress: '456 Customer Avenue, City, State 67890, Country',
  lineItems: [
    {
      id: '1',
      description: 'Product/Service 1',
      quantity: 2,
      unitPrice: 100.0,
      total: 200.0,
    },
    {
      id: '2',
      description: 'Product/Service 2',
      quantity: 1,
      unitPrice: 150.0,
      total: 150.0,
    },
    {
      id: '3',
      description: 'Product/Service 3',
      quantity: 3,
      unitPrice: 50.0,
      total: 150.0,
    },
  ],
  notes: 'Thank you for your business!\nPayment is due within 30 days.',
  currency: 'USD',
  subtotal: 500.0,
  showVAT: true,
  vatType: 'percentage',
  vatValue: 20,
  totalVat: 100.0,
  showDiscount: false,
  discountType: 'percentage',
  discountValue: 0,
  totalDiscount: 0,
  showShipping: false,
  shippingFee: 0,
  grandTotal: 600.0,
};
