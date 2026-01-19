import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Invoice, LineItem, VATType, DiscountType } from '../types';
import { SAMPLE_INVOICE } from '../constants/sampleData';
import { v4 as uuidv4 } from 'uuid';

interface PreviewInvoiceState {
  previewInvoice: Invoice;
  updateBillFrom: (name: string, address: string) => void;
  updateBillTo: (name: string, address: string) => void;
  updateShippingAddress: (address: string) => void;
  updateInvoiceNumber: (number: string) => void;
  incrementInvoiceNumber: () => void;
  updateInvoiceDate: (date: Date) => void;
  updateNotes: (notes: string) => void;
  updateCurrency: (currency: string) => void;
  updateLineItem: (itemId: string, updates: Partial<LineItem>) => void;
  addLineItem: () => void;
  removeLineItem: (itemId: string) => void;
  updateVATType: (type: VATType) => void;
  updateVATValue: (value: number) => void;
  toggleVAT: () => void;
  updateDiscountType: (type: DiscountType) => void;
  updateDiscountValue: (value: number) => void;
  toggleDiscount: () => void;
  updateShippingFee: (value: number) => void;
  toggleShipping: () => void;
  recalculateTotals: () => void;
  resetToSample: () => void;
}

const calculateItemTotal = (item: LineItem): number => {
  return item.quantity * item.unitPrice;
};

const calculateInvoiceTotals = (
  lineItems: LineItem[],
  vatType: VATType,
  vatValue: number,
  showVAT: boolean,
  discountType: DiscountType,
  discountValue: number,
  showDiscount: boolean,
  shippingFee: number,
  showShipping: boolean
) => {
  const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  // Calculate VAT
  let totalVat: number = 0;
  if (showVAT) {
    if (vatType === 'percentage') {
      totalVat = subtotal * (vatValue / 100);
    } else {
      totalVat = vatValue;
    }
  }

  // Calculate discount (applies to subtotal + VAT, not shipping)
  const subtotalAfterVAT = subtotal + totalVat;
  let totalDiscount: number = 0;
  if (showDiscount) {
    if (discountType === 'percentage') {
      totalDiscount = subtotalAfterVAT * (discountValue / 100);
    } else {
      totalDiscount = discountValue;
    }
  }

  // Calculate shipping
  const totalShipping = showShipping ? shippingFee : 0;

  // Grand total = subtotal + VAT - discount + shipping
  const grandTotal = subtotal + totalVat - totalDiscount + totalShipping;

  return { subtotal, totalVat, totalDiscount, grandTotal };
};

