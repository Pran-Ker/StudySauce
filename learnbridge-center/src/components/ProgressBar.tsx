
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  size = 'md',
  showLabel = true,
  className
}) => {
  const progressRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.width = `${progress}%`;
    }
  }, [progress]);
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };
  
  return (
    <div className={cn('w-full', className)}>
      <div className="w-full flex items-center">
        <div className={cn('w-full bg-secondary rounded-full overflow-hidden', sizeClasses[size])}>
          <div
            ref={progressRef}
            className="bg-primary h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: '0%' }}
          />
        </div>
        {showLabel && (
          <span className="ml-2 text-sm font-medium text-muted-foreground">{progress}%</span>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
