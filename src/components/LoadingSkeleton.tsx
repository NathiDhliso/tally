interface LoadingSkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
  className?: string;
}

const LoadingSkeleton = ({
  variant = 'text',
  width,
  height,
  className = '',
}: LoadingSkeletonProps) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700';

  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style = {
    width: width || (variant === 'circular' ? '40px' : '100%'),
    height: height || (variant === 'circular' ? '40px' : undefined),
  };

  return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} style={style} />;
};

export default LoadingSkeleton;
