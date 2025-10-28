import { useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSkeleton, Button, Badge, EmptyState } from '../components';
import { useInvoiceStore } from '../store/invoiceStore';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { fadeInUp, staggerChildren } from '../utils/animations';
import type { Invoice } from '../store/invoiceStore';

// Lazy load ShareModal - only needed when user clicks share
const ShareModal = lazy(() => import('../components/ShareModal'));

const InvoicesPage = () => {
  const { invoices, isLoading } = useInvoiceStore();
  const [filter, setFilter] = useState<'all' | 'draft' | 'sent' | 'paid'>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const prefersReducedMotion = useReducedMotion();

  const filteredInvoices = invoices.filter(inv => {
    const matchesFilter = filter === 'all' || inv.status === filter;
    const matchesSearch = searchQuery === '' || 
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  const getStatusVariant = (status: string): 'success' | 'info' | 'neutral' => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'sent':
        return 'info';
      default:
        return 'neutral';
    }
  };

  const getStatusGlow = (status: string) => {
    switch (status) {
      case 'paid':
        return 'shadow-[0_0_20px_rgba(210,105,30,0.5)] hover:shadow-[0_0_30px_rgba(210,105,30,0.7)]'; // Terracotta glow
      case 'sent':
        return 'shadow-[0_0_20px_rgba(107,142,35,0.5)] hover:shadow-[0_0_30px_rgba(107,142,35,0.7)]'; // Sage glow
      default:
        return 'hover:shadow-[0_0_15px_rgba(107,142,35,0.3)]';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton variant="rectangular" height="100px" />
        <LoadingSkeleton variant="rectangular" height="100px" />
        <LoadingSkeleton variant="rectangular" height="100px" />
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
            Invoices
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your invoices</p>
        </div>
        <Link to="/">
          <Button variant="primary" size="lg">
            Create Invoice
          </Button>
        </Link>
      </motion.div>

      {/* Search */}
      <motion.div 
        className="mb-6"
        variants={prefersReducedMotion ? undefined : fadeInUp}
      >
        <div className="relative">
          <motion.input
            type="text"
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 dark:focus:ring-sage-400 focus:border-transparent focus:shadow-[0_0_20px_rgba(107,142,35,0.3)] transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400"
            whileFocus={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
          <motion.svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage-500 dark:text-sage-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={searchQuery ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </motion.svg>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div 
        className="mb-6 flex gap-2 overflow-x-auto pb-2"
        variants={prefersReducedMotion ? undefined : fadeInUp}
      >
        {(['all', 'draft', 'sent', 'paid'] as const).map((status) => (
          <motion.button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              filter === status
                ? 'bg-sage-500 dark:bg-sage-600 text-white shadow-[0_0_20px_rgba(107,142,35,0.4)]'
                : 'bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 text-gray-700 dark:text-gray-300 hover:bg-white/15 dark:hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      {/* Invoice List */}
      <AnimatePresence mode="wait">
        {filteredInvoices.length === 0 ? (
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              }
              title={searchQuery ? 'No invoices found' : filter === 'all' ? 'No invoices' : `No ${filter} invoices`}
              description={
                searchQuery 
                  ? 'Try adjusting your search'
                  : filter === 'all'
                  ? 'Get started by creating a new invoice.'
                  : `You don't have any ${filter} invoices yet.`
              }
              actionLabel={filter === 'all' && !searchQuery ? 'Create Invoice' : undefined}
              onAction={filter === 'all' && !searchQuery ? () => window.location.href = '/' : undefined}
            />
          </motion.div>
        ) : (
          <motion.div 
            key={`list-${filter}-${searchQuery}`}
            className="space-y-4"
            variants={prefersReducedMotion ? undefined : staggerChildren}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {filteredInvoices.map((invoice, index) => (
              <motion.div
                key={invoice.id}
                variants={prefersReducedMotion ? undefined : fadeInUp}
                custom={index}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 30,
                  delay: index * 0.05 
                }}
              >
                <motion.div
                  className="bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-lg p-6 transition-all hover:border-sage-500/30 dark:hover:border-sage-400/30"
                  whileHover={prefersReducedMotion ? undefined : { 
                    y: -8, 
                    boxShadow: '0 12px 40px rgba(107, 142, 35, 0.25)',
                    scale: 1.01
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {invoice.invoiceNumber}
                        </h3>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          className={`transition-all ${getStatusGlow(invoice.status)}`}
                        >
                          <Badge variant={getStatusVariant(invoice.status)}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </Badge>
                        </motion.div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {invoice.clientName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{invoice.date}</p>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <p className="text-xl font-bold bg-gradient-to-r from-sage-500 to-gold-500 bg-clip-text text-transparent">
                          {formatCurrency(invoice.totalAmount)}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedInvoice(invoice)}
                      >
                        Share
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      {selectedInvoice && (
        <Suspense fallback={null}>
          <ShareModal
            isOpen={!!selectedInvoice}
            onClose={() => setSelectedInvoice(null)}
            invoice={{
              invoiceNumber: selectedInvoice.invoiceNumber,
              clientName: selectedInvoice.clientName,
              totalAmount: selectedInvoice.totalAmount,
            }}
          />
        </Suspense>
      )}
    </motion.div>
  );
};

export default InvoicesPage;
