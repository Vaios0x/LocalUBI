'use client';

import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Users, Star, Clock, Shield } from 'lucide-react';
import { UBICalculation } from '@/lib/gooddollar-enhanced';
import { cn } from '@/lib/utils';

interface UBICalculatorProps {
  calculation: UBICalculation;
  className?: string;
  showDetails?: boolean;
}

export function UBICalculator({ 
  calculation, 
  className,
  showDetails = true 
}: UBICalculatorProps) {
  const getMultiplierColor = (multiplier: number) => {
    if (multiplier >= 2.0) return 'text-green-400';
    if (multiplier >= 1.5) return 'text-blue-400';
    if (multiplier >= 1.0) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getMultiplierLabel = (multiplier: number) => {
    if (multiplier >= 2.0) return 'Excelente';
    if (multiplier >= 1.5) return 'Muy Bueno';
    if (multiplier >= 1.0) return 'Bueno';
    return 'Básico';
  };

  const totalMultiplier = calculation.finalAmount / calculation.baseAmount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6',
        'hover:bg-white/15 transition-all duration-300',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Calculator className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Calculadora UBI</h3>
            <p className="text-sm text-white/70">Cálculo personalizado de UBI</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            {calculation.finalAmount} G$
          </div>
          <div className={cn(
            'text-sm font-medium',
            getMultiplierColor(totalMultiplier)
          )}>
            {getMultiplierLabel(totalMultiplier)}
          </div>
        </div>
      </div>

      {/* Base Amount */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/70">UBI Base</span>
          <span className="text-sm font-medium text-white">{calculation.baseAmount} G$</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" />
        </div>
      </div>

      {/* Multipliers */}
      {showDetails && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-white/80 mb-3">Multiplicadores</h4>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Reputation Multiplier */}
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-white/70">Reputación</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white">
                  {calculation.reputationMultiplier.toFixed(2)}x
                </span>
                <div className="w-16 bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${Math.min(calculation.reputationMultiplier * 50, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Streak Multiplier */}
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-green-400" />
                <span className="text-xs text-white/70">Racha</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white">
                  {calculation.streakMultiplier.toFixed(2)}x
                </span>
                <div className="w-16 bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-green-400 h-2 rounded-full"
                    style={{ width: `${Math.min(calculation.streakMultiplier * 66.67, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Community Multiplier */}
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-white/70">Comunidad</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white">
                  {calculation.communityMultiplier.toFixed(2)}x
                </span>
                <div className="w-16 bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-purple-400 h-2 rounded-full"
                    style={{ width: `${Math.min(calculation.communityMultiplier * 76.92, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Total Multiplier */}
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-white/70">Total</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white">
                  {totalMultiplier.toFixed(2)}x
                </span>
                <div className="w-16 bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-blue-400 h-2 rounded-full"
                    style={{ width: `${Math.min(totalMultiplier * 33.33, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Breakdown */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <h4 className="text-sm font-medium text-white/80 mb-3">Desglose de Factores</h4>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">Factor Reputación</span>
            <span className="text-white">
              {calculation.factors.reputation.toFixed(2)}x
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">Factor Racha</span>
            <span className="text-white">
              {calculation.factors.streak.toFixed(2)}x
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">Factor Comunidad</span>
            <span className="text-white">
              {calculation.factors.community.toFixed(2)}x
            </span>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center space-x-2 text-xs text-white/60">
          <Shield className="w-4 h-4" />
          <span>Cálculo realizado con privacidad total usando Nillion Network</span>
        </div>
      </div>
    </motion.div>
  );
}
