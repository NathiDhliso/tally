import { create } from 'zustand';
import type { Client } from '../types/client';

interface ClientStore {
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'lastUsed' | 'usageCount'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
  incrementUsage: (id: string) => void;
  searchClients: (query: string) => Client[];
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Sample data for demonstration
const sampleClients: Client[] = [
  {
    id: 'client-sample-1',
    name: 'Acme Corporation',
    email: 'contact@acmecorp.co.za',
    phone: '+27 11 123 4567',
    address: '123 Business Park, Sandton, Johannesburg, 2196',
    createdAt: new Date('2024-12-01'),
    lastUsed: new Date('2025-01-15'),
    usageCount: 5,
  },
  {
    id: 'client-sample-2',
    name: 'TechStart Solutions',
    email: 'hello@techstart.co.za',
    phone: '+27 21 555 8888',
    address: '45 Innovation Drive, Cape Town, 8001',
    createdAt: new Date('2025-01-10'),
    lastUsed: new Date('2025-02-01'),
    usageCount: 2,
  },
  {
    id: 'client-sample-3',
    name: 'Green Energy Co',
    email: 'info@greenenergy.co.za',
    phone: '+27 31 777 9999',
    address: '78 Eco Street, Durban, 4001',
    createdAt: new Date('2025-02-05'),
    lastUsed: new Date('2025-02-15'),
    usageCount: 1,
  },
];

export const useClientStore = create<ClientStore>((set, get) => ({
  clients: sampleClients,
  isLoading: false,
  error: null,

  addClient: (client) => {
    const newClient: Client = {
      ...client,
      id: `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      lastUsed: new Date(),
      usageCount: 0,
    };
    
    set((state) => ({
      clients: [...state.clients, newClient],
    }));
  },

  updateClient: (id, updates) => {
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === id ? { ...client, ...updates } : client
      ),
    }));
  },

  deleteClient: (id) => {
    set((state) => ({
      clients: state.clients.filter((client) => client.id !== id),
    }));
  },

  getClientById: (id) => {
    return get().clients.find((client) => client.id === id);
  },

  incrementUsage: (id) => {
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === id
          ? { ...client, usageCount: client.usageCount + 1, lastUsed: new Date() }
          : client
      ),
    }));
  },

  searchClients: (query) => {
    const lowerQuery = query.toLowerCase();
    return get().clients.filter(
      (client) =>
        client.name.toLowerCase().includes(lowerQuery) ||
        client.email?.toLowerCase().includes(lowerQuery) ||
        client.phone?.toLowerCase().includes(lowerQuery)
    );
  },

  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
}));
