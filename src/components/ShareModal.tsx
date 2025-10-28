import { useState } from 'react';
import { Button, Modal } from './index';
import { useToast } from '../contexts/ToastContext';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: {
    invoiceNumber: string;
    clientName: string;
    clientEmail?: string;
    totalAmount: number;
  };
}

const ShareModal = ({ isOpen, onClose, invoice }: ShareModalProps) => {
  const toast = useToast();
  const [email, setEmail] = useState(invoice.clientEmail || '');
  const [message, setMessage] = useState(
    `Hi,\n\nPlease find attached invoice ${invoice.invoiceNumber} for R ${invoice.totalAmount.toFixed(2)}.\n\nThank you for your business!`
  );

  const handleEmailShare = () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    // TODO: Implement actual email sending
    toast.success(`Invoice sent to ${email}`);
    onClose();
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Invoice ${invoice.invoiceNumber}\nAmount: R ${invoice.totalAmount.toFixed(2)}\n\nView invoice: [Link will be here]`
    );
    const whatsappUrl = `https://wa.me/?text=${text}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Opening WhatsApp...');
  };

  const handleCopyLink = () => {
    // TODO: Generate actual shareable link
    const link = `https://tally.app/invoice/${invoice.invoiceNumber}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

  const handleDownload = () => {
    // TODO: Implement actual download
    toast.success('Downloading invoice...');
    onClose();
  };

  // Check if Web Share API is supported
  const canUseWebShare = typeof navigator !== 'undefined' && navigator.share;

  const handleNativeShare = async () => {
    if (canUseWebShare) {
      try {
        await navigator.share({
          title: `Invoice ${invoice.invoiceNumber}`,
          text: `Invoice for ${invoice.clientName} - R ${invoice.totalAmount.toFixed(2)}`,
          // url: pdfUrl, // TODO: Add actual PDF URL
        });
        toast.success('Shared successfully!');
      } catch (error) {
        // User cancelled or error occurred
        console.error('Share failed:', error);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Invoice"
      size="md"
    >
      <div className="space-y-4">
        {/* Native Share (if supported) */}
        {canUseWebShare && (
          <button
            onClick={handleNativeShare}
            className="w-full p-4 bg-primary-50 dark:bg-primary-900 hover:bg-primary-100 dark:hover:bg-primary-800 rounded-lg text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500 dark:bg-primary-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Share</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Use native share options</p>
              </div>
            </div>
          </button>
        )}

        {/* Email */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Email</h3>
          <div className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="client@example.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button variant="primary" onClick={handleEmailShare} className="w-full">
              Send Email
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleWhatsAppShare}
            className="p-3 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-success-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">WhatsApp</span>
            </div>
          </button>

          <button
            onClick={handleCopyLink}
            className="p-3 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-info-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Copy Link</span>
            </div>
          </button>
        </div>

        {/* Download */}
        <Button variant="outline" onClick={handleDownload} className="w-full">
          Download PDF
        </Button>
      </div>
    </Modal>
  );
};

export default ShareModal;
