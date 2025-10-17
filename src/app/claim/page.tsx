'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/effects/GlassCard';
import { Button } from '@/components/ui/button';
import { useGoodDollar } from '@/hooks/useGoodDollar';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { 
  Gift, 
  Sparkles, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Coins
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ClaimPage() {
  const {
    dailyUBI,
    canClaim,
    claiming,
    claimUBI,
    claimHistory,
    totalClaimed,
    nextClaimTime,
    streak
  } = useGoodDollar();
  
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClaim = async () => {
    try {
      await claimUBI();
      setShowSuccess(true);
      
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.5, y: 0.6 },
        colors: ['#10b981', '#059669', '#047857']
      });
      
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Error claiming UBI:', error);
    }
  };

  const weeklyStats = {
    claimed: claimHistory.filter(c => 
      c.date > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length,
    total: 7,
    percentage: 0
  };
  weeklyStats.percentage = (weeklyStats.claimed / weeklyStats.total) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <Header />
      <div className="p-4 md:p-6 lg:p-8 pt-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <motion.h1 
            className="text-4xl font-bold text-gradient"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Claim tu UBI Diario
          </motion.h1>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Ingreso Básico Universal powered by GoodDollar
          </motion.p>
        </div>

        {/* Main Claim Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard variant="strong" className="p-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-500 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              {/* Amount Display */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-4 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 mb-4">
                  <Gift className="w-12 h-12 text-green-500" />
                </div>
                
                <AnimatePresence mode="wait">
                  {canClaim ? (
                    <motion.div
                      key="available"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <h2 className="text-5xl font-bold mb-2">
                        {dailyUBI} G$
                      </h2>
                      <p className="text-muted-foreground">disponible para claim</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="claimed"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <h2 className="text-3xl font-bold mb-2 text-muted-foreground">
                        Ya reclamado hoy
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Próximo claim {formatDistanceToNow(nextClaimTime || new Date(), { 
                          addSuffix: true, 
                          locale: es 
                        })}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Claim Button */}
              <div className="flex justify-center mb-8">
                <Button
                  size="lg"
                  onClick={handleClaim}
                  disabled={!canClaim || claiming}
                  className="relative overflow-hidden group px-8 py-6 text-lg"
                >
                  {claiming ? (
                    <>
                      <div className="animate-spin mr-2">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      Procesando...
                    </>
                  ) : canClaim ? (
                    <>
                      <Gift className="mr-2 w-5 h-5" />
                      Claim UBI Ahora
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </>
                  ) : (
                    <>
                      <Clock className="mr-2 w-5 h-5" />
                      Esperar {formatDistanceToNow(nextClaimTime || new Date(), { locale: es })}
                    </>
                  )}
                </Button>
              </div>

              {/* Streak Counter */}
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-600 px-4 py-2 rounded-full">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-semibold">{streak} días de racha</span>
                  <span className="text-2xl">🔥</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Success Animation */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <div className="bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
                <CheckCircle className="w-6 h-6" />
                <span className="font-semibold text-lg">¡{dailyUBI} G$ reclamados!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reclamado</p>
                <p className="text-2xl font-bold mt-1">{totalClaimed} G$</p>
                <p className="text-xs text-muted-foreground mt-1">
                  ≈ ${(totalClaimed * 0.01).toFixed(2)} USD
                </p>
              </div>
              <Coins className="w-8 h-8 text-green-500" />
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Esta Semana</p>
                <p className="text-2xl font-bold mt-1">{weeklyStats.claimed}/7</p>
                <div className="mt-2">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                      style={{ width: `${weeklyStats.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mejor Racha</p>
                <p className="text-2xl font-bold mt-1">{streak * 2} días</p>
                <p className="text-xs text-green-500 mt-1">
                  Sigue así 💪
                </p>
              </div>
              <div className="text-3xl">🏆</div>
            </div>
          </GlassCard>
        </div>

        {/* History */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">Historial de Claims</h2>
          
          {claimHistory.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Aún no has reclamado UBI</p>
            </div>
          ) : (
            <div className="space-y-2">
              {claimHistory.slice(0, 10).map((claim, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/20 text-green-500">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium">{claim.amount} G$ reclamados</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(claim.date, { addSuffix: true, locale: es })}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {claim.txHash?.slice(0, 6)}...{claim.txHash?.slice(-4)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Info Card */}
        <GlassCard className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
          <div className="flex gap-4">
            <AlertCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="font-semibold">¿Qué es el UBI?</h3>
              <p className="text-sm text-muted-foreground">
                El Ingreso Básico Universal (UBI) es una forma de distribución de riqueza donde cada persona 
                recibe una cantidad fija de dinero regularmente. GoodDollar distribuye G$ tokens diariamente 
                a todos los usuarios verificados, promoviendo la inclusión financiera global.
              </p>
              <p className="text-sm text-muted-foreground">
                Puedes usar tus G$ para participar en tandas, comprar en el marketplace, o convertirlos a 
                otras monedas. ¡Cada claim cuenta para construir tu futuro financiero!
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
      </div>
      <Footer />
    </div>
  );
}
