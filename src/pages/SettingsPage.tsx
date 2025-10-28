import { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { fadeInUp, staggerChildren } from '../utils/animations';
import { useToast } from '../contexts/ToastContext';

// Lazy load Aloe components - only needed for decorative elements
const AloeBloom = lazy(() => import('../components/AloeBloom').then(m => ({ default: m.AloeBloom })));
const AloeRoot = lazy(() => import('../components/AloeRoot').then(m => ({ default: m.AloeRoot })));

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [showSuccessBloom, setShowSuccessBloom] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const prefersReducedMotion = useReducedMotion();
  const toast = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (businessName && businessName.length < 2) {
      newErrors.businessName = 'Business name must be at least 2 characters';
    }
    
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (phone && !/^\+?[\d\s-()]+$/.test(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }
    
    setIsSaving(true);
    
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    setShowSuccessBloom(true);
    toast.success('Settings saved successfully');
    
    // Hide bloom after animation
    setTimeout(() => setShowSuccessBloom(false), 2000);
  };

  return (
    <motion.div 
      className="max-w-4xl mx-auto relative"
      initial="hidden"
      animate="visible"
      variants={prefersReducedMotion ? undefined : staggerChildren}
    >
      <motion.h1 
        className="text-3xl font-bold bg-gradient-to-r from-sage-500 to-gold-500 bg-clip-text text-transparent mb-6"
        variants={prefersReducedMotion ? undefined : fadeInUp}
      >
        Settings
      </motion.h1>

      {/* Success Bloom Animation */}
      <AnimatePresence>
        {showSuccessBloom && (
          <Suspense fallback={null}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            >
              <AloeBloom size={300} onComplete={() => {}} />
            </motion.div>
          </Suspense>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* Business Information */}
        <motion.div 
          className="bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-lg p-6"
          variants={prefersReducedMotion ? undefined : fadeInUp}
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Business Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Business Name
              </label>
              <motion.input
                type="text"
                value={businessName}
                onChange={e => {
                  setBusinessName(e.target.value);
                  if (errors.businessName) {
                    setErrors(prev => ({ ...prev, businessName: '' }));
                  }
                }}
                placeholder="Enter your business name"
                className={`w-full px-3 py-2 bg-white/10 dark:bg-white/5 backdrop-blur-md border ${
                  errors.businessName ? 'border-error-500' : 'border-white/20'
                } text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 dark:focus:ring-sage-400 focus:border-transparent transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400`}
                whileFocus={{ scale: 1.01 }}
              />
              <AnimatePresence>
                {errors.businessName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-error-500 mt-1"
                  >
                    {errors.businessName}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <motion.input
                type="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: '' }));
                  }
                }}
                placeholder="business@example.com"
                className={`w-full px-3 py-2 bg-white/10 dark:bg-white/5 backdrop-blur-md border ${
                  errors.email ? 'border-error-500' : 'border-white/20'
                } text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 dark:focus:ring-sage-400 focus:border-transparent transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400`}
                whileFocus={{ scale: 1.01 }}
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-error-500 mt-1"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone
              </label>
              <motion.input
                type="tel"
                value={phone}
                onChange={e => {
                  setPhone(e.target.value);
                  if (errors.phone) {
                    setErrors(prev => ({ ...prev, phone: '' }));
                  }
                }}
                placeholder="+27 11 123 4567"
                className={`w-full px-3 py-2 bg-white/10 dark:bg-white/5 backdrop-blur-md border ${
                  errors.phone ? 'border-error-500' : 'border-white/20'
                } text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 dark:focus:ring-sage-400 focus:border-transparent transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400`}
                whileFocus={{ scale: 1.01 }}
              />
              <AnimatePresence>
                {errors.phone && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-error-500 mt-1"
                  >
                    {errors.phone}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                VAT Number (Optional)
              </label>
              <motion.input
                type="text"
                value={vatNumber}
                onChange={e => setVatNumber(e.target.value)}
                placeholder="4123456789"
                className="w-full px-3 py-2 bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 dark:focus:ring-sage-400 focus:border-transparent transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400"
                whileFocus={{ scale: 1.01 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Glass Separator */}
        <motion.div 
          className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
          variants={prefersReducedMotion ? undefined : fadeInUp}
        />

        {/* Appearance */}
        <motion.div 
          className="bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-lg p-6"
          variants={prefersReducedMotion ? undefined : fadeInUp}
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Appearance
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Dark Mode</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use dark theme across the app
              </p>
            </div>
            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${
                darkMode
                  ? 'bg-sage-600 dark:bg-sage-500 shadow-[0_0_20px_rgba(107,142,35,0.4)]'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="inline-block h-4 w-4 rounded-full bg-white shadow-lg"
                animate={{
                  x: darkMode ? 24 : 4,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>
        </motion.div>

        {/* Glass Separator */}
        <motion.div 
          className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
          variants={prefersReducedMotion ? undefined : fadeInUp}
        />

        {/* Invoice Settings */}
        <motion.div 
          className="bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-lg p-6"
          variants={prefersReducedMotion ? undefined : fadeInUp}
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Invoice Settings
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Invoice Prefix
              </label>
              <motion.input
                type="text"
                defaultValue="INV"
                placeholder="INV"
                className="w-full px-3 py-2 bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 dark:focus:ring-sage-400 focus:border-transparent transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400"
                whileFocus={{ scale: 1.01 }}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Preview: INV-2025-001
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Next Invoice Number
              </label>
              <motion.input
                type="number"
                defaultValue="1"
                min="1"
                className="w-full px-3 py-2 bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 dark:focus:ring-sage-400 focus:border-transparent transition-all"
                whileFocus={{ scale: 1.01 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Glass Separator */}
        <motion.div 
          className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
          variants={prefersReducedMotion ? undefined : fadeInUp}
        />

        {/* Security & Data Persistence */}
        <motion.div 
          className="bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-lg p-6 relative overflow-hidden"
          variants={prefersReducedMotion ? undefined : fadeInUp}
        >
          {/* Decorative AloeRoot in background */}
          <div className="absolute -right-20 -bottom-20 opacity-10 pointer-events-none">
            <Suspense fallback={null}>
              <AloeRoot size={250} />
            </Suspense>
          </div>

          <div className="relative z-10">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Security & Data
            </h2>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-sage-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Local Data Storage</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    All your data is stored securely on your device
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-sage-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Privacy First</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No data is sent to external servers
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-sage-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Persistent Storage</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your invoices and clients are saved automatically
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div 
          className="flex justify-end gap-3"
          variants={prefersReducedMotion ? undefined : fadeInUp}
        >
          <Button variant="outline" size="lg">
            Cancel
          </Button>
          <Button 
            variant="primary" 
            size="lg" 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
