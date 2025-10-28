import { Button } from './index';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'info',
}: ConfirmDialogProps) => {
  if (!isOpen) return null;

  const getIconColor = () => {
    switch (variant) {
      case 'danger':
        return 'bg-error-100 dark:bg-error-900 text-error-600 dark:text-error-400';
      case 'warning':
        return 'bg-warning-100 dark:bg-warning-900 text-warning-600 dark:text-warning-400';
      case 'info':
        return 'bg-info-100 dark:bg-info-900 text-info-600 dark:text-info-400';
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${getIconColor()}`}>
            {getIcon()}
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center mb-2">
            {title}
          </h2>

          {/* Message */}
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">{message}</p>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" size="lg" onClick={onClose} className="flex-1">
              {cancelLabel}
            </Button>
            <Button
              variant={variant === 'danger' ? 'primary' : 'primary'}
              size="lg"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1"
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
