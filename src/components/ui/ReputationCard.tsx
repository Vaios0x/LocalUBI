'use client';

import { motion } from 'framer-motion';
import { Shield, TrendingUp, Users, Clock, Star } from 'lucide-react';
import { ReputationData } from '@/lib/nillion';
import { cn } from '@/lib/utils';

interface ReputationCardProps {
  reputationData: ReputationData;
  className?: string;
  showDetails?: boolean;
}

export function ReputationCard({ 
  reputationData, 
  className,
  showDetails = true 
}: ReputationCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excelente';
    if (score >= 80) return 'Muy Bueno';
    if (score >= 70) return 'Bueno';
    if (score >= 60) return 'Regular';
    if (score >= 40) return 'Necesita Mejorar';
    return 'Bajo';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <Star className="w-5 h-5 text-yellow-400" />;
    if (score >= 60) return <TrendingUp className="w-5 h-5 text-blue-400" />;
    return <Shield className="w-5 h-5 text-gray-400" />;
  };

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
          {getScoreIcon(reputationData.score)}
          <div>
            <h3 className="text-lg font-semibold text-white">Score de Reputación</h3>
            <p className="text-sm text-white/70">
              Actualizado {new Date(reputationData.lastUpdated).toLocaleDateString('es-MX')}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className={cn(
            'text-3xl font-bold',
            getScoreColor(reputationData.score)
          )}>
            {reputationData.score}
          </div>
          <div className="text-sm text-white/70">
            {getScoreLabel(reputationData.score)}
          </div>
        </div>
      </div>

      {/* Score Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-white/70 mb-2">
          <span>Progreso</span>
          <span>{reputationData.score}/100</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${reputationData.score}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className={cn(
              'h-full rounded-full transition-all duration-300',
              reputationData.score >= 80 ? 'bg-gradient-to-r from-green-400 to-green-500' :
              reputationData.score >= 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
              reputationData.score >= 40 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
              'bg-gradient-to-r from-red-400 to-red-500'
            )}
          />
        </div>
      </div>

      {/* Detailed Factors */}
      {showDetails && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-white/80 mb-3">Factores de Reputación</h4>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Tanda Participation */}
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-white/70">Participación en Tandas</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white">
                  {reputationData.factors.tandaParticipation}%
                </span>
                <div className="w-16 bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-blue-400 h-2 rounded-full"
                    style={{ width: `${reputationData.factors.tandaParticipation}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Payment Reliability */}
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-green-400" />
                <span className="text-xs text-white/70">Pagos a Tiempo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white">
                  {reputationData.factors.paymentReliability}%
                </span>
                <div className="w-16 bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-green-400 h-2 rounded-full"
                    style={{ width: `${reputationData.factors.paymentReliability}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Community Contribution */}
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-white/70">Contribución Comunitaria</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white">
                  {reputationData.factors.communityContribution}%
                </span>
                <div className="w-16 bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-purple-400 h-2 rounded-full"
                    style={{ width: `${reputationData.factors.communityContribution}%` }}
                  />
                </div>
              </div>
            </div>

            {/* UBI Claim Consistency */}
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-white/70">Consistencia UBI</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white">
                  {reputationData.factors.ubiClaimConsistency}%
                </span>
                <div className="w-16 bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${reputationData.factors.ubiClaimConsistency}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Benefits based on score */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <h4 className="text-sm font-medium text-white/80 mb-2">Beneficios Desbloqueados</h4>
        <div className="flex flex-wrap gap-2">
          {reputationData.score >= 50 && (
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
              Acceso a Tandas Premium
            </span>
          )}
          {reputationData.score >= 70 && (
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
              UBI Multiplicado
            </span>
          )}
          {reputationData.score >= 90 && (
            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
              Líder de Comunidad
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
