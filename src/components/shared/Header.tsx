'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ConnectButton } from '@/components/wallet/ConnectButton';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Navegación principal (siempre visible)
  const mainNavigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Claim UBI', href: '/claim' },
    { name: 'Tandas', href: '/tanda' },
    { name: 'Marketplace', href: '/marketplace' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Civic Tech', href: '/civic-tech' },
  ];

  // Navegación secundaria (en dropdown)
  const secondaryNavigation = [
    { name: 'Claim Enhanced', href: '/claim-enhanced' },
    { name: 'Rental Proof', href: '/rental-proof' },
    { name: 'GPU Proof', href: '/gpu-proof' },
    { name: 'Anonymous', href: '/anonymous-publishing' },
    { name: 'AI Privacy', href: '/ai-privacy' },
    { name: 'Human Passport', href: '/human-passport' },
    { name: 'Tor Infrastructure', href: '/tor-infrastructure' },
    { name: 'Activist Tech', href: '/activist-tech' },
  ];

  // Todas las navegaciones combinadas
  const allNavigation = [...mainNavigation, ...secondaryNavigation];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-xl font-bold text-gradient">LocalUBI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-3">
            {mainNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Dropdown para navegación secundaria */}
            <div className="relative group">
              <button className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium flex items-center gap-1 whitespace-nowrap">
                Más
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-lg border border-white/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  <div className="grid grid-cols-2 gap-1">
                    {secondaryNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Large Desktop Navigation (lg to xl) */}
          <nav className="hidden lg:flex xl:hidden items-center gap-2">
            {mainNavigation.slice(0, 4).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Dropdown para navegación secundaria */}
            <div className="relative group">
              <button className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium flex items-center gap-1 whitespace-nowrap">
                Más
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-lg border border-white/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  <div className="grid grid-cols-2 gap-1">
                    {[...mainNavigation.slice(4), ...secondaryNavigation].map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Tablet Navigation (md to lg) */}
          <nav className="hidden md:flex lg:hidden items-center gap-2">
            {mainNavigation.slice(0, 4).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
            <div className="relative group">
              <button className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium whitespace-nowrap">
                ⋯
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-lg border border-white/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  <div className="grid grid-cols-2 gap-1">
                    {[...mainNavigation.slice(4), ...secondaryNavigation].map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Desktop Connect Button */}
          <div className="hidden md:block">
            <ConnectButton />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 p-4 rounded-lg glass-morphism max-h-96 overflow-y-auto"
          >
            <nav className="flex flex-col gap-2">
              {/* Navegación principal */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-white/80 mb-2">Principal</h3>
                {mainNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-muted-foreground hover:text-foreground transition-colors py-2 px-3 rounded-md hover:bg-white/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              
              {/* Navegación secundaria */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-white/80 mb-2">Tracks del Hackathon</h3>
                <div className="grid grid-cols-1 gap-1">
                  {secondaryNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block text-muted-foreground hover:text-foreground transition-colors py-2 px-3 rounded-md hover:bg-white/10 text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-muted">
                <ConnectButton />
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
}
