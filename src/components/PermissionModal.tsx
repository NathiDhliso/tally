interface PermissionModalProps {
  isOpen: boolean;
  onAllow: () => void;
  onDeny: () => void;
}

export const PermissionModal = ({ isOpen, onAllow, onDeny }: PermissionModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-xl">
        {/* Icon */}
        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-primary-600 dark:text-primary-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center mb-2">
          Let's Get Started!
        </h2>

        {/* Privacy Message */}
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          I'll need to use your microphone to hear your invoice details. Don't worry - your recordings are kept secure and automatically deleted after 24 hours. Promise!
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onAllow}
            className="w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
            style={{ minHeight: '44px' }}
          >
            Sure, Let's Go!
          </button>
          
          <button
            onClick={onDeny}
            className="w-full py-3 px-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-medium transition-colors"
            style={{ minHeight: '44px' }}
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};
