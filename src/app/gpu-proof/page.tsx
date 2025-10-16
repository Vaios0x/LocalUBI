'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Play, Square, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { getNumbersService } from '@/lib/numbers-protocol';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

export default function GPUProofPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [currentJob, setCurrentJob] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const numbersService = getNumbersService();

  const jobTypes = [
    { id: 'ai_training', name: 'AI Training', description: 'Entrenamiento de modelos de IA' },
    { id: 'rendering', name: '3D Rendering', description: 'Renderizado de gráficos 3D' },
    { id: 'mining', name: 'Crypto Mining', description: 'Minería de criptomonedas' },
    { id: 'research', name: 'Research', description: 'Cálculos de investigación científica' }
  ];

  const startJob = async (jobType: string) => {
    try {
      setIsRunning(true);
      setError(null);

      const jobId = `job_${Date.now()}`;
      const startTime = new Date();
      
      const job = {
        id: jobId,
        type: jobType,
        userId: 'user_123',
        startTime,
        status: 'running',
        gpuHours: 0,
        outputHash: ''
      };

      setCurrentJob(job);
      setJobs(prev => [...prev, job]);

      // Simular trabajo de GPU
      const duration = Math.random() * 30000 + 10000; // 10-40 segundos
      const interval = setInterval(() => {
        setCurrentJob(prev => ({
          ...prev,
          gpuHours: prev.gpuHours + 0.1
        }));
      }, 1000);

      setTimeout(async () => {
        clearInterval(interval);
        
        const endTime = new Date();
        const gpuHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
        const outputHash = `output_${jobId}_${Date.now()}`;

        // Crear recibo de uso de GPU
        const receipt = await numbersService.createGPUReceipt(
          jobId,
          'user_123',
          startTime,
          endTime,
          jobType,
          outputHash
        );

        const completedJob = {
          ...job,
          endTime,
          status: 'completed',
          gpuHours,
          outputHash,
          receipt
        };

        setCurrentJob(null);
        setJobs(prev => prev.map(j => j.id === jobId ? completedJob : j));
        setIsRunning(false);
      }, duration);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error starting job');
      setIsRunning(false);
    }
  };

  const stopJob = () => {
    if (currentJob) {
      setCurrentJob(prev => ({ ...prev, status: 'stopped' }));
      setIsRunning(false);
    }
  };

  const verifyJob = async (job: any) => {
    try {
      if (job.receipt) {
        const isValid = await numbersService.verifyReceipt(job.receipt);
        if (isValid) {
          alert('Trabajo verificado exitosamente');
        } else {
          alert('Trabajo no válido');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error verifying job');
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
              GPU Proof
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Documenta y verifica el uso de GPU con pruebas criptográficas inmutables
          </p>
        </motion.div>

        {/* Current Job */}
        {currentJob && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Cpu className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Trabajo en Progreso: {currentJob.type}
                  </h3>
                  <p className="text-sm text-white/70">
                    ID: {currentJob.id}
                  </p>
                </div>
              </div>
              
              <button
                onClick={stopJob}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                <Square className="w-4 h-4 mr-2" />
                Detener
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">GPU Hours:</span>
                <span className="text-white font-mono">{currentJob.gpuHours.toFixed(2)}</span>
              </div>
              
              <div className="w-full bg-white/10 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((currentJob.gpuHours / 2) * 100, 100)}%` }}
                  className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                />
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Estado:</span>
                <span className="text-green-400 flex items-center">
                  <Clock className="w-4 h-4 mr-1 animate-spin" />
                  Ejecutando
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Job Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {jobTypes.map((type) => (
            <motion.div
              key={type.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startJob(type.id)}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 cursor-pointer hover:bg-white/15 transition-all"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Cpu className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {type.name}
                </h3>
                <p className="text-sm text-white/70 mb-4">
                  {type.description}
                </p>
                <button
                  disabled={isRunning}
                  className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-4 h-4 mr-2 inline" />
                  Iniciar
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Jobs History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Historial de Trabajos</h2>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-8">
              <Cpu className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60">No hay trabajos ejecutados aún</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        job.status === 'completed' ? 'bg-green-400' :
                        job.status === 'running' ? 'bg-yellow-400' :
                        'bg-red-400'
                      }`} />
                      <div>
                        <h4 className="text-white font-medium">
                          {job.type} - {job.id}
                        </h4>
                        <p className="text-sm text-white/70">
                          {new Date(job.startTime).toLocaleString('es-MX')}
                        </p>
                      </div>
                    </div>
                    
                    {job.status === 'completed' && (
                      <button
                        onClick={() => verifyJob(job)}
                        className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full hover:bg-green-500/30 transition-colors"
                      >
                        Verificar
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-white/70">GPU Hours:</span>
                      <div className="text-white font-mono">
                        {job.gpuHours ? job.gpuHours.toFixed(2) : '0.00'}
                      </div>
                    </div>
                    <div>
                      <span className="text-white/70">Estado:</span>
                      <div className={`font-medium ${
                        job.status === 'completed' ? 'text-green-400' :
                        job.status === 'running' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {job.status === 'completed' ? 'Completado' :
                         job.status === 'running' ? 'Ejecutando' :
                         'Detenido'}
                      </div>
                    </div>
                    <div>
                      <span className="text-white/70">Output Hash:</span>
                      <div className="text-white font-mono text-xs">
                        {job.outputHash ? `${job.outputHash.slice(0, 12)}...` : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <span className="text-white/70">Recibo:</span>
                      <div className="text-white text-xs">
                        {job.receipt ? '✓ Creado' : '⏳ Pendiente'}
                      </div>
                    </div>
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
