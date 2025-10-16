'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface PrivacyShieldProps {
  isActive: boolean;
  privacyLevel: 'basic' | 'enhanced' | 'maximum';
  onToggle?: (isActive: boolean) => void;
  className?: string;
  showDetails?: boolean;
}

export function PrivacyShield({ 
  isActive, 
  privacyLevel, 
  onToggle,
  className,
  showDetails = true 
}: PrivacyShieldProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPrivacyConfig = () => {
    switch (privacyLevel) {
      case 'basic':
        return {
          icon: <Eye className="w-5 h-5" />,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-400/30',
          label: 'Básico',
          description: 'Datos mínimos compartidos',
          features: ['Encriptación básica', 'Datos anónimos']
        };
      case 'enhanced':
        return {
          icon: <Shield className="w-5 h-5" />,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-400/30',
          label: 'Mejorado',
          description: 'Protección avanzada',
          features: ['Encriptación end-to-end', 'Computación privada', 'Datos seudonimizados']
        };
      case 'maximum':
        return {
          icon: <Lock className="w-5 h-5" />,
          color: 'text-green-400',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-400/30',
          label: 'Máximo',
          description: 'Privacidad total',
          features: ['Zero-knowledge proofs', 'Computación distribuida', 'Datos completamente privados']
        };
    }
  };

  const config = getPrivacyConfig();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative overflow-hidden',
        className
      )}
    >
      {/* Main Shield */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'bg-white/10 backdrop-blur-lg border rounded-2xl p-4 cursor-pointer transition-all duration-300',
          isActive ? config.borderColor : 'border-white/20',
          isActive ? 'bg-white/15' : 'hover:bg-white/15'
        )}
        onClick={() => onToggle?.(!isActive)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ 
                scale: isActive ? 1.1 : 1,
                rotate: isActive ? 360 : 0
              }}
              transition={{ duration: 0.3 }}
              className={cn(
                'p-2 rounded-full',
                isActive ? config.bgColor : 'bg-white/10',
                isActive ? config.color : 'text-white/50'
              )}
            >
              {isActive ? config.icon : <EyeOff className="w-5 h-5" />}
            </motion.div>
            
            <div>
              <h3 className="text-sm font-semibold text-white">
                Privacidad {config.label}
              </h3>
              <p className="text-xs text-white/70">
                {isActive ? config.description : 'Privacidad desactivada'}
              </p>
            </div>
          </div>

          <motion.div
            animate={{ scale: isActive ? 1 : 0.8 }}
            className={cn(
              'w-6 h-6 rounded-full border-2 flex items-center justify-center',
              isActive ? 'border-green-400 bg-green-400' : 'border-white/30'
            )}
          >
            {isActive && <CheckCircle className="w-4 h-4 text-white" />}
          </motion.div>
        </div>

        {/* Status Indicator */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isActive ? '100%' : '0%' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={cn(
            'h-1 mt-3 rounded-full',
            config.color.replace('text-', 'bg-')
          )}
        />

        {/* Expand Button */}
        {showDetails && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="mt-3 w-full text-xs text-white/60 hover:text-white/80 transition-colors"
          >
            {isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
          </button>
        )}
      </motion.div>

      {/* Expanded Details */}
      {isExpanded && showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-3 bg-white/5 rounded-lg p-4 space-y-3"
        >
          <h4 className="text-sm font-medium text-white/80">Características de Privacidad</h4>
          
          <div className="space-y-2">
            {config.features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-sm text-white/70">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* Privacy Level Indicator */}
          <div className="pt-3 border-t border-white/10">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>Nivel de Privacidad</span>
              <div className="flex space-x-1">
                {['basic', 'enhanced', 'maximum'].map((level, index) => (
                  <div
                    key={level}
                    className={cn(
                      'w-2 h-2 rounded-full',
                      privacyLevel === level ? config.color.replace('text-', 'bg-') : 'bg-white/20'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Active State Overlay */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className={cn(
            'absolute inset-0 rounded-2xl border-2 border-dashed opacity-30',
            config.borderColor
          )} />
        </motion.div>
      )}
    </motion.div>
  );
}
