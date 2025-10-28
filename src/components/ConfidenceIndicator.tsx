import type { ReactNode } from 'react';

interface ConfidenceIndicatorProps {
  confidence: number;
  children: ReactNode;
  showPercentage?: boolean;
}

const ConfidenceIndicator = ({
  confidence,
  children,
  showPercentage = false,
}: ConfidenceIndicatorProps) => {
  const getBorderColor = () => {
    if (confidence > 90) return 'border-success-500 dark:border-success-400';
    if (confidence >= 70) return 'border-warning-500 dark:border-warning-400';
    return 'border-error-500 dark:border-error-400';
  };

  const getBackgroundColor = () => {
    if (confidence > 90) return 'bg-success-50 dark:bg-success-950';
    if (confidence >= 70) return 'bg-warning-50 dark:bg-warning-950';
    return 'bg-error-50 dark:bg-error-950';
  };

  const getTextColor = () => {
    if (confidence >= 70) return 'text-warning-700 dark:text-warning-300';
    return 'text-error-700 dark:text-error-300';
  };

  return (
    <div className="relative">
      <div className={`${getBorderColor()} ${getBackgroundColor()} border-2 rounded-lg`}>
        {children}
      </div>
      {showPercentage && confidence >= 70 && confidence <= 90 && (
        <span className={`text-xs ${getTextColor()} mt-1 block`}>
          Confidence: {confidence}%
        </span>
      )}
    </div>
  );
};

export default ConfidenceIndicator;
