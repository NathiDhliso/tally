import { useState } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { Button, Modal, Spinner } from './index';
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
      size="xl"
      footer={
        <>
          <Button variant="outline" size="lg" onClick={onClose}>
            Edit Invoice
          </Button>
          <PDFDownloadLink
            document={<InvoicePDF invoice={invoice} business={business} />}
            fileName={fileName}
          >
            {({ loading }) => (
              <Button variant="secondary" size="lg" disabled={loading}>
                {loading ? 'Preparing...' : 'Download PDF'}
              </Button>
            )}
          </PDFDownloadLink>
          {onApprove && (
            <Button variant="primary" size="lg" onClick={onApprove}>
              Approve & Send
            </Button>
          )}
        </>
      }
    >
      <div className="h-[600px] bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800 z-10">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading preview...</p>
            </div>
          </div>
        )}
        <PDFViewer width="100%" height="100%" showToolbar={false} style={{ border: 'none' }}>
          <InvoicePDF invoice={invoice} business={business} />
        </PDFViewer>
      </div>
    </Modal>
  );
};

export default PDFPreviewModal;
