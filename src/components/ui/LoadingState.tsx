'use client';

import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  state: 'loading' | 'success' | 'error' | 'empty';
  message?: string;
  description?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({ 
  state, 
  message, 
  description, 
  className,
  size = 'md' 
}: LoadingStateProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-6 h-6';
      case 'lg':
        return 'w-12 h-12';
      default:
        return 'w-8 h-8';
    }
  };

  const getTextSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  const getIcon = () => {
    switch (state) {
      case 'loading':
        return <Loader2 className={cn(getSizeClasses(), 'animate-spin text-green-500')} />;
      case 'success':
        return <CheckCircle className={cn(getSizeClasses(), 'text-green-500')} />;
      case 'error':
        return <XCircle className={cn(getSizeClasses(), 'text-red-500')} />;
      case 'empty':
        return <AlertCircle className={cn(getSizeClasses(), 'text-yellow-500')} />;
      default:
        return <Loader2 className={cn(getSizeClasses(), 'animate-spin text-green-500')} />;
    }
  };

  const getMessage = () => {
    if (message) return message;
    
    switch (state) {
      case 'loading':
        return 'Cargando...';
      case 'success':
        return '¡Completado!';
      case 'error':
        return 'Error al cargar';
      case 'empty':
        return 'No hay datos disponibles';
      default:
        return 'Cargando...';
    }
  };

  const getDescription = () => {
    if (description) return description;
    
    switch (state) {
      case 'loading':
        return 'Por favor espera mientras procesamos tu solicitud';
      case 'success':
        return 'La operación se completó exitosamente';
      case 'error':
        return 'Ocurrió un error. Por favor intenta de nuevo';
      case 'empty':
        return 'No se encontraron resultados para mostrar';
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center',
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={getMessage()}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="mb-4"
      >
        {getIcon()}
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className={cn(
          'font-semibold text-white mb-2',
          getTextSizeClasses()
        )}
      >
        {getMessage()}
      </motion.h3>
      
      {getDescription() && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className={cn(
            'text-white/70 max-w-md',
            size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
          )}
        >
          {getDescription()}
        </motion.p>
      )}
    </motion.div>
  );
}
