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

export const useClientStore = create<ClientStore>((set, get) => ({
  clients: [],
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
