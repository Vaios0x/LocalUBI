'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Smartphone, Wifi } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { InteractiveButton } from '@/components/ui/InteractiveButton';

export function PWAInstallBanner() {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show banner if installable and not dismissed
    if (isInstallable && !isInstalled && !isDismissed) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isInstallable, isInstalled, isDismissed]);

  const handleInstall = async () => {
    await installApp();
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    // Store dismissal in localStorage
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  useEffect(() => {
    // Check if banner was previously dismissed
    const dismissed = localStorage.getItem('pwa-banner-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-green-500/90 to-emerald-600/90 backdrop-blur-md border-b border-white/20"
        style={{ '--banner-height': '60px' } as React.CSSProperties}
      >
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <Wifi className="w-3 h-3 sm:w-4 sm:h-4 text-white/80" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white font-semibold text-xs sm:text-sm truncate">
                  Instala LocalUBI en tu dispositivo
                </p>
                <p className="text-white/80 text-xs hidden sm:block">
                  Acceso rápido, notificaciones y funciona offline
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <InteractiveButton
                onClick={handleInstall}
                size="sm"
                variant="glass"
                className="text-xs px-2 sm:px-3 py-1"
                icon={<Download className="w-3 h-3" />}
              >
                <span className="hidden sm:inline">Instalar</span>
                <span className="sm:hidden">+</span>
              </InteractiveButton>
              
              <button
                onClick={handleDismiss}
                className="p-1 text-white/60 hover:text-white transition-colors rounded"
                aria-label="Cerrar banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
