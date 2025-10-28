import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LoadingSkeleton, Button, Badge, Card, EmptyState } from '../components';
import ShareModal from '../components/ShareModal';
import { useInvoiceStore } from '../store/invoiceStore';
import type { Invoice } from '../store/invoiceStore';

const InvoicesPage = () => {
  const { invoices, isLoading } = useInvoiceStore();
  const [filter, setFilter] = useState<'all' | 'draft' | 'sent' | 'paid'>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = filter === 'all' 
    ? invoices 
    : invoices.filter(inv => inv.status === filter);

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
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Invoices</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your invoices</p>
        </div>
        <Link to="/">
          <Button variant="primary" size="lg">
            Create Invoice
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {(['all', 'draft', 'sent', 'paid'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filter === status
                ? 'bg-primary-500 dark:bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Invoice List */}
      {filteredInvoices.length === 0 ? (
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
          title={filter === 'all' ? 'No invoices' : `No ${filter} invoices`}
          description={
            filter === 'all'
              ? 'Get started by creating a new invoice.'
              : `You don't have any ${filter} invoices yet.`
          }
          actionLabel={filter === 'all' ? 'Create Invoice' : undefined}
          onAction={filter === 'all' ? () => window.location.href = '/' : undefined}
        />
      ) : (
        <div className="space-y-4">
          {filteredInvoices.map(invoice => (
            <Card key={invoice.id}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {invoice.invoiceNumber}
                    </h3>
                    <Badge variant={getStatusVariant(invoice.status)}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {invoice.clientName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{invoice.date}</p>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div>
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
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
            </Card>
          ))}
        </div>
      )}

      {/* Share Modal */}
      {selectedInvoice && (
        <ShareModal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          invoice={{
            invoiceNumber: selectedInvoice.invoiceNumber,
            clientName: selectedInvoice.clientName,
            totalAmount: selectedInvoice.totalAmount,
          }}
        />
      )}
    </div>
  );
};

export default InvoicesPage;
