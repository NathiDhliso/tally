export interface ExtractedInvoiceData {
  clientName: string;
  itemDescription: string;
  quantity: number;
  unitPrice: number;
  date: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
}

export interface ConfidenceScores {
  clientName: number;
  itemDescription: number;
  quantity: number;
  unitPrice: number;
  date: number;
  clientEmail?: number;
  clientPhone?: number;
  clientAddress?: number;
}

export interface InvoiceFormData extends ExtractedInvoiceData {
  totalAmount: number;
}
