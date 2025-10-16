'use client';

import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle, Clock, Brain } from 'lucide-react';
import { PrivateComputation } from '@/lib/nillion';
import { cn } from '@/lib/utils';

interface ComputationStatusProps {
  computation: PrivateComputation;
  className?: string;
  showProgress?: boolean;
}

export function ComputationStatus({ 
  computation, 
  className,
  showProgress = true 
}: ComputationStatusProps) {
  const getStatusConfig = () => {
    switch (computation.status) {
      case 'pending':
        return {
          icon: <Loader2 className="w-5 h-5 animate-spin" />,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-400/30',
          label: 'Procesando',
          description: 'Ejecutando computación privada...'
        };
      case 'completed':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          color: 'text-green-400',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-400/30',
          label: 'Completado',
          description: 'Computación finalizada exitosamente'
        };
      case 'failed':
        return {
          icon: <XCircle className="w-5 h-5" />,
          color: 'text-red-400',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-400/30',
          label: 'Error',
          description: 'La computación falló'
        };
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'reputation_score':
        return 'Cálculo de Reputación';
      case 'tanda_verification':
        return 'Verificación de Tanda';
      case 'ubi_calculation':
        return 'Distribución de UBI';
      default:
        return 'Computación Privada';
    }
  };

  const getProgress = () => {
    if (computation.status === 'completed') return 100;
    if (computation.status === 'failed') return 0;
    
    // Simular progreso basado en tiempo transcurrido
    const elapsed = Date.now() - computation.createdAt.getTime();
    const maxTime = 10000; // 10 segundos máximo
    return Math.min((elapsed / maxTime) * 100, 90);
  };

  const config = getStatusConfig();
  const progress = getProgress();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'bg-white/10 backdrop-blur-lg border rounded-xl p-4',
        config.borderColor,
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ scale: computation.status === 'pending' ? [1, 1.1, 1] : 1 }}
            transition={{ 
              duration: 2, 
              repeat: computation.status === 'pending' ? Infinity : 0 
            }}
            className={cn(
              'p-2 rounded-full',
              config.bgColor,
              config.color
            )}
          >
            {config.icon}
          </motion.div>
          
          <div>
            <h4 className="text-sm font-semibold text-white">
              {getTypeLabel(computation.type)}
            </h4>
            <p className="text-xs text-white/70">
              {config.description}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className={cn('text-xs font-medium', config.color)}>
            {config.label}
          </div>
          <div className="text-xs text-white/60">
            ID: {computation.id.slice(-8)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {showProgress && computation.status === 'pending' && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-white/70 mb-1">
            <span>Progreso</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
            />
          </div>
        </div>
      )}

      {/* Details */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/60">Iniciado:</span>
          <span className="text-white/80">
            {computation.createdAt.toLocaleTimeString('es-MX')}
          </span>
        </div>

        {computation.completedAt && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/60">Completado:</span>
            <span className="text-white/80">
              {computation.completedAt.toLocaleTimeString('es-MX')}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-xs">
          <span className="text-white/60">Duración:</span>
          <span className="text-white/80">
            {computation.completedAt 
              ? `${Math.round((computation.completedAt.getTime() - computation.createdAt.getTime()) / 1000)}s`
              : `${Math.round((Date.now() - computation.createdAt.getTime()) / 1000)}s`
            }
          </span>
        </div>
      </div>

      {/* Network Status */}
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-white/60">Nillion Network</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-green-400">Conectado</span>
          </div>
        </div>
      </div>

      {/* Output Preview */}
      {computation.status === 'completed' && computation.outputs && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-3 pt-3 border-t border-white/10"
        >
          <div className="text-xs text-white/60 mb-2">Resultados:</div>
          <div className="bg-white/5 rounded-lg p-2 text-xs text-white/80 font-mono">
            {JSON.stringify(computation.outputs, null, 2).slice(0, 100)}
            {JSON.stringify(computation.outputs).length > 100 && '...'}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
