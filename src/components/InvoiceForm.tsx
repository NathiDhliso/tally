import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ExtractedInvoiceData, ConfidenceScores } from '../types/invoice';
import { InvoiceSchema, type InvoiceFormData } from '../utils/validation';
import ConfidenceIndicator from './ConfidenceIndicator';
import { Button } from './index';
import useDebounce from '../hooks/useDebounce';
import { saveDraft } from '../utils/localStorage';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { fadeInUp, staggerChildren } from '../utils/animations';

interface InvoiceFormProps {
  extractedData: ExtractedInvoiceData;
  confidence: ConfidenceScores;
  onSubmit: (invoice: InvoiceFormData) => void;
  onFieldUpdate?: (field: string, value: string | number) => void;
  draftKey?: string;
}

const InvoiceForm = ({
  extractedData,
  confidence,
  onSubmit,
  onFieldUpdate,
  draftKey = 'invoice-draft',
}: InvoiceFormProps) => {
  const [formData, setFormData] = useState<InvoiceFormData>({
    ...extractedData,
    totalAmount: extractedData.quantity * extractedData.unitPrice,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [animatedTotal, setAnimatedTotal] = useState(formData.totalAmount);
  const prefersReducedMotion = useReducedMotion();
  
  // Refs for auto-focusing low-confidence fields
  const fieldRefs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | null>>({});
  const hasAutoFocused = useRef(false);
  
  // Debounce form data for auto-save
  const debouncedFormData = useDebounce(formData, 2000);

  // Auto-focus first low-confidence field on mount
  useEffect(() => {
    if (hasAutoFocused.current) return;
    
    // Find first field with confidence < 85
    const lowConfidenceFields = Object.entries(confidence)
      .filter(([_, conf]) => conf < 85)
      .sort(([_, a], [__, b]) => a - b); // Sort by confidence, lowest first
    
    if (lowConfidenceFields.length > 0) {
      const [fieldName] = lowConfidenceFields[0];
      const fieldRef = fieldRefs.current[fieldName];
      
      if (fieldRef) {
        // Delay to allow animations to settle
        setTimeout(() => {
          fieldRef.focus();
          fieldRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
          hasAutoFocused.current = true;
        }, 800);
      }
    }
  }, [confidence]);

  // Calculate total amount when quantity or unit price changes
  useEffect(() => {
    const total = formData.quantity * formData.unitPrice;
    setFormData(prev => ({ ...prev, totalAmount: total }));
  }, [formData.quantity, formData.unitPrice]);

  // Smooth number counting animation for total
  useEffect(() => {
    if (prefersReducedMotion) {
      setAnimatedTotal(formData.totalAmount);
      return;
    }

    const duration = 800;
    const steps = 30;
    const start = animatedTotal;
    const end = formData.totalAmount;
    const increment = (end - start) / steps;
    let current = start;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += increment;
      setAnimatedTotal(current);

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedTotal(end);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [formData.totalAmount, prefersReducedMotion]);

  // Auto-save draft every 2 seconds
  useEffect(() => {
    if (debouncedFormData) {
      setIsSaving(true);
      saveDraft(draftKey, debouncedFormData);
      setTimeout(() => setIsSaving(false), 500);
    }
  }, [debouncedFormData, draftKey]);

  const handleChange = (field: keyof InvoiceFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    onFieldUpdate?.(field, value);
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate with Zod schema
    const result = InvoiceSchema.safeParse(formData);
    
    if (!result.success) {
      result.error.issues.forEach(err => {
        const field = String(err.path[0]);
        newErrors[field] = err.message;
      });
    }

    // Additional custom validation
    if (formData.totalAmount > 1000000) {
      newErrors.totalAmount = 'Amount seems unusually high. Please verify.';
    }

    const dateObj = new Date(formData.date);
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    if (dateObj > thirtyDaysFromNow) {
      newErrors.date = 'Date cannot be more than 30 days in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  const renderField = (
    field: keyof ExtractedInvoiceData,
    label: string,
    type: 'text' | 'number' | 'date' | 'textarea' = 'text',
    placeholder?: string
  ) => {
    const conf = confidence[field] || 100;
    const value = formData[field] || '';
    const showPercentage = conf < 100;
    const isFocused = focusedField === field;
    const hasValue = value !== '' && value !== 0;

    return (
      <motion.div variants={fadeInUp} className="mb-6 relative">
        {/* Floating label */}
        <motion.label
          animate={{
            y: isFocused || hasValue ? -24 : 8,
            scale: isFocused || hasValue ? 0.85 : 1,
            color: isFocused ? '#6b8e23' : '#9ca3af',
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute left-3 text-sm font-medium pointer-events-none origin-left z-10"
        >
          {label}
        </motion.label>

        {/* Glass input container with inner glow on focus */}
        <motion.div
          animate={{
            boxShadow: isFocused
              ? '0 0 0 2px rgba(107, 142, 35, 0.3), inset 0 0 20px rgba(107, 142, 35, 0.1)'
              : '0 0 0 1px rgba(255, 255, 255, 0.2)',
          }}
          transition={{ duration: 0.2 }}
        >
          <ConfidenceIndicator confidence={conf} showPercentage={showPercentage} size="sm">
            {type === 'textarea' ? (
              <textarea
                ref={el => { fieldRefs.current[field] = el; }}
                value={value as string}
                onChange={e => handleChange(field, e.target.value)}
                onFocus={() => setFocusedField(field)}
                onBlur={() => setFocusedField(null)}
                placeholder={conf < 70 ? '[unclear]' : placeholder}
                className="w-full px-3 pt-6 pb-2 bg-transparent text-white focus:outline-none focus:ring-0 min-h-[100px] resize-none"
                rows={3}
              />
            ) : (
              <input
                ref={el => { fieldRefs.current[field] = el; }}
                type={type}
                value={value}
                onChange={e =>
                  handleChange(field, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)
                }
                onFocus={() => setFocusedField(field)}
                onBlur={() => setFocusedField(null)}
                placeholder={conf < 70 ? '[unclear]' : placeholder}
                className="w-full px-3 pt-6 pb-2 bg-transparent text-white focus:outline-none focus:ring-0"
                step={type === 'number' ? '0.01' : undefined}
              />
            )}
          </ConfidenceIndicator>
        </motion.div>

        {/* Error message with shake animation */}
        <AnimatePresence>
          {errors[field] && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ 
                opacity: 1, 
                x: [0, -10, 10, -10, 10, 0],
                transition: { x: { duration: 0.4 } }
              }}
              exit={{ opacity: 0, x: -10 }}
              className="text-red-400 text-sm mt-2 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors[field]}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Ask AI Again button for low confidence */}
        {conf < 70 && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-sm text-sage-400 hover:text-sage-300 mt-2 flex items-center gap-1"
            onClick={() => {
              // TODO: Trigger follow-up voice recording
              console.log('Ask AI again for:', field);
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
            Ask AI Again
          </motion.button>
        )}
      </motion.div>
    );
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-4"
      initial="hidden"
      animate="visible"
      variants={staggerChildren}
    >
      {/* Header with auto-save indicator */}
      <motion.div variants={fadeInUp} className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-sage-500 to-gold-500 bg-clip-text text-transparent">
          Review Invoice Details
        </h2>
        
        {/* Floating auto-save badge */}
        <AnimatePresence>
          {isSaving && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              className="flex items-center gap-2 px-3 py-1.5 bg-sage-500/20 backdrop-blur-md border border-sage-500/30 rounded-full"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-3 h-3 border-2 border-sage-500 border-t-transparent rounded-full"
              />
              <span className="text-xs text-sage-300 font-medium">Saving...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Form fields with stagger animation */}
      {renderField('clientName', 'Client Name', 'text', 'Enter client name')}
      {renderField('itemDescription', 'Item Description', 'textarea', 'Describe the service or product')}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderField('quantity', 'Quantity', 'number', '1')}
        {renderField('unitPrice', 'Unit Price (ZAR)', 'number', '0.00')}
      </div>

      {renderField('date', 'Invoice Date', 'date')}

      {/* Total amount with counting animation */}
      <motion.div variants={fadeInUp} className="mb-8">
        <label className="block text-sm font-medium text-gray-400 mb-2">Total Amount</label>
        <motion.div
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-sage-500/10 to-gold-500/10 backdrop-blur-md border border-white/20 p-6"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-4xl font-bold bg-gradient-to-r from-sage-400 to-gold-400 bg-clip-text text-transparent">
            {formatCurrency(animatedTotal)}
          </div>
          
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: 'linear',
            }}
          />
        </motion.div>
        
        {/* Error message for total */}
        <AnimatePresence>
          {errors.totalAmount && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-amber-400 text-sm mt-2 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.totalAmount}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Action buttons with sage/terracotta colors */}
      <motion.div variants={fadeInUp} className="mt-8 flex flex-col sm:flex-row gap-3">
        <Button 
          type="submit" 
          variant="primary" 
          size="lg" 
          className="flex-1 bg-gradient-to-r from-sage-500 to-gold-500 hover:from-sage-600 hover:to-gold-600 text-white shadow-lg shadow-sage-500/30 hover:shadow-xl hover:shadow-sage-500/40"
        >
          Generate PDF
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          size="lg" 
          onClick={() => window.history.back()}
          className="border-sage-500/30 text-sage-300 hover:bg-sage-500/10 hover:border-sage-500/50"
        >
          Cancel
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default InvoiceForm;
