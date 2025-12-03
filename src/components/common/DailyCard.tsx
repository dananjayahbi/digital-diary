'use client';

import React from 'react';
import Image from 'next/image';

interface DailyCardProps {
  imageUrl?: string;
  caption?: string;
  onClick?: () => void;
}

const DailyCard: React.FC<DailyCardProps> = ({
  imageUrl = 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=500&fit=crop',
  caption = 'A world full of flowers, where would it be?',
  onClick,
}) => {
  return (
    <div
      className="relative overflow-hidden rounded-2xl cursor-pointer group"
      onClick={onClick}
    >
      <div className="aspect-[4/5] relative">
        <Image
          src={imageUrl}
          alt="Daily inspiration"
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-white text-sm font-medium text-center">
          {caption}
        </p>
      </div>
    </div>
  );
};

export default DailyCard;
