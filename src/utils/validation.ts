import { z } from 'zod';

export const InvoiceSchema = z.object({
  clientName: z
    .string()
    .min(1, 'Client name is required')
    .max(255, 'Client name must be less than 255 characters')
    .trim(),
  itemDescription: z
    .string()
    .min(1, 'Item description is required')
    .max(1000, 'Item description must be less than 1000 characters')
    .trim(),
  quantity: z
    .number()
    .positive('Quantity must be greater than 0')
    .max(1000000, 'Quantity cannot exceed 1,000,000'),
  unitPrice: z
    .number()
    .positive('Unit price must be greater than 0')
    .max(1000000, 'Unit price cannot exceed R1,000,000'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  clientEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  clientPhone: z.string().max(50, 'Phone number too long').optional().or(z.literal('')),
  clientAddress: z.string().max(500, 'Address too long').optional().or(z.literal('')),
  totalAmount: z.number().positive(),
});

export const ClientSchema = z.object({
  name: z
    .string()
    .min(1, 'Client name is required')
    .max(255, 'Client name must be less than 255 characters')
    .trim(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().max(50, 'Phone number too long').optional().or(z.literal('')),
  address: z.string().max(500, 'Address too long').optional().or(z.literal('')),
});

export const BusinessInfoSchema = z.object({
  businessName: z
    .string()
    .min(1, 'Business name is required')
    .max(255, 'Business name must be less than 255 characters')
    .trim(),
  contactEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  contactPhone: z.string().max(50, 'Phone number too long').optional().or(z.literal('')),
  physicalAddress: z.string().max(500, 'Address too long').optional().or(z.literal('')),
  vatNumber: z.string().max(50, 'VAT number too long').optional().or(z.literal('')),
  bankName: z.string().max(100, 'Bank name too long').optional().or(z.literal('')),
  accountNumber: z.string().max(50, 'Account number too long').optional().or(z.literal('')),
  branchCode: z.string().max(20, 'Branch code too long').optional().or(z.literal('')),
  paymentTerms: z.string().max(500, 'Payment terms too long').optional().or(z.literal('')),
  footerNotes: z.string().max(500, 'Footer notes too long').optional().or(z.literal('')),
});

export type InvoiceFormData = z.infer<typeof InvoiceSchema>;
export type ClientFormData = z.infer<typeof ClientSchema>;
export type BusinessInfoFormData = z.infer<typeof BusinessInfoSchema>;