export const usePreviewStore = create<PreviewInvoiceState>()(
  persist(
    (set) => ({
      previewInvoice: { ...SAMPLE_INVOICE },

      updateBillFrom: (name, address) =>
        set((state) => ({
          previewInvoice: {
            ...state.previewInvoice,
            billFrom: { name, address },
          },
        })),

      updateBillTo: (name, address) =>
        set((state) => ({
          previewInvoice: {
            ...state.previewInvoice,
            billTo: { name, address },
          },
        })),

      updateShippingAddress: (address) =>
        set((state) => ({
          previewInvoice: {
            ...state.previewInvoice,
            shippingAddress: address,
          },
        })),

      updateInvoiceNumber: (number) =>
        set((state) => ({
          previewInvoice: {
            ...state.previewInvoice,
            invoiceNumber: number,
          },
        })),

      incrementInvoiceNumber: () =>
        set((state) => {
          const currentNumber = state.previewInvoice.invoiceNumber;

          // Try to find the last sequence of digits in the invoice number
          const match = currentNumber.match(/^(.*?)(\d+)([^\d]*)$/);

          if (match) {
            // Found digits - increment them
            const prefix = match[1]; // Everything before the number
            const number = match[2]; // The number part
            const suffix = match[3]; // Everything after the number
            const incrementedNumber = (parseInt(number, 10) + 1).toString().padStart(number.length, '0');
            const newInvoiceNumber = `${prefix}${incrementedNumber}${suffix}`;

            return {
              previewInvoice: {
                ...state.previewInvoice,
                invoiceNumber: newInvoiceNumber,
              },
            };
          } else {
            // No digits found - append "-001"
            return {
              previewInvoice: {
                ...state.previewInvoice,
                invoiceNumber: `${currentNumber}-001`,
              },
            };
          }
        }),

      updateInvoiceDate: (date) =>
        set((state) => ({
          previewInvoice: {
            ...state.previewInvoice,
            date,
          },
        })),

      updateNotes: (notes) =>
        set((state) => ({
          previewInvoice: {
            ...state.previewInvoice,
            notes,
          },
        })),

      updateCurrency: (currency) =>
        set((state) => ({
          previewInvoice: {
            ...state.previewInvoice,
            currency,
          },
        })),

      updateLineItem: (itemId, updates) =>
        set((state) => {
          const updatedItems = state.previewInvoice.lineItems.map((item) => {
            if (item.id === itemId) {
              const updatedItem = { ...item, ...updates };
              updatedItem.total = calculateItemTotal(updatedItem);
              return updatedItem;
            }
            return item;
          });

          const totals = calculateInvoiceTotals(
            updatedItems,
            state.previewInvoice.vatType,
            state.previewInvoice.vatValue,
            state.previewInvoice.showVAT,
            state.previewInvoice.discountType,
            state.previewInvoice.discountValue,
            state.previewInvoice.showDiscount,
            state.previewInvoice.shippingFee,
            state.previewInvoice.showShipping
          );

          return {
            previewInvoice: {
              ...state.previewInvoice,
              lineItems: updatedItems,
              ...totals,
            },
          };
        }),

      addLineItem: () =>
        set((state) => {
          const newItem: LineItem = {
            id: uuidv4(),
            description: 'New Item',
            quantity: 1,
            unitPrice: 0,
            total: 0,
          };

          const updatedItems = [...state.previewInvoice.lineItems, newItem];
          const totals = calculateInvoiceTotals(
            updatedItems,
            state.previewInvoice.vatType,
            state.previewInvoice.vatValue,
            state.previewInvoice.showVAT,
            state.previewInvoice.discountType,
            state.previewInvoice.discountValue,
            state.previewInvoice.showDiscount,
            state.previewInvoice.shippingFee,
            state.previewInvoice.showShipping
          );

          return {
            previewInvoice: {
              ...state.previewInvoice,
              lineItems: updatedItems,
              ...totals,
            },
          };
        }),

      removeLineItem: (itemId) =>
        set((state) => {
          const updatedItems = state.previewInvoice.lineItems.filter(
            (item) => item.id !== itemId
          );

          const totals = calculateInvoiceTotals(
            updatedItems,
            state.previewInvoice.vatType,
            state.previewInvoice.vatValue,
            state.previewInvoice.showVAT,
            state.previewInvoice.discountType,
            state.previewInvoice.discountValue,
            state.previewInvoice.showDiscount,
            state.previewInvoice.shippingFee,
            state.previewInvoice.showShipping
          );

          return {
            previewInvoice: {
              ...state.previewInvoice,
              lineItems: updatedItems,
              ...totals,
            },
          };
        }),

      updateVATType: (type) =>
        set((state) => {
          const totals = calculateInvoiceTotals(
            state.previewInvoice.lineItems,
            type,
            state.previewInvoice.vatValue,
            state.previewInvoice.showVAT,
            state.previewInvoice.discountType,
            state.previewInvoice.discountValue,
            state.previewInvoice.showDiscount,
            state.previewInvoice.shippingFee,
            state.previewInvoice.showShipping
          );

          return {
            previewInvoice: {
              ...state.previewInvoice,
              vatType: type,
              ...totals,
            },
          };
        }),

      updateVATValue: (value) =>
        set((state) => {
          const totals = calculateInvoiceTotals(
            state.previewInvoice.lineItems,
            state.previewInvoice.vatType,
            value,
            state.previewInvoice.showVAT,
            state.previewInvoice.discountType,
            state.previewInvoice.discountValue,
            state.previewInvoice.showDiscount,
            state.previewInvoice.shippingFee,
            state.previewInvoice.showShipping
          );

          return {
            previewInvoice: {
              ...state.previewInvoice,
              vatValue: value,
              ...totals,
            },
          };
        }),

      toggleVAT: () =>
        set((state) => {
          const newShowVAT = !state.previewInvoice.showVAT;
          const totals = calculateInvoiceTotals(
            state.previewInvoice.lineItems,
            state.previewInvoice.vatType,
            state.previewInvoice.vatValue,
            newShowVAT,
            state.previewInvoice.discountType,
            state.previewInvoice.discountValue,
            state.previewInvoice.showDiscount,
            state.previewInvoice.shippingFee,
            state.previewInvoice.showShipping
          );

          return {
            previewInvoice: {
              ...state.previewInvoice,
              showVAT: newShowVAT,
              ...totals,
            },
          };
        }),

      updateDiscountType: (type) =>
        set((state) => {
          const totals = calculateInvoiceTotals(
            state.previewInvoice.lineItems,
            state.previewInvoice.vatType,
            state.previewInvoice.vatValue,
            state.previewInvoice.showVAT,
            type,
            state.previewInvoice.discountValue,
            state.previewInvoice.showDiscount,
            state.previewInvoice.shippingFee,
            state.previewInvoice.showShipping
          );

          return {
            previewInvoice: {
              ...state.previewInvoice,
              discountType: type,
              ...totals,
            },
          };
        }),

      updateDiscountValue: (value) =>
        set((state) => {
          const totals = calculateInvoiceTotals(
            state.previewInvoice.lineItems,
            state.previewInvoice.vatType,
            state.previewInvoice.vatValue,
            state.previewInvoice.showVAT,
            state.previewInvoice.discountType,
            value,
            state.previewInvoice.showDiscount,
            state.previewInvoice.shippingFee,
            state.previewInvoice.showShipping
          );

          return {
            previewInvoice: {
              ...state.previewInvoice,
              discountValue: value,
              ...totals,
            },
          };
        }),

      toggleDiscount: () =>
        set((state) => {
          const newShowDiscount = !state.previewInvoice.showDiscount;
          // Initialize discount value to 0 when enabling
          const discountValue = newShowDiscount ? (state.previewInvoice.discountValue || 0) : state.previewInvoice.discountValue;

          const totals = calculateInvoiceTotals(
            state.previewInvoice.lineItems,
            state.previewInvoice.vatType,
            state.previewInvoice.vatValue,
            state.previewInvoice.showVAT,
            state.previewInvoice.discountType,
            discountValue,
            newShowDiscount,
            state.previewInvoice.shippingFee,
            state.previewInvoice.showShipping
          );

          return {
            previewInvoice: {
              ...state.previewInvoice,
              showDiscount: newShowDiscount,
              discountValue,
              ...totals,
            },
          };
        }),

      updateShippingFee: (value) =>
        set((state) => {
          const totals = calculateInvoiceTotals(
            state.previewInvoice.lineItems,
            state.previewInvoice.vatType,
            state.previewInvoice.vatValue,
            state.previewInvoice.showVAT,
            state.previewInvoice.discountType,
            state.previewInvoice.discountValue,
            state.previewInvoice.showDiscount,
            value,
            state.previewInvoice.showShipping
          );

          return {
            previewInvoice: {
              ...state.previewInvoice,
              shippingFee: value,
              ...totals,
            },
          };
        }),

      toggleShipping: () =>
        set((state) => {
          const newShowShipping = !state.previewInvoice.showShipping;
          // Initialize shipping fee to 0 when enabling
          const shippingFee = newShowShipping ? (state.previewInvoice.shippingFee || 0) : state.previewInvoice.shippingFee;

          const totals = calculateInvoiceTotals(
            state.previewInvoice.lineItems,
            state.previewInvoice.vatType,
            state.previewInvoice.vatValue,
            state.previewInvoice.showVAT,
            state.previewInvoice.discountType,
            state.previewInvoice.discountValue,
            state.previewInvoice.showDiscount,
            shippingFee,
            newShowShipping
          );

          return {
            previewInvoice: {
              ...state.previewInvoice,
              showShipping: newShowShipping,
              shippingFee,
              ...totals,
            },
          };
        }),

      recalculateTotals: () =>
        set((state) => {
          const totals = calculateInvoiceTotals(
            state.previewInvoice.lineItems,
            state.previewInvoice.vatType,
            state.previewInvoice.vatValue,
            state.previewInvoice.showVAT,
            state.previewInvoice.discountType,
            state.previewInvoice.discountValue,
            state.previewInvoice.showDiscount,
            state.previewInvoice.shippingFee,
            state.previewInvoice.showShipping
          );
          return {
            previewInvoice: {
              ...state.previewInvoice,
              ...totals,
            },
          };
        }),

      resetToSample: () =>
        set({
          previewInvoice: { ...SAMPLE_INVOICE },
        }),
    }),
    {
      name: 'preview-invoice-storage',
    }
  )
);
