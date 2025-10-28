import { useState, useEffect } from 'react';
import type { ExtractedInvoiceData, ConfidenceScores } from '../types/invoice';
import { InvoiceSchema, type InvoiceFormData } from '../utils/validation';
import ConfidenceIndicator from './ConfidenceIndicator';
import { Button } from './index';
import useDebounce from '../hooks/useDebounce';
import { saveDraft } from '../utils/localStorage';

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
  
  // Debounce form data for auto-save
  const debouncedFormData = useDebounce(formData, 2000);

  // Calculate total amount when quantity or unit price changes
  useEffect(() => {
    const total = formData.quantity * formData.unitPrice;
    setFormData(prev => ({ ...prev, totalAmount: total }));
  }, [formData.quantity, formData.unitPrice]);

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
    const showPercentage = conf >= 70 && conf <= 90;

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <ConfidenceIndicator confidence={conf} showPercentage={showPercentage}>
          {type === 'textarea' ? (
            <textarea
              value={value as string}
              onChange={e => handleChange(field, e.target.value)}
              placeholder={conf < 70 ? '[unclear]' : placeholder}
              className="w-full px-3 py-2 bg-transparent focus:outline-none focus:ring-0 min-h-[80px]"
              rows={3}
            />
          ) : (
            <input
              type={type}
              value={value}
              onChange={e =>
                handleChange(field, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)
              }
              placeholder={conf < 70 ? '[unclear]' : placeholder}
              className="w-full px-3 py-2 bg-transparent focus:outline-none focus:ring-0"
              step={type === 'number' ? '0.01' : undefined}
            />
          )}
        </ConfidenceIndicator>
        {errors[field] && <p className="text-error-600 dark:text-error-400 text-sm mt-1">{errors[field]}</p>}
        {conf < 70 && (
          <button
            type="button"
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mt-1"
            onClick={() => {
              // TODO: Trigger follow-up voice recording
              console.log('Ask AI again for:', field);
            }}
          >
            Ask AI Again
          </button>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Review Invoice Details</h2>
        {isSaving && (
          <span className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Saving...</span>
        )}
      </div>

      {renderField('clientName', 'Client Name', 'text', 'Enter client name')}
      {renderField('itemDescription', 'Item Description', 'textarea', 'Describe the service or product')}

      <div className="grid grid-cols-2 gap-4">
        {renderField('quantity', 'Quantity', 'number', '1')}
        {renderField('unitPrice', 'Unit Price (ZAR)', 'number', '0.00')}
      </div>

      {renderField('date', 'Invoice Date', 'date')}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Amount</label>
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
          {formatCurrency(formData.totalAmount)}
        </div>
        {errors.totalAmount && <p className="text-warning-600 dark:text-warning-400 text-sm mt-1">{errors.totalAmount}</p>}
      </div>

      <div className="mt-6 flex gap-3">
        <Button type="submit" variant="primary" size="lg" className="flex-1">
          Generate PDF
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default InvoiceForm;
