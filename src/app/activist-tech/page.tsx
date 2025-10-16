'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, MessageSquare, FileText, Users, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { getActivistTechService } from '@/lib/activist-tech';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

export default function ActivistTechPage() {
  const [tools, setTools] = useState<any[]>([]);
  const [communications, setCommunications] = useState<any[]>([]);
  const [documentation, setDocumentation] = useState<any[]>([]);
  const [networks, setNetworks] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activistTechService = getActivistTechService();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [toolsData, documentationData, metricsData] = await Promise.all([
        activistTechService.getAvailableTools(),
        activistTechService.getDocumentation(),
        activistTechService.getNetworkMetrics()
      ]);
      
      setTools(toolsData);
      setDocumentation(documentationData);
      setMetrics(metricsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading data');
    }
  };

  const handleCreateTool = async () => {
    try {
      setIsCreating(true);
      setError(null);

      const tool = await activistTechService.createActivistTool(
        'Secure Communication Tool',
        'Herramienta para comunicación segura entre activistas',
        'communication',
        ['end-to-end encryption', 'metadata protection', 'secure key exchange'],
        'maximum'
      );

      setTools(prev => [...prev, tool]);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating tool');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateCommunication = async () => {
    try {
      setIsCreating(true);
      setError(null);

      const communication = await activistTechService.establishSecureCommunication(
        ['activist_1', 'activist_2'],
        'text',
        'Mensaje urgente sobre la situación actual',
        'high',
        'Ciudad de México'
      );

      setCommunications(prev => [...prev, communication]);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating communication');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDocumentIncident = async () => {
    try {
      setIsCreating(true);
      setError(null);

      const doc = await activistTechService.documentIncident(
        'Incidente de Derechos Humanos',
        'Descripción detallada del incidente ocurrido',
        'incident',
        {
          coordinates: [19.4326, -99.1332],
          address: 'Ciudad de México, México'
        },
        {
          photos: ['photo1.jpg', 'photo2.jpg'],
          videos: ['video1.mp4'],
          audio: ['audio1.wav'],
          documents: ['report.pdf']
        },
        ['witness_1', 'witness_2']
      );

      setDocumentation(prev => [...prev, doc]);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error documenting incident');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateNetwork = async () => {
    try {
      setIsCreating(true);
      setError(null);

      const network = await activistTechService.createActivistNetwork(
        'Red de Activistas México',
        'Red de activistas para la defensa de derechos humanos',
        'maximum',
        ['secure_chat', 'encrypted_email', 'voice_calls'],
        ['emergency_1', 'emergency_2', 'emergency_3']
      );

      setNetworks(prev => [...prev, network]);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating network');
    } finally {
      setIsCreating(false);
    }
  };

  const handleVerifySecurity = async (communicationId: string) => {
    try {
      const result = await activistTechService.verifyCommunicationSecurity(communicationId);
      
      if (result.isSecure) {
        alert(`Comunicación verificada: ${result.encryptionStrength.toFixed(1)}% seguridad`);
      } else {
        alert(`Comunicación no segura: ${result.vulnerabilities.join(', ')}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error verifying security');
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

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-white/60';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900">
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400">
              Activist Tech
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Tecnología resiliente para activistas y defensores de derechos humanos
          </p>
        </motion.div>

        {/* Network Metrics */}
        {metrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Shield className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Métricas de Red</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{metrics.totalTools}</div>
                <div className="text-sm text-white/70">Herramientas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{metrics.activeCommunications}</div>
                <div className="text-sm text-white/70">Comunicaciones</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{metrics.documentedIncidents}</div>
                <div className="text-sm text-white/70">Incidentes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{metrics.emergencyProtocols}</div>
                <div className="text-sm text-white/70">Protocolos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{metrics.securityScore.toFixed(1)}%</div>
                <div className="text-sm text-white/70">Seguridad</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateTool}
            disabled={isCreating}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center hover:bg-white/15 transition-all disabled:opacity-50"
          >
            <Shield className="w-8 h-8 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Crear Herramienta
            </h3>
            <p className="text-white/70 text-sm">
              Herramienta para activistas
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateCommunication}
            disabled={isCreating}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center hover:bg-white/15 transition-all disabled:opacity-50"
          >
            <MessageSquare className="w-8 h-8 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Comunicación Segura
            </h3>
            <p className="text-white/70 text-sm">
              Mensaje encriptado
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDocumentIncident}
            disabled={isCreating}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center hover:bg-white/15 transition-all disabled:opacity-50"
          >
            <FileText className="w-8 h-8 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Documentar Incidente
            </h3>
            <p className="text-white/70 text-sm">
              Evidencia segura
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateNetwork}
            disabled={isCreating}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center hover:bg-white/15 transition-all disabled:opacity-50"
          >
            <Users className="w-8 h-8 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Crear Red
            </h3>
            <p className="text-white/70 text-sm">
              Red de activistas
            </p>
          </motion.button>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Tools */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Shield className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Herramientas</h2>
            </div>

            {tools.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <p className="text-white/60">No hay herramientas disponibles</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tools.slice(0, 3).map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white/5 rounded-lg p-4 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full" />
                        <div>
                          <h4 className="text-white font-medium">{tool.name}</h4>
                          <p className="text-sm text-white/70">{tool.category}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-sm font-medium ${getPrivacyLevelColor(tool.privacyLevel)}`}>
                          {getPrivacyLevelLabel(tool.privacyLevel)}
                        </div>
                        <div className="text-xs text-white/60">
                          {tool.status}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-white/70 text-sm mb-3 line-clamp-2">
                      {tool.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {tool.features.slice(0, 3).map((feature: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Communications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <MessageSquare className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Comunicaciones</h2>
            </div>

            {communications.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <p className="text-white/60">No hay comunicaciones</p>
              </div>
            ) : (
              <div className="space-y-4">
                {communications.map((comm, index) => (
                  <motion.div
                    key={comm.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white/5 rounded-lg p-4 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          comm.metadata.urgency === 'critical' ? 'bg-red-400' :
                          comm.metadata.urgency === 'high' ? 'bg-orange-400' :
                          'bg-green-400'
                        }`} />
                        <div>
                          <h4 className="text-white font-medium">
                            Comunicación {comm.id.slice(-8)}
                          </h4>
                          <p className="text-sm text-white/70">
                            {comm.participants.length} participantes
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleVerifySecurity(comm.id)}
                        className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full hover:bg-green-500/30 transition-colors"
                      >
                        Verificar
                      </button>
                    </div>
                    
                    <p className="text-white/70 text-sm mb-3 line-clamp-2">
                      {comm.message}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className={`font-medium ${getUrgencyColor(comm.metadata.urgency)}`}>
                        {comm.metadata.urgency.toUpperCase()}
                      </span>
                      <span className="text-white/60">
                        {new Date(comm.timestamp).toLocaleString('es-MX')}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Documentation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Documentación</h2>
          </div>

          {documentation.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60">No hay documentación disponible</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documentation.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        doc.verified ? 'bg-green-400' : 'bg-yellow-400'
                      }`} />
                      <div>
                        <h4 className="text-white font-medium">{doc.title}</h4>
                        <p className="text-sm text-white/70">
                          {doc.type} • {doc.location.address}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-white/70">
                        {doc.evidence.photos.length + doc.evidence.videos.length} archivos
                      </div>
                      <div className="text-xs text-white/60">
                        {doc.witnesses.length} testigos
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">
                    {doc.content}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium ${
                      doc.verified ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {doc.verified ? 'Verificado' : 'Pendiente'}
                    </span>
                    <span className="text-white/60">
                      {new Date(doc.createdAt).toLocaleDateString('es-MX')}
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
