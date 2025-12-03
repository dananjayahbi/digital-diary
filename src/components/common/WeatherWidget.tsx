'use client';

import React from 'react';
import { MapPin, Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets, Thermometer } from 'lucide-react';
import type { WeatherData } from '@/types';

interface WeatherWidgetProps {
  weather?: WeatherData | null;
  isLoading?: boolean;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather, isLoading }) => {
  const [unit, setUnit] = React.useState<'C' | 'F'>('C');

  const getWeatherIcon = (condition: string) => {
    const iconSize = 56;
    const iconProps = { size: iconSize, className: 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]' };
    
    switch (condition?.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun {...iconProps} />;
      case 'cloudy':
      case 'partly cloudy':
        return <Cloud {...iconProps} />;
      case 'rainy':
      case 'rain':
        return <CloudRain {...iconProps} />;
      case 'snowy':
      case 'snow':
        return <CloudSnow {...iconProps} />;
      default:
        return <Cloud {...iconProps} />;
    }
  };

  const convertTemp = (celsius: number) => {
    if (unit === 'F') {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius);
  };

  // Default weather data for demo
  const defaultWeather: WeatherData = {
    temperature: 22,
    condition: 'Partly Cloudy',
    humidity: 55,
    windSpeed: 15,
    feelsLike: 24,
    location: 'New York',
    icon: 'cloudy',
  };

  const displayWeather = weather || defaultWeather;

  if (isLoading) {
    return (
      <div className="relative rounded-2xl overflow-hidden h-64">
        <div className="absolute inset-0 bg-neutral-800 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden group">
      {/* Dramatic cloud background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&q=80')`,
        }}
      />
      
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      
      {/* Content */}
      <div className="relative p-6 text-white min-h-[280px] flex flex-col">
        {/* Location & Unit Toggle */}
        <div className="flex items-center justify-between mb-auto">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-primary-light" />
            <span className="text-sm font-medium text-neutral-200">{displayWeather.location}</span>
          </div>
          <button
            onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
            className="text-xs px-3 py-1.5 rounded-full glass-subtle hover:bg-white/20 transition-all duration-300"
          >
            °C / °F
          </button>
        </div>

        {/* Temperature & Condition - Centered */}
        <div className="flex flex-col items-center justify-center py-6">
          <div className="text-7xl font-extralight tracking-tight mb-1">
            {convertTemp(displayWeather.temperature)}°{unit}
          </div>
          <div className="text-lg text-neutral-300 font-light">{displayWeather.condition}</div>
        </div>

        {/* Weather Icon - Floating */}
        <div className="absolute top-6 right-6 animate-float">
          {getWeatherIcon(displayWeather.condition)}
        </div>

        {/* Details - Bottom */}
        <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-auto">
          <div className="flex items-center gap-2">
            <Droplets size={16} className="text-primary-light opacity-80" />
            <div>
              <div className="text-xs text-neutral-400">Humidity</div>
              <div className="text-sm font-semibold">{displayWeather.humidity}%</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind size={16} className="text-primary-light opacity-80" />
            <div>
              <div className="text-xs text-neutral-400">Wind</div>
              <div className="text-sm font-semibold">{displayWeather.windSpeed} km/h</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Thermometer size={16} className="text-primary-light opacity-80" />
            <div>
              <div className="text-xs text-neutral-400">Feels Like</div>
              <div className="text-sm font-semibold">{convertTemp(displayWeather.feelsLike)}°{unit}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
