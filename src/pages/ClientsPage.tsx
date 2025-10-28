import { useState } from 'react';
import { LoadingSkeleton, Button, Badge, Card, EmptyState, ConfirmDialog } from '../components';
import ClientModal from '../components/ClientModal';
import { useClientStore } from '../store/clientStore';
import { useToast } from '../contexts/ToastContext';
import type { Client } from '../types/client';

const ClientsPage = () => {
  const { clients, isLoading, deleteClient } = useClientStore();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showClientModal, setShowClientModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>();
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const filteredClients = searchQuery
    ? clients.filter(
        client =>
          client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.phone?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : clients;

  const formatLastUsed = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton variant="rectangular" height="80px" />
        <LoadingSkeleton variant="rectangular" height="80px" />
        <LoadingSkeleton variant="rectangular" height="80px" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Clients</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your client list</p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => {
            setSelectedClient(undefined);
            setShowClientModal(true);
          }}
        >
          Add Client
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Client List */}
      {filteredClients.length === 0 ? (
        <EmptyState
          icon={
            <svg
              className="h-12 w-12 text-gray-400 dark:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          }
          title={searchQuery ? 'No clients found' : 'No clients'}
          description={
            searchQuery
              ? 'Try adjusting your search'
              : 'Get started by adding a new client.'
          }
          actionLabel={!searchQuery ? 'Add Client' : undefined}
          onAction={
            !searchQuery
              ? () => {
                  setSelectedClient(undefined);
                  setShowClientModal(true);
                }
              : undefined
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map(client => (
            <Card key={client.id}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {client.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Last used: {formatLastUsed(client.lastUsed)}
                  </p>
                </div>
                <Badge variant="primary" size="sm">
                  {client.usageCount} {client.usageCount === 1 ? 'invoice' : 'invoices'}
                </Badge>
              </div>

              {client.email && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {client.email}
                </p>
              )}

              {client.phone && (
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {client.phone}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedClient(client);
                    setShowClientModal(true);
                  }}
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setClientToDelete(client)}
                  className="text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-950"
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Client Modal */}
      <ClientModal
        isOpen={showClientModal}
        onClose={() => {
          setShowClientModal(false);
          setSelectedClient(undefined);
        }}
        client={selectedClient}
        mode={selectedClient ? 'edit' : 'add'}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!clientToDelete}
        onClose={() => setClientToDelete(null)}
        onConfirm={() => {
          if (clientToDelete) {
            deleteClient(clientToDelete.id);
            toast.success('Client deleted successfully');
            setClientToDelete(null);
          }
        }}
        title="Delete Client?"
        message={`Are you sure you want to delete ${clientToDelete?.name}? This action cannot be undone.`}
        variant="danger"
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
};

export default ClientsPage;
