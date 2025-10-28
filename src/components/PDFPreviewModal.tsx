import { useState } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { Button, Modal, AloeSpinner } from './index';
import InvoicePDF from './InvoicePDF';

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: {
    invoiceNumber: string;
    date: string;
    clientName: string;
    clientEmail?: string;
    clientPhone?: string;
    clientAddress?: string;
    itemDescription: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
  };
  business: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    vatNumber?: string;
    bankName?: string;
    accountNumber?: string;
    branchCode?: string;
    paymentTerms?: string;
  };
  onApprove?: () => void;
}

const PDFPreviewModal = ({
  isOpen,
  onClose,
  invoice,
  business,
  onApprove,
}: PDFPreviewModalProps) => {
  const [isLoading] = useState(false);

  const fileName = `Invoice_${invoice.invoiceNumber}_${invoice.clientName.replace(/\s+/g, '_')}_${invoice.date}.pdf`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invoice Preview"
      size="full"
      footer={
        <>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={onClose}
            className="border-sage-500/30 text-sage-300 hover:bg-sage-500/10 hover:border-sage-500/50"
          >
            Edit Invoice
          </Button>
          <PDFDownloadLink
            document={<InvoicePDF invoice={invoice} business={business} />}
            fileName={fileName}
          >
            {({ loading }) => (
              <Button 
                variant="secondary" 
                size="lg" 
                disabled={loading}
                className="bg-sage-500/20 hover:bg-sage-500/30 text-sage-300 border-sage-500/30 hover:shadow-lg hover:shadow-sage-500/20"
              >
                {loading ? 'Preparing...' : 'Download PDF'}
              </Button>
            )}
          </PDFDownloadLink>
          {onApprove && (
            <Button 
              variant="primary" 
              size="lg" 
              onClick={onApprove}
              className="bg-gradient-to-r from-sage-500 to-gold-500 hover:from-sage-600 hover:to-gold-600 text-white shadow-lg shadow-sage-500/30 hover:shadow-xl hover:shadow-sage-500/40"
            >
              Approve & Send
            </Button>
          )}
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoice Details Summary - Desktop Only */}
        <div className="hidden lg:block space-y-4">
          <div className="bg-white/5 backdrop-blur-md border border-sage-500/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-sage-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Invoice Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Invoice Number:</span>
                <span className="text-white font-medium">{invoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Date:</span>
                <span className="text-white font-medium">{invoice.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Client:</span>
                <span className="text-white font-medium">{invoice.clientName}</span>
              </div>
              {invoice.clientEmail && (
                <div className="flex justify-between">
                  <span className="text-white/60">Email:</span>
                  <span className="text-white font-medium">{invoice.clientEmail}</span>
                </div>
              )}
              {invoice.clientPhone && (
                <div className="flex justify-between">
                  <span className="text-white/60">Phone:</span>
                  <span className="text-white font-medium">{invoice.clientPhone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-sage-500/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Line Items
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-white/60 mb-1">Description:</div>
                <div className="text-white font-medium">{invoice.itemDescription}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-white/60 mb-1">Quantity:</div>
                  <div className="text-white font-medium">{invoice.quantity}</div>
                </div>
                <div>
                  <div className="text-white/60 mb-1">Unit Price:</div>
                  <div className="text-white font-medium">R {invoice.unitPrice.toFixed(2)}</div>
                </div>
              </div>
              <div className="pt-3 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-white">Total Amount:</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-sage-400 to-gold-400 bg-clip-text text-transparent">
                    R {invoice.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PDF Preview */}
        <div className="h-[600px] lg:h-[700px] bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800 z-10">
              <div className="text-center">
                <AloeSpinner size={64} />
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading preview...</p>
              </div>
            </div>
          )}
          <PDFViewer width="100%" height="100%" showToolbar={false} style={{ border: 'none' }}>
            <InvoicePDF invoice={invoice} business={business} />
          </PDFViewer>
        </div>
      </div>
    </Modal>
  );
};

export default PDFPreviewModal;
