'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Brain, CheckCircle, Settings } from 'lucide-react';
import { PrivacyShield } from '@/components/ui/PrivacyShield';
import { ReputationCard } from '@/components/ui/ReputationCard';
import { ComputationStatus } from '@/components/ui/ComputationStatus';
import { useNillion } from '@/hooks/useNillion';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

export default function PrivacyPage() {
  const [privacyLevel, setPrivacyLevel] = useState<'basic' | 'enhanced' | 'maximum'>('enhanced');
  const [isPrivacyActive, setIsPrivacyActive] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState('user_123');
  
  const {
    reputationData,
    calculateReputation,
    isCalculatingReputation,
    computations,
    error,
    clearError
  } = useNillion();

  // Simular datos de usuario para demostración
  const mockUserData = {
    userId: selectedUserId,
    tandaHistory: [
      { id: 't1', status: 'completed', amount: 1000 },
      { id: 't2', status: 'active', amount: 500 },
      { id: 't3', status: 'completed', amount: 750 }
    ],
    paymentHistory: {
      totalPayments: 15,
      onTimePayments: 14,
      latePayments: 1
    },
    communityActivity: {
      contributions: 8,
      eventsAttended: 5,
      helpProvided: 12
    },
    ubiClaims: {
      totalClaims: 45,
      consistentDays: 28,
      lastClaim: new Date()
    }
  };

  const handleCalculateReputation = async () => {
    await calculateReputation(selectedUserId, mockUserData);
  };

  const privacyFeatures = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Encriptación End-to-End',
      description: 'Todos los datos se encriptan antes de ser procesados',
      level: 'enhanced'
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'Computación Privada',
      description: 'Los cálculos se realizan sin exponer datos sensibles',
      level: 'maximum'
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Zero-Knowledge Proofs',
      description: 'Verificaciones sin revelar información personal',
      level: 'maximum'
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'Datos Anónimos',
      description: 'Identificadores únicos sin información personal',
      level: 'basic'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Centro de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Privacidad</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Protege tu información personal con tecnología de vanguardia de Nillion Network
          </p>
        </motion.div>

        {/* Privacy Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Privacy Shield */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Settings className="w-6 h-6 mr-3 text-blue-400" />
              Configuración de Privacidad
            </h2>
            
            <PrivacyShield
              isActive={isPrivacyActive}
              privacyLevel={privacyLevel}
              onToggle={setIsPrivacyActive}
              showDetails={true}
            />

            {/* Privacy Level Selector */}
            <div className="mt-6 space-y-3">
              <h3 className="text-lg font-semibold text-white">Nivel de Privacidad</h3>
              {[
                { value: 'basic', label: 'Básico', desc: 'Protección mínima' },
                { value: 'enhanced', label: 'Mejorado', desc: 'Protección avanzada' },
                { value: 'maximum', label: 'Máximo', desc: 'Privacidad total' }
              ].map((level) => (
                <button
                  key={level.value}
                  onClick={() => setPrivacyLevel(level.value as any)}
                  className={`w-full p-3 rounded-lg border transition-all ${
                    privacyLevel === level.value
                      ? 'border-blue-400 bg-blue-500/20 text-blue-400'
                      : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-medium">{level.label}</div>
                    <div className="text-sm opacity-70">{level.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Reputation Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Shield className="w-6 h-6 mr-3 text-green-400" />
              Score de Reputación
            </h2>
            
            {reputationData ? (
              <ReputationCard 
                reputationData={reputationData} 
                showDetails={true}
              />
            ) : (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center">
                <Brain className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Calcular Reputación
                </h3>
                <p className="text-white/70 mb-6">
                  Obtén tu score de reputación basado en tu actividad en la comunidad
                </p>
                <button
                  onClick={handleCalculateReputation}
                  disabled={isCalculatingReputation}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50"
                >
                  {isCalculatingReputation ? 'Calculando...' : 'Calcular Reputación'}
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Privacy Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Características de Privacidad
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {privacyFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                className={`bg-white/10 backdrop-blur-lg border rounded-xl p-6 hover:bg-white/15 transition-all ${
                  feature.level === privacyLevel ? 'border-blue-400/50' : 'border-white/20'
                }`}
              >
                <div className="text-blue-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/70 text-sm">
                  {feature.description}
                </p>
                {feature.level === privacyLevel && (
                  <div className="mt-3 flex items-center text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Activo
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Computations Status */}
        {computations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Computaciones en Progreso
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {computations.slice(-4).map((computation) => (
                <ComputationStatus
                  key={computation.id}
                  computation={computation}
                  showProgress={true}
                />
              ))}
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
                <div className="w-2 h-2 bg-red-400 rounded-full" />
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
