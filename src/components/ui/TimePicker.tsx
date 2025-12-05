'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, ChevronUp, ChevronDown, X } from 'lucide-react';

interface TimePickerProps {
  value?: string; // HH:MM format (24-hour)
  onChange?: (time: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  use24Hour?: boolean;
}

type GridMode = 'none' | 'hours' | 'minutes';

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
  const [gridMode, setGridMode] = useState<GridMode>('none');
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);

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
      const dropdownHeight = 350;
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;

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
        setGridMode('none');
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

  const incrementHour = useCallback(() => {
    const maxHours = use24Hour ? 23 : 12;
    const minHours = use24Hour ? 0 : 1;
    setHours(prev => {
      const newHours = prev >= maxHours ? minHours : prev + 1;
      handleTimeChange(newHours, minutes, period);
      return newHours;
    });
  }, [use24Hour, minutes, period, handleTimeChange]);

  const decrementHour = useCallback(() => {
    const maxHours = use24Hour ? 23 : 12;
    const minHours = use24Hour ? 0 : 1;
    setHours(prev => {
      const newHours = prev <= minHours ? maxHours : prev - 1;
      handleTimeChange(newHours, minutes, period);
      return newHours;
    });
  }, [use24Hour, minutes, period, handleTimeChange]);

  const incrementMinute = useCallback(() => {
    setMinutes(prev => {
      const newMinutes = prev >= 59 ? 0 : prev + 1;
      handleTimeChange(hours, newMinutes, period);
      return newMinutes;
    });
  }, [hours, period, handleTimeChange]);

  const decrementMinute = useCallback(() => {
    setMinutes(prev => {
      const newMinutes = prev <= 0 ? 59 : prev - 1;
      handleTimeChange(hours, newMinutes, period);
      return newMinutes;
    });
  }, [hours, period, handleTimeChange]);

  const togglePeriod = useCallback(() => {
    setPeriod(prev => {
      const newPeriod = prev === 'AM' ? 'PM' : 'AM';
      handleTimeChange(hours, minutes, newPeriod);
      return newPeriod;
    });
  }, [hours, minutes, handleTimeChange]);

  const selectHour = useCallback((h: number) => {
    setHours(h);
    handleTimeChange(h, minutes, period);
    setGridMode('none');
  }, [minutes, period, handleTimeChange]);

  const selectMinute = useCallback((m: number) => {
    setMinutes(m);
    handleTimeChange(hours, m, period);
    setGridMode('none');
  }, [hours, period, handleTimeChange]);

  // Mouse wheel handlers
  useEffect(() => {
    const hoursEl = hoursRef.current;
    const minutesEl = minutesRef.current;

    const handleHoursWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        incrementHour();
      } else {
        decrementHour();
      }
    };

    const handleMinutesWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        incrementMinute();
      } else {
        decrementMinute();
      }
    };

    if (hoursEl) {
      hoursEl.addEventListener('wheel', handleHoursWheel, { passive: false });
    }
    if (minutesEl) {
      minutesEl.addEventListener('wheel', handleMinutesWheel, { passive: false });
    }

    return () => {
      if (hoursEl) {
        hoursEl.removeEventListener('wheel', handleHoursWheel);
      }
      if (minutesEl) {
        minutesEl.removeEventListener('wheel', handleMinutesWheel);
      }
    };
  }, [incrementHour, decrementHour, incrementMinute, decrementMinute]);

  // Generate hour options
  const hourOptions = use24Hour 
    ? Array.from({ length: 24 }, (_, i) => i)
    : Array.from({ length: 12 }, (_, i) => i + 1);

  // Generate minute options (0-59)
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);

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
            left-0
          `}
        >
          {/* Main Spinner View */}
          {gridMode === 'none' && (
            <>
              <div className="p-4">
                <p className="text-xs text-neutral-400 text-center mb-3">
                  Use scroll wheel or click numbers for precise selection
                </p>
                <div className="flex items-center justify-center gap-2">
                  {/* Hours */}
                  <div className="flex flex-col items-center" ref={hoursRef}>
                    <button
                      type="button"
                      onClick={incrementHour}
                      className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                      <ChevronUp size={20} className="text-neutral-500" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setGridMode('hours')}
                      className="w-16 h-14 flex items-center justify-center bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors cursor-pointer"
                    >
                      <span className="text-2xl font-bold text-primary">
                        {hours.toString().padStart(2, '0')}
                      </span>
                    </button>
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
                  <div className="flex flex-col items-center" ref={minutesRef}>
                    <button
                      type="button"
                      onClick={incrementMinute}
                      className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                      <ChevronUp size={20} className="text-neutral-500" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setGridMode('minutes')}
                      className="w-16 h-14 flex items-center justify-center bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors cursor-pointer"
                    >
                      <span className="text-2xl font-bold text-primary">
                        {minutes.toString().padStart(2, '0')}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={decrementMinute}
                      className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                      <ChevronDown size={20} className="text-neutral-500" />
                    </button>
                  </div>

                  {/* AM/PM Toggle */}
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
            </>
          )}

          {/* Hours Grid */}
          {gridMode === 'hours' && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-foreground">Select Hour</h4>
                <button
                  type="button"
                  onClick={() => setGridMode('none')}
                  className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <X size={18} className="text-neutral-500" />
                </button>
              </div>
              <div className={`grid ${use24Hour ? 'grid-cols-6' : 'grid-cols-4'} gap-1.5 max-h-[200px] overflow-y-auto`}>
                {hourOptions.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => selectHour(h)}
                    className={`
                      py-2 px-1 text-sm font-medium rounded-lg transition-all
                      ${hours === h 
                        ? 'bg-primary text-white' 
                        : 'bg-neutral-100 text-neutral-700 hover:bg-primary/20 hover:text-primary'
                      }
                    `}
                  >
                    {h.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Minutes Grid */}
          {gridMode === 'minutes' && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-foreground">Select Minute</h4>
                <button
                  type="button"
                  onClick={() => setGridMode('none')}
                  className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <X size={18} className="text-neutral-500" />
                </button>
              </div>
              <div className="grid grid-cols-6 gap-1.5 max-h-[240px] overflow-y-auto">
                {minuteOptions.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => selectMinute(m)}
                    className={`
                      py-2 px-1 text-sm font-medium rounded-lg transition-all
                      ${minutes === m 
                        ? 'bg-primary text-white' 
                        : 'bg-neutral-100 text-neutral-700 hover:bg-primary/20 hover:text-primary'
                      }
                    `}
                  >
                    {m.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimePicker;
