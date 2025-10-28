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

// Sample data for demonstration
const sampleInvoices: Invoice[] = [
  {
    id: 'inv-sample-1',
    invoiceNumber: 'INV-2025-001',
    clientName: 'Acme Corporation',
    itemDescription: 'Web Development Services - Q1 2025',
    quantity: 1,
    unitPrice: 15000,
    totalAmount: 15000,
    date: '2025-01-15',
    status: 'paid',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-20T14:30:00Z',
    synced: true,
  },
  {
    id: 'inv-sample-2',
    invoiceNumber: 'INV-2025-002',
    clientName: 'TechStart Solutions',
    itemDescription: 'Mobile App Design & Development',
    quantity: 1,
    unitPrice: 25000,
    totalAmount: 25000,
    date: '2025-02-01',
    status: 'sent',
    createdAt: '2025-02-01T09:00:00Z',
    updatedAt: '2025-02-01T09:00:00Z',
    synced: true,
  },
  {
    id: 'inv-sample-3',
    invoiceNumber: 'INV-2025-003',
    clientName: 'Green Energy Co',
    itemDescription: 'Consulting Services - February',
    quantity: 20,
    unitPrice: 500,
    totalAmount: 10000,
    date: '2025-02-15',
    status: 'draft',
    createdAt: '2025-02-15T11:00:00Z',
    updatedAt: '2025-02-15T11:00:00Z',
    synced: false,
  },
];

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  invoices: sampleInvoices,
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
