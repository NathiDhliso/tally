import { useState, lazy, Suspense, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { VoiceRecorder, Button, Card, InvoiceForm } from '../components';
import { useToast } from '../contexts/ToastContext';
import { useTypingEffect } from '../hooks/useTypingEffect';
import { useSwipeGesture } from '../hooks/useSwipeGesture';
import { fadeInUp, staggerChildren } from '../utils/animations';
import { FileText, Users, Settings, ArrowDown, ChevronDown, Menu } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useInvoiceStore } from '../store/invoiceStore';
import { useSettingsStore } from '../store/settingsStore';
import type { ExtractedInvoiceData, ConfidenceScores } from '../types/invoice';
import InvoicesPage from './InvoicesPage';
import ClientsPage from './ClientsPage';
import SettingsPage from './SettingsPage';

// Lazy load heavy components
const PDFPreviewModal = lazy(() => import('../components/PDFPreviewModal'));
const AloeBloom = lazy(() => import('../components/AloeBloom').then(m => ({ default: m.AloeBloom })));

type AppState = 'idle' | 'reviewing' | 'previewing' | 'complete' | 'invoices' | 'clients' | 'settings';

const HomePageUnified = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { addInvoice } = useInvoiceStore();
  const { businessData } = useSettingsStore();
  const prefersReducedMotion = useReducedMotion();
  
  // App state machine
  const [appState, setAppState] = useState<AppState>('idle');
  const [extractedData, setExtractedData] = useState<ExtractedInvoiceData | null>(null);
  const [confidence, setConfidence] = useState<ConfidenceScores | null>(null);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [showSuccessBloom, setShowSuccessBloom] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showMenu, setShowMenu] = useState(false);
  
  // Refs for gesture handling
  const reviewPanelRef = useRef<HTMLDivElement>(null);
  
  // Smooth scroll animations
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  
  const { displayedText } = useTypingEffect({
    text: 'Speak to create your invoice in seconds',
    speed: 50,
    delay: 800,
  });

  const steps = [
    { number: 1, label: 'Review Details', description: 'Verify extracted data' },
    { number: 2, label: 'Preview Invoice', description: 'Check final format' },
    { number: 3, label: 'Complete', description: 'Invoice created' },
  ];

  const handleRecordingComplete = (audioBlob: Blob) => {
    console.log('Recording complete:', audioBlob);
    toast.info('Processing audio...');
    
    // TODO: Upload and process audio with backend
    // This will be replaced with actual API call to process the audio
    // For now, in development, the devData seeder provides sample data
    
    // Simulate API processing delay
    setTimeout(() => {
      toast.info('Audio processing will be implemented with backend integration');
      // The actual implementation will:
      // 1. Upload audioBlob to backend
      // 2. Receive ExtractedInvoiceData and ConfidenceScores
      // 3. Set the data and transition to reviewing state
      
      // For development testing, use manual entry instead
      handleManualEntry();
    }, 2000);
  };

  const handleError = (error: Error) => {
    console.error('Recording error:', error);
    toast.error('Recording failed. Please try again.');
  };

  const handleManualEntry = () => {
    const emptyData: ExtractedInvoiceData = {
      clientName: '',
      itemDescription: '',
      quantity: 1,
      unitPrice: 0,
      date: new Date().toISOString().split('T')[0],
    };
    
    const perfectConfidence: ConfidenceScores = {
      clientName: 100,
      itemDescription: 100,
      quantity: 100,
      unitPrice: 100,
      date: 100,
    };
    
    setExtractedData(emptyData);
    setConfidence(perfectConfidence);
    setAppState('reviewing');
    setCurrentStep(1);
  };

  const handleFormSubmit = (formData: any) => {
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

  const handleDismissReview = () => {
    setAppState('idle');
    setExtractedData(null);
    setConfidence(null);
    setCurrentStep(1);
  };
  
  // Swipe gesture for dismissing review panel
  const swipeState = useSwipeGesture(reviewPanelRef, {
    onSwipeDown: handleDismissReview,
    threshold: 100,
    velocityThreshold: 0.5,
  });

  const scrollToActions = () => {
    const actionsElement = document.getElementById('quick-actions');
    if (actionsElement) {
      actionsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Subtle animated gradient orbs for depth */}
      {!prefersReducedMotion && (
        <div className="fixed inset-0 z-pattern overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-sage-500/10 blur-[100px]"
            animate={{ 
              scale: [1, 1.2, 1], 
              opacity: [0.1, 0.2, 0.1] 
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: 'easeInOut' 
            }}
          />
          <motion.div
            className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-gold-500/10 blur-[100px]"
            animate={{ 
              scale: [1, 1.3, 1], 
              opacity: [0.1, 0.2, 0.1] 
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              ease: 'easeInOut',
              delay: 2 
            }}
          />
        </div>
      )}
      
      {/* Hero Section - Shrinks to corner when reviewing */}
      <AnimatePresence mode="wait">
        {appState === 'idle' ? (
          <motion.section
            key="hero-full"
            className="sticky top-0 z-content min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 1, scale: 1 }}
            exit={{ 
              opacity: 0, 
              scale: 0.3,
              y: -window.innerHeight * 0.4,
              x: -window.innerWidth * 0.35,
              transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] }
            }}
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerChildren}
              style={prefersReducedMotion ? {} : { opacity, scale }}
              className="text-center w-full max-w-4xl mx-auto py-8 sm:py-12"
            >
              {/* Hero Headline */}
              <motion.h1
                variants={fadeInUp}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 sm:mb-8 text-gradient-brand leading-tight tracking-tight px-4"
                style={{
                  filter: 'drop-shadow(0 2px 8px rgba(107, 142, 35, 0.5))',
                  WebkitTextStroke: '0.5px rgba(107, 142, 35, 0.1)',
                }}
              >
                Voice to Invoice
              </motion.h1>

              {/* Subtitle with Typing Effect */}
              <motion.p
                variants={fadeInUp}
                className="text-lg sm:text-xl md:text-2xl text-text-secondary mb-10 sm:mb-14 min-h-[2.5rem] sm:min-h-[3rem] px-4 font-light"
              >
                {displayedText}
                <span className="inline-block w-0.5 h-5 sm:h-6 bg-sage-500 ml-1 animate-pulse"></span>
              </motion.p>

              {/* VoiceRecorder as Centerpiece */}
              <motion.div variants={fadeInUp} className="mb-8 sm:mb-12">
                <VoiceRecorder
                  onRecordingComplete={handleRecordingComplete}
                  onError={handleError}
                  onSwitchToManualEntry={handleManualEntry}
                />
              </motion.div>

              {/* Manual Entry Button */}
              <motion.div variants={fadeInUp} className="mb-8 sm:mb-12">
                <Button variant="outline" size="lg" onClick={handleManualEntry}>
                  Type Instead
                </Button>
              </motion.div>

              {/* Scroll Indicator */}
              <motion.button
                variants={fadeInUp}
                onClick={scrollToActions}
                className="mt-8 sm:mt-12 text-sage-500 hover:text-sage-400 transition-colors focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2 focus:ring-offset-[#0f172a] rounded-full p-2"
                aria-label="Scroll to quick actions"
                animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowDown className="w-6 h-6 sm:w-8 sm:h-8" />
              </motion.button>
            </motion.div>
          </motion.section>
        ) : (
          /* Companion Menu Button in Corner */
          <motion.div
            key="hero-mini"
            className="fixed top-4 left-4 z-50"
            initial={{ 
              opacity: 0, 
              scale: 0.3,
              y: -window.innerHeight * 0.4,
              x: -window.innerWidth * 0.35
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: 0,
              x: 0,
              transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1], delay: 0.2 }
            }}
          >
            <motion.button
              onClick={() => setShowMenu(!showMenu)}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-sage-500 to-gold-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Open menu"
            >
              <AnimatePresence mode="wait">
                {showMenu ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-8 h-8 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Companion Menu Popover */}
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-20 left-0 w-64"
                >
                  <div className="glass-surface rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    <div className="space-y-2">
                      <motion.button
                        onClick={() => { handleDismissReview(); setShowMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left text-white"
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                        <span>New Invoice</span>
                      </motion.button>

                      <motion.button
                        onClick={() => { setAppState('invoices'); setShowMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left text-white"
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FileText className="w-5 h-5" />
                        <span>View Invoices</span>
                      </motion.button>

                      <motion.button
                        onClick={() => { setAppState('clients'); setShowMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left text-white"
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Users className="w-5 h-5" />
                        <span>Manage Clients</span>
                      </motion.button>

                      <motion.button
                        onClick={() => { setAppState('settings'); setShowMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left text-white"
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invoice Review Panel - Slides in from bottom with swipe gesture */}
      <AnimatePresence>
        {appState === 'reviewing' && extractedData && confidence && (
          <motion.div
            ref={reviewPanelRef}
            key="review-panel"
            className="fixed inset-0 z-40 panel-background overflow-y-auto"
            initial={{ y: '100%' }}
            animate={{ 
              y: swipeState.isSwiping && swipeState.direction === 'down' 
                ? Math.min(swipeState.distance, window.innerHeight * 0.5)
                : 0 
            }}
            exit={{ y: '100%' }}
            transition={{ duration: swipeState.isSwiping ? 0 : 0.5, ease: [0.32, 0.72, 0, 1] }}
          >
            {/* Dismiss Gesture Indicator */}
            <motion.div
              className="sticky top-0 z-10 flex justify-center py-4 bg-gradient-to-b from-[#0f172a] to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={handleDismissReview}
                className="flex flex-col items-center gap-2 text-white/50 hover:text-white/80 transition-colors group"
              >
                <ChevronDown className="w-6 h-6 group-hover:animate-bounce" />
                <span className="text-xs">Swipe down to dismiss</span>
              </button>
            </motion.div>

            <motion.div
              className="min-h-screen pb-20 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Step Indicator */}
              <div className="max-w-4xl mx-auto mb-8 px-4">
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
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          step.number
                        )}
                      </motion.div>
                      <div className="mt-2 text-center hidden sm:block">
                        <div className={`text-sm font-medium transition-colors ${currentStep >= step.number ? 'text-white' : 'text-white/50'}`}>
                          {step.label}
                        </div>
                        <div className="text-xs text-white/40 mt-0.5">{step.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Content - Glass Container */}
              <div className="max-w-4xl mx-auto px-4">
                <div className="glass-surface rounded-2xl p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(107,142,35,0.1)_inset]">
                  {/* Header with Conversational Tone */}
                  <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gradient-brand text-shadow">
                      Here's What I've Got
                    </h1>
                    <p className="text-white/70 mt-2 text-shadow-sm">
                      {Object.values(confidence).some(c => c < 85) 
                        ? "I've highlighted a few things you might want to double-check. Take a look and let me know if it's all good."
                        : "Everything looks solid! Give it a quick review and we'll be ready to go."}
                    </p>
                  </div>

                  {/* Invoice Form */}
                  <InvoiceForm
                    extractedData={extractedData}
                    confidence={confidence}
                    onSubmit={handleFormSubmit}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions Section - Only visible in idle state */}
      {appState === 'idle' && (
        <section 
          id="quick-actions"
          className="relative z-content py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-6xl mx-auto"
          >
            {/* Section Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 sm:mb-6 text-gradient-brand"
              style={{ filter: 'drop-shadow(0 2px 8px rgba(107, 142, 35, 0.5))' }}
            >
              Quick Actions
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center text-text-tertiary text-base sm:text-lg mb-10 sm:mb-14 max-w-2xl mx-auto"
            >
              Manage your invoices, clients, and settings with ease
            </motion.p>

            {/* Quick Action Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
            >
              <motion.div 
                whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -4 }} 
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-full"
              >
                <Card
                  className="p-6 sm:p-8 cursor-pointer group transition-all duration-300 hover:shadow-[0_0_30px_rgba(107,142,35,0.3)] border-sage-500/20 h-full"
                  onClick={() => setAppState('invoices')}
                >
                  <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-sage-500 mx-auto mb-4 transition-transform duration-300 group-hover:scale-110" />
                  <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">View Invoices</h3>
                  <p className="text-sm sm:text-base text-text-tertiary">Browse and manage your invoices</p>
                </Card>
              </motion.div>

              <motion.div 
                whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -4 }} 
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-full"
              >
                <Card
                  className="p-6 sm:p-8 cursor-pointer group transition-all duration-300 hover:shadow-[0_0_30px_rgba(107,142,35,0.3)] border-sage-500/20 h-full"
                  onClick={() => setAppState('clients')}
                >
                  <Users className="w-10 h-10 sm:w-12 sm:h-12 text-sage-500 mx-auto mb-4 transition-transform duration-300 group-hover:scale-110" />
                  <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">Manage Clients</h3>
                  <p className="text-sm sm:text-base text-text-tertiary">Add and organize your clients</p>
                </Card>
              </motion.div>

              <motion.div 
                whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -4 }} 
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-full sm:col-span-2 lg:col-span-1"
              >
                <Card
                  className="p-6 sm:p-8 cursor-pointer group transition-all duration-300 hover:shadow-[0_0_30px_rgba(107,142,35,0.3)] border-sage-500/20 h-full"
                  onClick={() => setAppState('settings')}
                >
                  <Settings className="w-10 h-10 sm:w-12 sm:h-12 text-sage-500 mx-auto mb-4 transition-transform duration-300 group-hover:scale-110" />
                  <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">Settings</h3>
                  <p className="text-sm sm:text-base text-text-tertiary">Configure your preferences</p>
                </Card>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* Invoices Panel */}
      <AnimatePresence>
        {appState === 'invoices' && (
          <motion.div
            key="invoices-panel"
            className="fixed inset-0 z-40 panel-background overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="min-h-screen pb-20 pt-24">
              <InvoicesPage />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clients Panel */}
      <AnimatePresence>
        {appState === 'clients' && (
          <motion.div
            key="clients-panel"
            className="fixed inset-0 z-40 panel-background overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="min-h-screen pb-20 pt-24">
              <ClientsPage />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {appState === 'settings' && (
          <motion.div
            key="settings-panel"
            className="fixed inset-0 z-40 panel-background overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="min-h-screen pb-20 pt-24">
              <SettingsPage />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <AloeBloom size={300} onComplete={() => {}} />
            </motion.div>
          </Suspense>
        )}
      </AnimatePresence>

      {/* Bottom Spacing for Mobile */}
      <div className="h-16 sm:h-20"></div>
    </div>
  );
};

export default HomePageUnified;
