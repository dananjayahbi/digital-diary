'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';

interface TimePickerProps {
  value?: string; // HH:MM format (24-hour)
  onChange?: (time: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  use24Hour?: boolean;
}

const TimePicker: React.FC<TimePickerProps> = ({
  value = '',
  onChange,
  label,
  placeholder = 'Select time',
  disabled = false,
  className = '',
  use24Hour = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState(9);
  const [minutes, setMinutes] = useState(0);
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse value into hours, minutes, period
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':').map(Number);
      if (!isNaN(h) && !isNaN(m)) {
        if (use24Hour) {
          setHours(h);
        } else {
          const hour12 = h % 12 || 12;
          setHours(hour12);
          setPeriod(h >= 12 ? 'PM' : 'AM');
        }
        setMinutes(m);
      }
    }
  }, [value, use24Hour]);

  // Calculate dropdown position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = 420; // Approximate height of the dropdown
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;

      // If not enough space below but more space above, position on top
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTimeDisplay = useCallback(() => {
    if (!value) return '';
    const [h, m] = value.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return '';

    if (use24Hour) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }

    const hour12 = h % 12 || 12;
    const periodStr = h >= 12 ? 'PM' : 'AM';
    return `${hour12}:${m.toString().padStart(2, '0')} ${periodStr}`;
  }, [value, use24Hour]);

  const handleTimeChange = useCallback((newHours: number, newMinutes: number, newPeriod: 'AM' | 'PM') => {
    let hour24 = newHours;
    
    if (!use24Hour) {
      if (newPeriod === 'AM') {
        hour24 = newHours === 12 ? 0 : newHours;
      } else {
        hour24 = newHours === 12 ? 12 : newHours + 12;
      }
    }

    const timeString = `${hour24.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
    onChange?.(timeString);
  }, [onChange, use24Hour]);

  const incrementHour = () => {
    const maxHours = use24Hour ? 23 : 12;
    const minHours = use24Hour ? 0 : 1;
    const newHours = hours >= maxHours ? minHours : hours + 1;
    setHours(newHours);
    handleTimeChange(newHours, minutes, period);
  };

  const decrementHour = () => {
    const maxHours = use24Hour ? 23 : 12;
    const minHours = use24Hour ? 0 : 1;
    const newHours = hours <= minHours ? maxHours : hours - 1;
    setHours(newHours);
    handleTimeChange(newHours, minutes, period);
  };

  const incrementMinute = () => {
    const newMinutes = minutes >= 55 ? 0 : minutes + 5;
    setMinutes(newMinutes);
    handleTimeChange(hours, newMinutes, period);
  };

  const decrementMinute = () => {
    const newMinutes = minutes <= 0 ? 55 : minutes - 5;
    setMinutes(newMinutes);
    handleTimeChange(hours, newMinutes, period);
  };

  const togglePeriod = () => {
    const newPeriod = period === 'AM' ? 'PM' : 'AM';
    setPeriod(newPeriod);
    handleTimeChange(hours, minutes, newPeriod);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}

      {/* Input Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between gap-2 px-4 py-3 
          bg-white border border-neutral-200 rounded-xl
          text-left transition-all duration-200
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
          }
          ${isOpen ? 'ring-2 ring-primary/20 border-primary' : ''}
        `}
      >
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-neutral-400" />
          <span className={value ? 'text-foreground' : 'text-neutral-400'}>
            {value ? formatTimeDisplay() : placeholder}
          </span>
        </div>
        <ChevronDown 
          size={18} 
          className={`text-neutral-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className={`
            absolute z-50 min-w-[280px] w-max bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden animate-fadeIn
            ${dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
            max-h-[400px] overflow-y-auto left-0
          `}
        >
          {/* Time Spinner */}
          <div className="p-4">
            <div className="flex items-center justify-center gap-2">
              {/* Hours */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={incrementHour}
                  className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <ChevronUp size={20} className="text-neutral-500" />
                </button>
                <div className="w-16 h-14 flex items-center justify-center bg-primary/10 rounded-xl">
                  <span className="text-2xl font-bold text-primary">
                    {hours.toString().padStart(2, '0')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={decrementHour}
                  className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <ChevronDown size={20} className="text-neutral-500" />
                </button>
              </div>

              <span className="text-2xl font-bold text-neutral-300 mx-1">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={incrementMinute}
                  className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <ChevronUp size={20} className="text-neutral-500" />
                </button>
                <div className="w-16 h-14 flex items-center justify-center bg-primary/10 rounded-xl">
                  <span className="text-2xl font-bold text-primary">
                    {minutes.toString().padStart(2, '0')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={decrementMinute}
                  className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <ChevronDown size={20} className="text-neutral-500" />
                </button>
              </div>

              {/* AM/PM Toggle (only in 12-hour mode) */}
              {!use24Hour && (
                <div className="flex flex-col items-center ml-2">
                  <button
                    type="button"
                    onClick={togglePeriod}
                    className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                  >
                    <ChevronUp size={20} className="text-neutral-500" />
                  </button>
                  <div className="w-14 h-14 flex items-center justify-center bg-primary/10 rounded-xl">
                    <span className="text-lg font-bold text-primary">{period}</span>
                  </div>
                  <button
                    type="button"
                    onClick={togglePeriod}
                    className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                  >
                    <ChevronDown size={20} className="text-neutral-500" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Done Button */}
          <div className="border-t border-neutral-100 p-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimePicker;
