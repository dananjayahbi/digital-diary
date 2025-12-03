'use client';

import React, { useState } from 'react';
import { Menu, X, Sun, Moon, Settings, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMenuOpen }) => {
  const [isDark, setIsDark] = useState(true);

  const navItems = [
    { label: 'Home', href: '/home' },
    { label: 'Journal', href: '/journal' },
    { label: 'Tasks', href: '/tasks' },
    { label: 'Insights', href: '/insights' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-dark">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Menu Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors lg:hidden text-white"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link href="/home" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
                <Sparkles size={20} className="text-white" />
              </div>
              <span className="font-bold text-xl hidden sm:block text-gradient">Digital Diary</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 glass-subtle rounded-full px-2 py-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-5 py-2 rounded-full text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 rounded-xl hover:bg-white/10 transition-colors text-neutral-300 hover:text-white"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link
              href="/settings"
              className="p-2.5 rounded-xl hover:bg-white/10 transition-colors text-neutral-300 hover:text-white"
              aria-label="Settings"
            >
              <Settings size={20} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
