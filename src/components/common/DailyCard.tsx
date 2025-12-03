'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, Heart, Share2 } from 'lucide-react';

interface DailyCardProps {
  imageUrl?: string;
  caption?: string;
  onClick?: () => void;
}

const DailyCard: React.FC<DailyCardProps> = ({
  imageUrl = 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=400&h=500&fit=crop',
  caption = 'Find beauty in the ordinary moments of life.',
  onClick,
}) => {
  const [isLiked, setIsLiked] = React.useState(false);

  return (
    <div
      className="relative overflow-hidden rounded-2xl cursor-pointer group transition-all duration-500 hover:scale-[1.02]"
      onClick={onClick}
    >
      {/* Main image container */}
      <div className="aspect-[4/5] relative">
        <Image
          src={imageUrl}
          alt="Daily inspiration"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Multiple gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />
      </div>

      {/* Top badge */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <div className="glass-subtle px-3 py-1.5 rounded-full flex items-center gap-2">
          <Sparkles size={14} className="text-primary" />
          <span className="text-xs font-medium text-white">Daily Inspiration</span>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className={`p-2 rounded-full transition-all duration-300 ${
              isLiked 
                ? 'bg-accent/80 text-white' 
                : 'glass-subtle text-white hover:bg-white/30'
            }`}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
          <button 
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-full glass-subtle text-white hover:bg-white/30 transition-all duration-300"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="glass rounded-xl p-4 backdrop-blur-xl">
          <p className="text-white text-sm font-medium text-center leading-relaxed">
            &quot;{caption}&quot;
          </p>
        </div>
      </div>

      {/* Corner glow effect */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
};

export default DailyCard;
