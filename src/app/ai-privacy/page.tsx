'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Shield, Lock, Eye, Cpu, CheckCircle, AlertCircle } from 'lucide-react';
import { getAIPrivacyService } from '@/lib/ai-privacy';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

export default function AIPrivacyPage() {
  const [models, setModels] = useState<any[]>([]);
  const [datasets, setDatasets] = useState<any[]>([]);
  const [currentJob, setCurrentJob] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const aiPrivacyService = getAIPrivacyService();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [modelsData, datasetsData] = await Promise.all([
        aiPrivacyService.getAvailableModels(),
        aiPrivacyService.getDatasets()
      ]);
      
      setModels(modelsData);
      setDatasets(datasetsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading data');
    }
  };

  const handleTrainModel = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      const trainingData = [
        { feature1: 1, feature2: 2, label: 'positive' },
        { feature1: 3, feature2: 4, label: 'negative' },
        { feature1: 5, feature2: 6, label: 'positive' }
      ];

      const model = await aiPrivacyService.trainPrivacyPreservingModel(
        'Privacy-Preserving Classifier',
        trainingData,
        'maximum',
        0.5
      );

      setModels(prev => [...prev, model]);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error training model');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInference = async (modelId: string) => {
    try {
      setIsProcessing(true);
      setError(null);

      const inputData = { feature1: 2, feature2: 3 };
      
      const inference = await aiPrivacyService.performHomomorphicInference(
        modelId,
        inputData,
        'maximum'
      );

      setCurrentJob(inference);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error performing inference');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateContent = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      const result = await aiPrivacyService.generatePrivateContent(
        'Generate a privacy-focused article about AI',
        'text',
        'maximum'
      );

      console.log('Generated content:', result);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generating content');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPrivacyLevelColor = (level: string) => {
    switch (level) {
      case 'maximum': return 'text-green-400';
      case 'enhanced': return 'text-blue-400';
      case 'basic': return 'text-yellow-400';
      default: return 'text-white/60';
    }
  };

  const getPrivacyLevelLabel = (level: string) => {
    switch (level) {
      case 'maximum': return 'Máxima Privacidad';
      case 'enhanced': return 'Privacidad Mejorada';
      case 'basic': return 'Privacidad Básica';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              AI Privacy
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Inteligencia artificial con privacidad total usando computación homomórfica y privacidad diferencial
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTrainModel}
            disabled={isProcessing}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center hover:bg-white/15 transition-all disabled:opacity-50"
          >
            <Brain className="w-8 h-8 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Entrenar Modelo
            </h3>
            <p className="text-white/70 text-sm">
              Entrenar con privacidad diferencial
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleInference(models[0]?.id || 'model_1')}
            disabled={isProcessing || models.length === 0}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center hover:bg-white/15 transition-all disabled:opacity-50"
          >
            <Cpu className="w-8 h-8 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Inferencia
            </h3>
            <p className="text-white/70 text-sm">
              Computación homomórfica
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerateContent}
            disabled={isProcessing}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center hover:bg-white/15 transition-all disabled:opacity-50"
          >
            <Eye className="w-8 h-8 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Generar Contenido
            </h3>
            <p className="text-white/70 text-sm">
              Creación privada de contenido
            </p>
          </motion.button>
        </motion.div>

        {/* Current Job */}
        {currentJob && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Cpu className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Inferencia en Progreso
                </h3>
                <p className="text-sm text-white/70">
                  Modelo: {currentJob.modelId}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-white/70">Resultado:</span>
                <div className="text-white font-mono">
                  {currentJob.result || 'Procesando...'}
                </div>
              </div>
              <div>
                <span className="text-white/70">Confianza:</span>
                <div className="text-white">
                  {currentJob.confidence ? `${(currentJob.confidence * 100).toFixed(1)}%` : 'N/A'}
                </div>
              </div>
              <div>
                <span className="text-white/70">Tiempo:</span>
                <div className="text-white">
                  {currentJob.processingTime ? `${currentJob.processingTime}ms` : 'N/A'}
                </div>
              </div>
              <div>
                <span className="text-white/70">Energía:</span>
                <div className="text-white">
                  {currentJob.energyCost ? `${currentJob.energyCost.toFixed(2)} kWh` : 'N/A'}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Models */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Modelos de IA</h2>
          </div>

          {models.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60">No hay modelos disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.map((model, index) => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{model.name}</h4>
                      <p className="text-sm text-white/60">
                        {model.type} • {model.accuracy ? `${(model.accuracy * 100).toFixed(1)}%` : 'N/A'} accuracy
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">
                    {model.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium ${getPrivacyLevelColor('maximum')}`}>
                      {getPrivacyLevelLabel('maximum')}
                    </span>
                    <span className="text-white/60">
                      {model.trainingData.size} samples
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Datasets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Datasets Privados</h2>
          </div>

          {datasets.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60">No hay datasets disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {datasets.map((dataset, index) => (
                <motion.div
                  key={dataset.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Lock className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{dataset.name}</h4>
                      <p className="text-sm text-white/60">
                        {dataset.category} • {dataset.size.toLocaleString()} records
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">
                    {dataset.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium ${
                      dataset.privacyLevel === 'private' ? 'text-red-400' :
                      dataset.privacyLevel === 'restricted' ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {dataset.privacyLevel}
                    </span>
                    <span className="text-white/60">
                      {dataset.contributors.length} contributors
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-red-500/20 border border-red-400/30 rounded-lg p-4"
          >
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-medium">Error</span>
            </div>
            <p className="text-red-300 mt-2">{error}</p>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
