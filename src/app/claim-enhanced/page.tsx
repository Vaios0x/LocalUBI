'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coins, Shield, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useEnhancedUBI } from '@/hooks/useEnhancedUBI';
import { UBICalculator } from '@/components/ui/UBICalculator';
import { ReputationCard } from '@/components/ui/ReputationCard';
import { PrivacyShield } from '@/components/ui/PrivacyShield';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import confetti from 'canvas-confetti';

export default function ClaimEnhancedPage() {
  const {
    user,
    setUser,
    community,
    setCommunity,
    claims,
    processClaim,
    isProcessingClaim,
    calculation,
    eligibility,
    stats,
    error,
    clearError
  } = useEnhancedUBI();

  const [showConfetti, setShowConfetti] = useState(false);
  const [lastClaim, setLastClaim] = useState<any>(null);

  // Inicializar datos de demostración
  useEffect(() => {
    if (!user) {
      const demoUser = {
        id: 'user_123',
        address: '0x1234567890123456789012345678901234567890',
        reputationScore: 75,
        claimHistory: [],
        totalClaimed: 0,
        streak: 0,
        lastClaimDate: new Date(Date.now() - 25 * 60 * 60 * 1000), // 25 horas atrás
        eligibility: true
      };
      setUser(demoUser);
    }

    if (!community) {
      const demoCommunity = {
        id: 'community_1',
        name: 'LocalUbi México',
        members: [],
        totalPool: 10000,
        distributionRules: [],
        createdAt: new Date()
      };
      setCommunity(demoCommunity);
    }
  }, [user, community, setUser, setCommunity]);

  const handleClaim = async () => {
    const result = await processClaim();
    
    if (result.success && result.claim) {
      setLastClaim(result.claim);
      setShowConfetti(true);
      
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const getEligibilityStatus = () => {
    if (!eligibility) return { color: 'text-gray-400', icon: Clock, message: 'Verificando...' };
    
    if (eligibility.eligible) {
      return { 
        color: 'text-green-400', 
        icon: CheckCircle, 
        message: '¡Elegible para claim!' 
      };
    }
    
    return { 
      color: 'text-yellow-400', 
      icon: AlertCircle, 
      message: eligibility.reason || 'No elegible' 
    };
  };

  const eligibilityStatus = getEligibilityStatus();
  const EligibilityIcon = eligibilityStatus.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Claim UBI <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Mejorado</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Obtén tu UBI personalizado basado en reputación, racha y contribución comunitaria
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* UBI Calculator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            {calculation && (
              <UBICalculator 
                calculation={calculation} 
                showDetails={true}
              />
            )}
          </motion.div>

          {/* Reputation & Privacy */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Reputation Card */}
            {user && (
              <ReputationCard 
                reputationData={{
                  userId: user.id,
                  score: user.reputationScore,
                  factors: {
                    tandaParticipation: 80,
                    paymentReliability: 90,
                    communityContribution: 70,
                    ubiClaimConsistency: 85
                  },
                  lastUpdated: new Date()
                }}
                showDetails={true}
              />
            )}

            {/* Privacy Shield */}
            <PrivacyShield
              isActive={true}
              privacyLevel="maximum"
              showDetails={true}
            />
          </motion.div>
        </div>

        {/* Claim Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Coins className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Claim UBI</h2>
                <p className="text-white/70">Recibe tu UBI personalizado</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <EligibilityIcon className={`w-5 h-5 ${eligibilityStatus.color}`} />
              <span className={`text-sm font-medium ${eligibilityStatus.color}`}>
                {eligibilityStatus.message}
              </span>
            </div>
          </div>

          {/* Claim Button */}
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClaim}
              disabled={!eligibility?.eligible || isProcessingClaim}
              className={`
                px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300
                ${eligibility?.eligible && !isProcessingClaim
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-green-500/25'
                  : 'bg-white/10 text-white/50 cursor-not-allowed'
                }
              `}
            >
              {isProcessingClaim ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Procesando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Coins className="w-5 h-5" />
                  <span>Claim UBI</span>
                </div>
              )}
            </motion.button>

            {eligibility?.nextEligible && (
              <p className="text-sm text-white/60 mt-3">
                Próximo claim disponible: {eligibility.nextEligible.toLocaleString('es-MX')}
              </p>
            )}
          </div>
        </motion.div>

        {/* Recent Claims */}
        {claims.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
              Claims Recientes
            </h3>
            
            <div className="space-y-3">
              {claims.slice(-5).map((claim, index) => (
                <motion.div
                  key={claim.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Coins className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {claim.amount} G$ • {claim.reason === 'daily' ? 'Diario' : 'Bonus'}
                      </div>
                      <div className="text-xs text-white/60">
                        {claim.timestamp.toLocaleString('es-MX')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-400 font-medium">
                      {claim.multiplier.toFixed(2)}x
                    </div>
                    <div className="text-xs text-white/60">
                      Multiplicador
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Success Animation */}
        {showConfetti && lastClaim && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-green-500/20 backdrop-blur-lg border border-green-400/30 rounded-2xl p-8 text-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">
                ¡Claim Exitoso!
              </h3>
              <p className="text-green-400 font-semibold text-lg">
                +{lastClaim.amount} G$ recibidos
              </p>
              <p className="text-white/70 text-sm mt-2">
                Multiplicador: {lastClaim.multiplier.toFixed(2)}x
              </p>
            </div>
          </motion.div>
        )}

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-red-500/20 border border-red-400/30 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-medium">Error</span>
              </div>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-300"
              >
                ×
              </button>
            </div>
            <p className="text-red-300 mt-2">{error}</p>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
