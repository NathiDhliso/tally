/**
 * Development Data Seeder
 * 
 * This file provides sample data for development purposes only.
 * It will NOT be included in production builds.
 * 
 * Usage: Automatically called in main.tsx when in DEV mode
 */

import { useInvoiceStore } from '../store/invoiceStore';
import { useClientStore } from '../store/clientStore';
import { useSettingsStore } from '../store/settingsStore';

export const seedStores = () => {
  const { invoices, addInvoice } = useInvoiceStore.getState();
  const { clients, addClient } = useClientStore.getState();
  const { businessData, updateBusinessData } = useSettingsStore.getState();

  // Only seed if stores are empty
  if (invoices.length === 0) {
    console.log('🌱 Seeding invoices with sample data...');
    
    // Sample invoices
    addInvoice({
      invoiceNumber: 'INV-2024-001',
      clientName: 'Acme Corporation',
      itemDescription: 'Web Development Services - Q4 2024',
      quantity: 1,
      unitPrice: 15000,
      totalAmount: 15000,
      date: '2024-10-15',
      status: 'paid',
    });

    addInvoice({
      invoiceNumber: 'INV-2024-002',
      clientName: 'TechStart Solutions',
      itemDescription: 'Mobile App Development',
      quantity: 1,
      unitPrice: 25000,
      totalAmount: 25000,
      date: '2024-10-20',
      status: 'sent',
    });

    addInvoice({
      invoiceNumber: 'INV-2024-003',
      clientName: 'Global Enterprises',
      itemDescription: 'Consulting Services - October',
      quantity: 20,
      unitPrice: 500,
      totalAmount: 10000,
      date: '2024-10-25',
      status: 'draft',
    });
  }

  if (clients.length === 0) {
    console.log('🌱 Seeding clients with sample data...');
    
    // Sample clients
    addClient({
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      phone: '+27 11 123 4567',
      address: '123 Business Park, Sandton, Johannesburg, 2196',
    });

    addClient({
      name: 'TechStart Solutions',
      email: 'hello@techstart.co.za',
      phone: '+27 21 456 7890',
      address: '456 Innovation Drive, Cape Town, 8001',
    });

    addClient({
      name: 'Global Enterprises',
      email: 'info@globalent.com',
      phone: '+27 31 789 0123',
      address: '789 Corporate Avenue, Durban, 4001',
    });
  }

  // Seed business data if empty
  if (!businessData.name) {
    console.log('🌱 Seeding business settings with sample data...');
    
    updateBusinessData({
      name: 'Your Business Name',
      email: 'business@example.com',
      phone: '+27 11 123 4567',
      address: '123 Business St, Johannesburg, 2000',
      vatNumber: '4123456789',
      bankName: 'Standard Bank',
      accountNumber: '123456789',
      branchCode: '051001',
      paymentTerms: 'Payment due within 30 days',
    });
  }

  console.log('✅ Development data seeding complete');
};

/**
 * Clear all development data
 * Useful for testing empty states
 */
export const clearDevData = () => {
  const invoiceStore = useInvoiceStore.getState();
  const clientStore = useClientStore.getState();

  // Clear all invoices
  invoiceStore.invoices.forEach(invoice => {
    if (invoice.id) {
      invoiceStore.deleteInvoice(invoice.id);
    }
  });

  // Clear all clients
  clientStore.clients.forEach(client => {
    if (client.id) {
      clientStore.deleteClient(client.id);
    }
  });

  console.log('🧹 Development data cleared');
};

// Export for console access in dev mode
if (import.meta.env.DEV) {
  (window as any).devData = {
    seed: seedStores,
    clear: clearDevData,
  };
  console.log('💡 Dev tools available: window.devData.seed() and window.devData.clear()');
}
