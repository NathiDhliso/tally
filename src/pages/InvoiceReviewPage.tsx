import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { InvoiceForm } from '../components';
import PDFPreviewModal from '../components/PDFPreviewModal';
import { useInvoiceStore } from '../store/invoiceStore';
import { useToast } from '../contexts/ToastContext';
import type { ExtractedInvoiceData, ConfidenceScores } from '../types/invoice';

const InvoiceReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { addInvoice } = useInvoiceStore();

  // Get data from navigation state (passed from voice recorder)
  const extractedData: ExtractedInvoiceData = location.state?.extractedData || {
    clientName: '',
    itemDescription: '',
    quantity: 1,
    unitPrice: 0,
    date: new Date().toISOString().split('T')[0],
  };

  const confidence: ConfidenceScores = location.state?.confidence || {
    clientName: 100,
    itemDescription: 100,
    quantity: 100,
    unitPrice: 100,
    date: 100,
  };

  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);

  // Mock business data (should come from settings/store)
  const businessData = {
    name: 'Your Business Name',
    email: 'business@example.com',
    phone: '+27 11 123 4567',
    address: '123 Business St, Johannesburg, 2000',
    vatNumber: '4123456789',
    bankName: 'Standard Bank',
    accountNumber: '123456789',
    branchCode: '051001',
    paymentTerms: 'Payment due within 30 days',
  };

  const handleSubmit = (formData: any) => {
    // Generate invoice number
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

    const invoice = {
      ...formData,
      invoiceNumber,
    };

    setInvoiceData(invoice);
    setShowPDFPreview(true);
  };

  const handleApprove = () => {
    if (invoiceData) {
      // Add to store
      addInvoice({
        invoiceNumber: invoiceData.invoiceNumber,
        clientName: invoiceData.clientName,
        itemDescription: invoiceData.itemDescription,
        quantity: invoiceData.quantity,
        unitPrice: invoiceData.unitPrice,
        totalAmount: invoiceData.totalAmount,
        date: invoiceData.date,
        status: 'draft',
      });

      toast.success('Invoice created successfully!');
      setShowPDFPreview(false);
      navigate('/invoices');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <InvoiceForm
        extractedData={extractedData}
        confidence={confidence}
        onSubmit={handleSubmit}
      />

      {invoiceData && (
        <PDFPreviewModal
          isOpen={showPDFPreview}
          onClose={() => setShowPDFPreview(false)}
          invoice={invoiceData}
          business={businessData}
          onApprove={handleApprove}
        />
      )}
    </div>
  );
};

export default InvoiceReviewPage;
