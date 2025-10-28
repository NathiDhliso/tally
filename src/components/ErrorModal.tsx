interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  alternativeLabel?: string;
  onAlternative?: () => void;
}

export const ErrorModal = ({
  isOpen,
  onClose,
  title,
  message,
  actionLabel,
  onAction,
  alternativeLabel,
  onAlternative,
}: ErrorModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-xl">
        {/* Icon */}
        <div className="w-12 h-12 bg-error-100 dark:bg-error-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-error-600 dark:text-error-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center mb-2">
          {title}
        </h2>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6 whitespace-pre-line">
          {message}
        </p>

        {/* Actions */}
        <div className="space-y-3">
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
              style={{ minHeight: '44px' }}
            >
              {actionLabel}
            </button>
          )}
          
          {alternativeLabel && onAlternative && (
            <button
              onClick={onAlternative}
              className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium rounded-xl transition-colors"
              style={{ minHeight: '44px' }}
            >
              {alternativeLabel}
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-3 px-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-medium transition-colors"
            style={{ minHeight: '44px' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
