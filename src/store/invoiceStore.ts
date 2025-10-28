import { create } from 'zustand';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId?: string;
  clientName: string;
  itemDescription: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  date: string;
  status: 'draft' | 'sent' | 'paid';
  pdfUrl?: string;
  transcriptionText?: string;
  confidenceScores?: Record<string, number>;
  createdAt: string;
  updatedAt: string;
  synced: boolean;
}

interface InvoiceStore {
  invoices: Invoice[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'synced'>) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoiceById: (id: string) => Invoice | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  invoices: [],
  isLoading: false,
  error: null,

  addInvoice: (invoice) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      synced: false,
    };
    
    set((state) => ({
      invoices: [newInvoice, ...state.invoices],
    }));
  },

  updateInvoice: (id, updates) => {
    set((state) => ({
      invoices: state.invoices.map((invoice) =>
        invoice.id === id
          ? { ...invoice, ...updates, updatedAt: new Date().toISOString(), synced: false }
          : invoice
      ),
    }));
  },

  deleteInvoice: (id) => {
    set((state) => ({
      invoices: state.invoices.filter((invoice) => invoice.id !== id),
    }));
  },

  getInvoiceById: (id) => {
    return get().invoices.find((invoice) => invoice.id === id);
  },

  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
}));
