import { create } from 'zustand';
import { Invoice, CSVRow } from '../types';

interface InvoiceState {
  rawCSVData: CSVRow[];
  groupedInvoices: Invoice[];
  selectedInvoiceId: string | null;
  isProcessing: boolean;
  errors: string[];

  // Actions
  setRawCSVData: (data: CSVRow[]) => void;
  setGroupedInvoices: (invoices: Invoice[]) => void;
  selectInvoice: (id: string | null) => void;
  clearInvoices: () => void;
  setProcessing: (isProcessing: boolean) => void;
  addError: (error: string) => void;
  clearErrors: () => void;
}

export const useInvoiceStore = create<InvoiceState>((set) => ({
  rawCSVData: [],
  groupedInvoices: [],
  selectedInvoiceId: null,
  isProcessing: false,
  errors: [],

  setRawCSVData: (data) => set({ rawCSVData: data, errors: [] }),

  setGroupedInvoices: (invoices) => set({ groupedInvoices: invoices }),

  selectInvoice: (id) => set({ selectedInvoiceId: id }),

  clearInvoices: () =>
    set({
      rawCSVData: [],
      groupedInvoices: [],
      selectedInvoiceId: null,
      errors: [],
    }),

  setProcessing: (isProcessing) => set({ isProcessing }),

  addError: (error) => set((state) => ({ errors: [...state.errors, error] })),

  clearErrors: () => set({ errors: [] }),
}));
