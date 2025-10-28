import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSkeleton, Button, Badge, EmptyState, ConfirmDialog } from '../components';
import { useClientStore } from '../store/clientStore';
import { useToast } from '../contexts/ToastContext';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { fadeInUp, staggerChildren } from '../utils/animations';
import type { Client } from '../types/client';

// Lazy load ClientModal - only needed when user adds/edits client
const ClientModal = lazy(() => import('../components/ClientModal'));

// Debounce hook for search
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const ClientsPage = () => {
  const { clients, isLoading, deleteClient } = useClientStore();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showClientModal, setShowClientModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>();
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [hoveredClient, setHoveredClient] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Debounce search query for smooth animations
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Memoized filtered clients with debounced search
  const filteredClients = useMemo(() => {
    if (!debouncedSearchQuery) return clients;
    
    const query = debouncedSearchQuery.toLowerCase();
    return clients.filter(
      client =>
        client.name.toLowerCase().includes(query) ||
        client.email?.toLowerCase().includes(query) ||
        client.phone?.toLowerCase().includes(query)
    );
  }, [clients, debouncedSearchQuery]);

  // Handle search input with animation trigger
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsSearching(true);
    
    // Reset searching state after animation
    setTimeout(() => setIsSearching(false), 300);
  }, []);

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
    <motion.div 
      className="max-w-7xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={prefersReducedMotion ? undefined : staggerChildren}
    >
      {/* Header */}
      <motion.div 
        className="flex justify-between items-center mb-6"
        variants={prefersReducedMotion ? undefined : fadeInUp}
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-sage-500 to-gold-500 bg-clip-text text-transparent">
            Clients
          </h1>
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
      </motion.div>

      {/* Search */}
      <motion.div 
        className="mb-6"
        variants={prefersReducedMotion ? undefined : fadeInUp}
      >
        <div className="relative">
          <motion.input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-3 pl-10 bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 dark:focus:ring-sage-400 focus:border-transparent transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 shadow-[0_0_20px_rgba(107,142,35,0.1)]"
            whileFocus={{ 
              scale: 1.01,
              boxShadow: '0 0 30px rgba(107, 142, 35, 0.3)'
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
          <motion.svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage-500 dark:text-sage-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={isSearching ? { rotate: [0, 10, -10, 0] } : {}}
            transition={{ duration: 0.3 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </motion.svg>
          
          {/* Search indicator */}
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => {
                  setSearchQuery('');
                  setIsSearching(false);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-sage-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        
        {/* Results count with animation */}
        <AnimatePresence>
          {searchQuery && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-gray-500 dark:text-gray-400 mt-2"
            >
              Found {filteredClients.length} {filteredClients.length === 1 ? 'client' : 'clients'}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Client List */}
      <AnimatePresence mode="wait">
        {filteredClients.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <EmptyState
              icon={
                <svg
                  className="h-12 w-12 text-sage-400 dark:text-sage-600"
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
          </motion.div>
        ) : (
          <motion.div 
            key="grid"
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            variants={prefersReducedMotion ? undefined : staggerChildren}
            initial="hidden"
            animate="visible"
          >
            {filteredClients.map((client, index) => {
              const isHovered = hoveredClient === client.id;
              
              return (
                <motion.div
                  key={client.id}
                  variants={prefersReducedMotion ? undefined : fadeInUp}
                  custom={index}
                  layout
                  onHoverStart={() => setHoveredClient(client.id)}
                  onHoverEnd={() => setHoveredClient(null)}
                >
                  <motion.div
                    className="bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-lg p-6 transition-all relative overflow-hidden shadow-[0_4px_20px_rgba(107,142,35,0.1)]"
                    whileHover={prefersReducedMotion ? undefined : { 
                      y: -8, 
                      boxShadow: '0 12px 40px rgba(107, 142, 35, 0.3)',
                      borderColor: 'rgba(107, 142, 35, 0.4)'
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    {/* Ambient glow on hover */}
                    <AnimatePresence>
                      {isHovered && !prefersReducedMotion && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-gradient-to-br from-sage-500/10 via-transparent to-gold-500/10 pointer-events-none"
                        />
                      )}
                    </AnimatePresence>

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <motion.h3 
                            className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                            animate={isHovered ? { x: 4 } : { x: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          >
                            {client.name}
                          </motion.h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Last used: {formatLastUsed(client.lastUsed)}
                          </p>
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="shadow-[0_0_15px_rgba(107,142,35,0.3)]"
                        >
                          <Badge variant="primary" size="sm">
                            {client.usageCount} {client.usageCount === 1 ? 'invoice' : 'invoices'}
                          </Badge>
                        </motion.div>
                      </div>

                      {/* Expanded preview on hover */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ 
                              opacity: 1, 
                              height: 'auto',
                              marginBottom: 12,
                              transition: {
                                height: { type: 'spring', stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2, delay: 0.1 }
                              }
                            }}
                            exit={{ 
                              opacity: 0, 
                              height: 0,
                              marginBottom: 0,
                              transition: {
                                height: { type: 'spring', stiffness: 300, damping: 30 },
                                opacity: { duration: 0.15 }
                              }
                            }}
                            className="space-y-2 overflow-hidden"
                          >
                            {client.email && (
                              <motion.p 
                                className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2"
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                              >
                                <svg className="w-4 h-4 text-sage-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                  />
                                </svg>
                                <span className="truncate">{client.email}</span>
                              </motion.p>
                            )}

                            {client.phone && (
                              <motion.p 
                                className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2"
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.15 }}
                              >
                                <svg className="w-4 h-4 text-sage-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                  />
                                </svg>
                                <span className="truncate">{client.phone}</span>
                              </motion.p>
                            )}

                            {client.address && (
                              <motion.p 
                                className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2"
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                              >
                                <svg className="w-4 h-4 text-sage-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                <span className="truncate">{client.address}</span>
                              </motion.p>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Quick Actions - visible on hover */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, height: 0 }}
                            animate={{ 
                              opacity: 1, 
                              y: 0,
                              height: 'auto',
                              transition: {
                                height: { type: 'spring', stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2, delay: 0.15 },
                                y: { type: 'spring', stiffness: 300, damping: 30, delay: 0.15 }
                              }
                            }}
                            exit={{ 
                              opacity: 0, 
                              y: 10,
                              height: 0,
                              transition: {
                                height: { type: 'spring', stiffness: 300, damping: 30 },
                                opacity: { duration: 0.15 },
                                y: { duration: 0.15 }
                              }
                            }}
                            className="flex gap-2 pt-3 border-t border-white/20 overflow-hidden"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedClient(client);
                                setShowClientModal(true);
                              }}
                              className="flex-1"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setClientToDelete(client)}
                              className="text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-950 hover:border-error-400"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Client Modal */}
      <Suspense fallback={null}>
        <ClientModal
          isOpen={showClientModal}
          onClose={() => {
            setShowClientModal(false);
            setSelectedClient(undefined);
          }}
          client={selectedClient}
          mode={selectedClient ? 'edit' : 'add'}
        />
      </Suspense>

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
    </motion.div>
  );
};

export default ClientsPage;
