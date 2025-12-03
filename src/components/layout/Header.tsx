'use client';

import React from 'react';
import { Menu, X, Settings, Leaf } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMenuOpen }) => {
  const navItems = [
    { label: 'Home', href: '/home' },
    { label: 'Journal', href: '/journal' },
    { label: 'Tasks', href: '/tasks' },
    { label: 'Insights', href: '/insights' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Menu Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-xl hover:bg-primary-muted transition-colors lg:hidden text-foreground"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link href="/home" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <Leaf size={20} className="text-white" />
              </div>
              <span className="font-bold text-xl hidden sm:block text-foreground">Digital Diary</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-neutral-100 rounded-full px-2 py-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-5 py-2 rounded-full text-sm font-medium text-neutral-600 hover:text-primary hover:bg-white transition-colors duration-150"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/settings"
              className="p-2.5 rounded-xl hover:bg-primary-muted transition-colors text-neutral-600 hover:text-primary"
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
