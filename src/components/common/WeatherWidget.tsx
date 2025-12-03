'use client';

import React from 'react';
import { MapPin, Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets, Thermometer } from 'lucide-react';
import { SkeletonWeatherWidget } from '@/components/ui';
import type { WeatherData } from '@/types';

interface WeatherWidgetProps {
  weather?: WeatherData | null;
  isLoading?: boolean;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather, isLoading }) => {
  const [unit, setUnit] = React.useState<'C' | 'F'>('C');

  const getWeatherIcon = (condition: string) => {
    const iconSize = 40;
    const iconProps = { size: iconSize, className: 'text-primary' };
    
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
    return <SkeletonWeatherWidget />;
  }

  return (
    <div className="glass rounded-2xl p-5">
      {/* Location & Unit Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-primary" />
          <span className="text-sm font-medium text-neutral-600">{displayWeather.location}</span>
        </div>
        <button
          onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
          className="text-xs px-3 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors text-neutral-600"
        >
          °{unit === 'C' ? 'F' : 'C'}
        </button>
      </div>

      {/* Temperature & Icon */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-5xl font-bold text-foreground">
            {convertTemp(displayWeather.temperature)}°{unit}
          </div>
          <div className="text-sm text-neutral-500 mt-1">{displayWeather.condition}</div>
        </div>
        <div className="w-16 h-16 rounded-full bg-primary-muted flex items-center justify-center">
          {getWeatherIcon(displayWeather.condition)}
        </div>
      </div>

      {/* Details */}
      <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
        <div className="flex items-center gap-2">
          <Droplets size={14} className="text-primary" />
          <span className="text-sm text-neutral-600">{displayWeather.humidity}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Wind size={14} className="text-primary" />
          <span className="text-sm text-neutral-600">{displayWeather.windSpeed} km/h</span>
        </div>
        <div className="flex items-center gap-2">
          <Thermometer size={14} className="text-primary" />
          <span className="text-sm text-neutral-600">{convertTemp(displayWeather.feelsLike)}°</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
