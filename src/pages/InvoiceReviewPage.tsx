import { useState, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { InvoiceForm } from '../components';
import { useInvoiceStore } from '../store/invoiceStore';
import { useToast } from '../contexts/ToastContext';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { fadeInUp, staggerChildren } from '../utils/animations';
import type { ExtractedInvoiceData, ConfidenceScores } from '../types/invoice';

// Lazy load heavy components - only needed when user interacts
const PDFPreviewModal = lazy(() => import('../components/PDFPreviewModal'));
const AloeBloom = lazy(() => import('../components/AloeBloom').then(m => ({ default: m.AloeBloom })));

const InvoiceReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { addInvoice } = useInvoiceStore();
  const prefersReducedMotion = useReducedMotion();

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
  const [showSuccessBloom, setShowSuccessBloom] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

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

  const steps = [
    { number: 1, label: 'Review Details', description: 'Verify extracted data' },
    { number: 2, label: 'Preview Invoice', description: 'Check final format' },
    { number: 3, label: 'Complete', description: 'Invoice created' },
  ];

  const handleSubmit = (formData: any) => {
    // Generate invoice number
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

    const invoice = {
      ...formData,
      invoiceNumber,
    };

    setInvoiceData(invoice);
    setCurrentStep(2);
    setShowPDFPreview(true);
  };

  const handleApprove = () => {
    if (invoiceData) {
      // Show success bloom animation
      setShowSuccessBloom(true);
      setCurrentStep(3);

      // Add to store after a brief delay
      setTimeout(() => {
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

        // Navigate after bloom completes
        setTimeout(() => {
          navigate('/invoices');
        }, 800);
      }, 400);
    }
  };

  return (
    <motion.div
      className="min-h-screen pb-20"
      initial="hidden"
      animate="visible"
      variants={prefersReducedMotion ? undefined : staggerChildren}
    >
      {/* Step Indicator */}
      <motion.div
        className="max-w-4xl mx-auto mb-8 px-4"
        variants={prefersReducedMotion ? undefined : fadeInUp}
      >
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-sage-500 to-gold-500"
              initial={{ width: '0%' }}
              animate={{
                width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>

          {/* Steps */}
          {steps.map((step, index) => (
            <div key={step.number} className="relative flex flex-col items-center z-10">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  currentStep >= step.number
                    ? 'bg-gradient-to-br from-sage-500 to-gold-500 text-white shadow-lg shadow-sage-500/30'
                    : 'bg-white/10 backdrop-blur-md border border-white/20 text-white/50'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 300 }}
              >
                {currentStep > step.number ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  step.number
                )}
              </motion.div>
              <div className="mt-2 text-center hidden sm:block">
                <div
                  className={`text-sm font-medium transition-colors ${
                    currentStep >= step.number ? 'text-white' : 'text-white/50'
                  }`}
                >
                  {step.label}
                </div>
                <div className="text-xs text-white/40 mt-0.5">{step.description}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main Content - Glass Container */}
      <motion.div
        className="max-w-4xl mx-auto px-4"
        variants={prefersReducedMotion ? undefined : fadeInUp}
      >
        <div className="bg-white/10 backdrop-blur-2xl border border-sage-500/30 rounded-2xl p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(107,142,35,0.1)_inset]">
          {/* Header with Conversational Tone */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sage-400 to-gold-400 bg-clip-text text-transparent" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>
              Here's What I've Got
            </h1>
            <p className="text-white/70 mt-2" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>
              {Object.values(confidence).some(c => c < 85) 
                ? "I've highlighted a few things you might want to double-check. Take a look and let me know if it's all good."
                : "Everything looks solid! Give it a quick review and we'll be ready to go."}
            </p>
          </div>

          {/* Invoice Form */}
          <InvoiceForm
            extractedData={extractedData}
            confidence={confidence}
            onSubmit={handleSubmit}
          />
        </div>
      </motion.div>

      {/* PDF Preview Modal */}
      {invoiceData && (
        <Suspense fallback={null}>
          <PDFPreviewModal
            isOpen={showPDFPreview}
            onClose={() => {
              setShowPDFPreview(false);
              setCurrentStep(1);
            }}
            invoice={invoiceData}
            business={businessData}
            onApprove={handleApprove}
          />
        </Suspense>
      )}

      {/* Success Bloom Animation */}
      <AnimatePresence>
        {showSuccessBloom && (
          <Suspense fallback={null}>
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AloeBloom
                size={300}
                onComplete={() => {
                  // Bloom animation completed
                }}
              />
            </motion.div>
          </Suspense>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InvoiceReviewPage;
