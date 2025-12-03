'use client';

import React from 'react';
import Image from 'next/image';
import { Leaf, Heart, Share2 } from 'lucide-react';
import { SkeletonDailyCard } from '@/components/ui';

interface DailyCardProps {
  imageUrl?: string;
  caption?: string;
  onClick?: () => void;
  isLoading?: boolean;
}

const DailyCard: React.FC<DailyCardProps> = ({
  imageUrl = 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=400&h=500&fit=crop',
  caption = 'Find beauty in the ordinary moments of life.',
  onClick,
  isLoading = false,
}) => {
  const [isLiked, setIsLiked] = React.useState(false);

  if (isLoading) {
    return <SkeletonDailyCard />;
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl cursor-pointer group"
      onClick={onClick}
    >
      {/* Main image container */}
      <div className="aspect-4/5 relative">
        <Image
          src={imageUrl}
          alt="Daily inspiration"
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Top badge */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
        <div className="bg-white/90 px-3 py-1.5 rounded-full flex items-center gap-2">
          <Leaf size={14} className="text-primary" />
          <span className="text-xs font-medium text-foreground">Daily Inspiration</span>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className={`p-2 rounded-full transition-colors duration-150 ${
              isLiked 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 text-neutral-600 hover:bg-white'
            }`}
          >
            <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
          <button 
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-full bg-white/90 text-neutral-600 hover:bg-white transition-colors duration-150"
          >
            <Share2 size={14} />
          </button>
        </div>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-white text-sm font-medium text-center">
          &quot;{caption}&quot;
        </p>
      </div>
    </div>
  );
};

export default DailyCard;
