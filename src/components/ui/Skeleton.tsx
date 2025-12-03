'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}) => {
  const baseStyles = 'bg-neutral-200/70';

  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-xl',
  };

  const animations = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const style: React.CSSProperties = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${animations[animation]} ${className}`}
      style={style}
    />
  );
};

// Pre-built skeleton components for common use cases
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 1,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          height={16}
          width={i === lines - 1 && lines > 1 ? '70%' : '100%'}
        />
      ))}
    </div>
  );
};

export const SkeletonAvatar: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className = '',
}) => {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
      className={className}
    />
  );
};

export const SkeletonButton: React.FC<{ width?: string | number; className?: string }> = ({
  width = 100,
  className = '',
}) => {
  return (
    <Skeleton
      variant="rounded"
      width={width}
      height={40}
      className={className}
    />
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`rounded-2xl bg-white/50 p-5 space-y-4 ${className}`}>
      <div className="flex items-center gap-3">
        <SkeletonAvatar size={48} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" height={16} width="60%" />
          <Skeleton variant="text" height={12} width="40%" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
};

export const SkeletonTaskItem: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-start gap-4 ${className}`}>
      {/* Time */}
      <Skeleton variant="text" width={50} height={16} className="mt-3" />
      
      {/* Timeline dot */}
      <div className="flex flex-col items-center">
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="rectangular" width={2} height={40} />
      </div>
      
      {/* Task card */}
      <div className="flex-1 rounded-xl bg-white/50 p-4 space-y-3">
        <div className="flex items-start gap-3">
          <Skeleton variant="circular" width={20} height={20} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" height={18} width="70%" />
            <Skeleton variant="text" height={14} width="90%" />
            <div className="flex gap-2 pt-1">
              <Skeleton variant="rounded" height={20} width={60} />
              <Skeleton variant="rounded" height={20} width={80} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonTaskTimeline: React.FC<{ count?: number; className?: string }> = ({
  count = 3,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton variant="rounded" width={44} height={44} />
          <div className="space-y-2">
            <Skeleton variant="text" height={20} width={140} />
            <Skeleton variant="text" height={12} width={100} />
          </div>
        </div>
        <Skeleton variant="rounded" width={100} height={36} />
      </div>
      
      {/* Tasks */}
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonTaskItem key={i} />
        ))}
      </div>
    </div>
  );
};

export const SkeletonJournalCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`rounded-2xl bg-white/50 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-neutral-100/50 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton variant="circular" width={14} height={14} />
            <Skeleton variant="text" width={120} height={14} />
          </div>
          <Skeleton variant="text" width={60} height={14} />
        </div>
        <Skeleton variant="text" height={24} width="80%" />
        <div className="flex gap-2">
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 space-y-4">
        <SkeletonText lines={2} />
        <Skeleton variant="rounded" height={150} width="100%" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={32} width={70} />
          ))}
        </div>
        <div className="flex justify-end">
          <Skeleton variant="rounded" height={40} width={120} />
        </div>
      </div>
    </div>
  );
};

export const SkeletonWeatherWidget: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`rounded-2xl bg-white/50 p-5 space-y-4 ${className}`}>
      {/* Location */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={14} height={14} />
          <Skeleton variant="text" width={80} height={14} />
        </div>
        <Skeleton variant="rounded" width={32} height={24} />
      </div>
      
      {/* Temperature */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton variant="text" height={48} width={100} />
          <Skeleton variant="text" height={14} width={80} />
        </div>
        <Skeleton variant="circular" width={64} height={64} />
      </div>
      
      {/* Details */}
      <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={14} height={14} />
          <Skeleton variant="text" width={30} height={14} />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={14} height={14} />
          <Skeleton variant="text" width={50} height={14} />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={14} height={14} />
          <Skeleton variant="text" width={30} height={14} />
        </div>
      </div>
    </div>
  );
};

export const SkeletonStreakWidget: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`rounded-2xl bg-white/50 p-5 space-y-4 ${className}`}>
      {/* Week view */}
      <div className="flex justify-between items-center gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <Skeleton variant="text" width={24} height={12} />
            <Skeleton variant="circular" width={36} height={36} />
          </div>
        ))}
      </div>
      
      {/* Streak info */}
      <div className="flex items-center justify-center gap-3 py-4 bg-neutral-100/50 rounded-xl">
        <Skeleton variant="circular" width={24} height={24} />
        <div className="text-center space-y-1">
          <Skeleton variant="text" height={20} width={100} />
          <Skeleton variant="text" height={12} width={180} />
        </div>
      </div>
      
      {/* Longest streak */}
      <div className="flex items-center justify-center gap-2">
        <Skeleton variant="circular" width={14} height={14} />
        <Skeleton variant="text" width={150} height={12} />
      </div>
    </div>
  );
};

export const SkeletonDailyCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`rounded-2xl overflow-hidden ${className}`}>
      <div className="aspect-4/5 relative">
        <Skeleton variant="rectangular" height="100%" width="100%" />
      </div>
    </div>
  );
};

export const SkeletonSidebar: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`rounded-2xl bg-white/50 p-5 space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton variant="text" height={20} width={100} />
        <div className="flex gap-2">
          <Skeleton variant="circular" width={28} height={28} />
          <Skeleton variant="circular" width={28} height={28} />
        </div>
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} variant="text" width="100%" height={16} />
        ))}
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" width="100%" height={32} className="aspect-square" />
        ))}
      </div>
      
      {/* Progress */}
      <div className="space-y-2">
        <Skeleton variant="text" height={14} width={80} />
        <Skeleton variant="rounded" height={8} width="100%" />
      </div>
    </div>
  );
};

export const SkeletonStatsCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`rounded-2xl bg-white/50 p-4 ${className}`}>
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="space-y-1">
          <Skeleton variant="text" height={28} width={50} />
          <Skeleton variant="text" height={14} width={70} />
        </div>
      </div>
    </div>
  );
};

export const SkeletonEntryItem: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`p-4 rounded-xl bg-white/30 space-y-2 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" height={18} width="50%" />
          <SkeletonText lines={2} />
          <div className="flex items-center gap-3">
            <Skeleton variant="rounded" height={20} width={60} />
            <Skeleton variant="text" height={12} width={50} />
          </div>
        </div>
        <Skeleton variant="circular" width={28} height={28} />
      </div>
    </div>
  );
};

export const SkeletonChartCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`rounded-2xl bg-white/50 p-6 space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" width={18} height={18} />
        <Skeleton variant="text" height={18} width={120} />
      </div>
      
      {/* Chart bars */}
      <div className="h-48 flex items-end justify-between gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <Skeleton 
              variant="rounded" 
              width="100%" 
              height={Math.random() * 100 + 50} 
            />
            <Skeleton variant="text" width={24} height={12} />
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex justify-center gap-6 pt-4 border-t border-neutral-200">
        <div className="flex items-center gap-2">
          <Skeleton variant="rounded" width={12} height={12} />
          <Skeleton variant="text" width={40} height={14} />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton variant="rounded" width={12} height={12} />
          <Skeleton variant="text" width={50} height={14} />
        </div>
      </div>
    </div>
  );
};

export const SkeletonSettingsTab: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`rounded-2xl bg-white/50 p-6 space-y-6 ${className}`}>
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" width={20} height={20} />
        <Skeleton variant="text" height={24} width={150} />
      </div>
      
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton variant="text" height={14} width={100} />
            <Skeleton variant="rounded" height={44} width="100%" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skeleton;
