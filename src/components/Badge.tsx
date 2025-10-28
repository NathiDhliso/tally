import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Badge = ({ children, variant = 'neutral', size = 'md', className = '' }: BadgeProps) => {
  const variantStyles = {
    primary: 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300',
    secondary: 'bg-secondary-100 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300',
    success: 'bg-success-100 dark:bg-success-900 text-success-700 dark:text-success-300',
    warning: 'bg-warning-100 dark:bg-warning-900 text-warning-700 dark:text-warning-300',
    error: 'bg-error-100 dark:bg-error-900 text-error-700 dark:text-error-300',
    info: 'bg-info-100 dark:bg-info-900 text-info-700 dark:text-info-300',
    neutral: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
