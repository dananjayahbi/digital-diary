'use client';

import React from 'react';
import { MapPin, Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets, Thermometer } from 'lucide-react';
import type { WeatherData } from '@/types';
import { Card } from '@/components/ui';

interface WeatherWidgetProps {
  weather?: WeatherData | null;
  isLoading?: boolean;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather, isLoading }) => {
  const [unit, setUnit] = React.useState<'C' | 'F'>('C');

  const getWeatherIcon = (condition: string) => {
    const iconSize = 48;
    const iconProps = { size: iconSize, className: 'text-white drop-shadow-lg' };
    
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
        return <Sun {...iconProps} />;
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
    location: 'Your Location',
    icon: 'cloudy',
  };

  const displayWeather = weather || defaultWeather;

  if (isLoading) {
    return (
      <Card variant="glass" className="overflow-hidden">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-24 bg-neutral-200 rounded" />
          <div className="h-12 w-32 bg-neutral-200 rounded" />
          <div className="flex gap-4">
            <div className="h-4 w-16 bg-neutral-200 rounded" />
            <div className="h-4 w-16 bg-neutral-200 rounded" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      variant="glass"
      padding="none"
      className="overflow-hidden relative"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-task-blue/80 to-primary/80" />
      
      <div className="relative p-5 text-white">
        {/* Location & Unit Toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} />
            <span className="text-sm font-medium">{displayWeather.location}</span>
          </div>
          <button
            onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
            className="text-xs px-2 py-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            °{unit === 'C' ? 'C' : 'F'} / °{unit === 'C' ? 'F' : 'C'}
          </button>
        </div>

        {/* Temperature & Icon */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-5xl font-light">
              {convertTemp(displayWeather.temperature)}°{unit}
            </div>
            <div className="text-sm opacity-90 mt-1">{displayWeather.condition}</div>
          </div>
          {getWeatherIcon(displayWeather.condition)}
        </div>

        {/* Details */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/20">
          <div className="text-center">
            <Droplets size={16} className="mx-auto mb-1 opacity-80" />
            <div className="text-xs opacity-80">Humidity</div>
            <div className="text-sm font-medium">{displayWeather.humidity}%</div>
          </div>
          <div className="text-center">
            <Wind size={16} className="mx-auto mb-1 opacity-80" />
            <div className="text-xs opacity-80">Wind</div>
            <div className="text-sm font-medium">{displayWeather.windSpeed} km/h</div>
          </div>
          <div className="text-center">
            <Thermometer size={16} className="mx-auto mb-1 opacity-80" />
            <div className="text-xs opacity-80">Feels Like</div>
            <div className="text-sm font-medium">{convertTemp(displayWeather.feelsLike)}°{unit}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WeatherWidget;
